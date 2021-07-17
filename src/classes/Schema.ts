import * as fs from "fs";
import axios from "axios";
import * as skuUtils from "../lib/sku";
const vdf = require("vdf");

//const ITEMSGAME_URL = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/scripts/items/items_game.txt";
const LOCALIZATION_TF_ENGLISH = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_english.txt";
const SCHEMA_OVERVIEW_URL = "http://api.steampowered.com/IEconItems_440/GetSchemaOverview/v0001/";
const ITEMS_SCHEMA = "http://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/";

export default class Schema {
    private readonly rawItemsByDefindex = new Map<number, string>();
    private readonly itemsByDefindex = new Map<number, string>();
    private readonly itemsByName = new Map<string, number>();
    private readonly unusualEffectsById = new Map<number, string>();
    private readonly unusualEffectsByName = new Map<string, number>();
    private readonly steamApiKey: string;
    private rawSchemaOverview: any = {};
    private rawFullItemSchema: any = {};
    private rawItemsGame: any = {};
    private localization: any = {};
    private ready: boolean = false;

    constructor(steamApiKey: string, load: boolean = false) {
        if (!steamApiKey) {
            throw new Error("no steam api key");
        }

        this.steamApiKey = steamApiKey;

        if (load) {
            this.load();
        }
    }

    public get isReady() : boolean {
        return this.ready;
    }

    public getRawItemSchema() {
        return this.rawFullItemSchema;
    }

    public getRawItemsGame() {
        return this.rawItemsGame;
    }

    public load() {
        return this.loadLocalization().then(this.loadSchema.bind(this));
    }

    private _downloadFullItemSchema(start = 0) : Promise<number | null> {
        return new Promise((resolve, reject) => {
            axios.get(ITEMS_SCHEMA, {
                params: {
                    key: this.steamApiKey,
                    language: "english",
                    start: start
                }
            }).then(({ status, statusText, data }) => {
                if (status !== 200) {
                    return reject(`failed to get full item schema: status code not 200: ${statusText} (${status})`);
                }

                if (!this.rawFullItemSchema.hasOwnProperty("items")) {
                    this.rawFullItemSchema = data.result;
                } else {
                    this.rawFullItemSchema.items = this.rawFullItemSchema.items.concat(data.result.items);
                }

                if (data.result.next) {
                    resolve(data.result.next);
                } else {
                    resolve(null);
                }
            })
            .catch(reject);
        });
    }

    public async downloadFullItemSchema() : Promise<void> {
        let index: number | null = 0;

        while (index !== null) {
            index = await this._downloadFullItemSchema(index);
        }

        return;
    }

    public loadLocalization() : Promise<void> {
        return new Promise((resolve, reject) => {
            axios.get(LOCALIZATION_TF_ENGLISH).then(({ status, statusText, data }) => {
                if (status !== 200) {
                    return reject(`failed to get localization: ${statusText} (${status})`);
                }

                this.localization = vdf.parse(data).lang.Tokens;

                resolve();
            })
            .catch(reject);
        });
    }

    public loadSchema() : Promise<void> {
        this.ready = false;
        this.clearMaps();

        return new Promise((resolve, reject) => {
            axios.get(SCHEMA_OVERVIEW_URL, {
                params: {
                    key: this.steamApiKey,
                    language: "english",
                }
            }).then(({ status, statusText, data: schemaOverview }) => {
                if (status !== 200) {
                    return reject(`failed to get schema overview: ${statusText} (${status})`);
                }

                schemaOverview = schemaOverview.result;
                this.rawSchemaOverview = schemaOverview;

                if (schemaOverview.status !== 1) {
                    return reject("failed to get schema overview: invalid response");
                }

                // List of unusual effects
                schemaOverview.attribute_controlled_attached_particles.forEach((unusual: any) => {
                    if (unusual.system.startsWith("unusual_")
                        || unusual.system.startsWith("utaunt_")
                        || unusual.system.startsWith("superrare_")
                        || unusual.system === "community_sparkle"
                    ) {
                        this.addUnusualEffect(unusual.id, unusual.name);
                    }
                });

                // List of items
                axios.get(schemaOverview.items_game_url).then(({ status, statusText, data: items }) => {
                    if (status !== 200) {
                        return reject(`failed to get items_game: ${statusText} (${status})`);
                    }

                    this.rawItemsGame = vdf.parse(items).items_game;
                    items = Object.entries(this.rawItemsGame.items);

                    items.forEach(([ defindex, item ]: [number, any]) => {
                        if (item.item_name
                            && item.item_name[0] === '#'
                            && this.localization[item.item_name = item.item_name.substr(1)]
                        ) {
                            this.addItem(Number(defindex), this.localization[item.item_name]);
                        } else {
                            this.addItem(Number(defindex), item.name);
                        }
                    });

                    // remove "default"
                    // @ts-ignore
                    this.itemsByDefindex.delete("default");
                    this.itemsByName.delete("default");

                    ////////////////////////////
                    // BEGIN OF SPECIAL CASES //
                    ////////////////////////////

                    // "Name Tag For Bundles"
                    this.itemsByDefindex.delete(2093);
                    this.itemsByName.delete(normalizeName("Name Tag For Bundles"));

                    // Some items that must be renamed
                    for (const [id, item] of itemsThatNeedToBeRenamed) {
                        this.addItem(id as number, item as string);
                    }

                    //////////////////////////
                    // END OF SPECIAL CASES //
                    //////////////////////////

                    this.ready = true;
                    resolve();
                });
            })
            .catch(reject);
        });
    }

    public dumpSchema(path: fs.PathOrFileDescriptor, version = "1.3.0") : Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.isReady || Object.keys(this.rawFullItemSchema).length === 0) {
                return reject("schema not loaded");
            }

            fs.writeFile(path, JSON.stringify({
                success: true,
                version: version,
                time: Date.now(),
                raw: {
                    schema: {
                        ...this.rawSchemaOverview,
                        items: this.rawFullItemSchema.items,
                    },
                    items_game: this.rawItemsGame,
                }
            }), (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            })
        });
    }

    public getItemNameByDefindex(defindex: number) {
        return this.itemsByDefindex.get(Number(defindex));
    }

    public getItemDefindexByName(name: string) {
        return this.itemsByName.get(normalizeName(name));
    }

    public getRawItemNameByDefindex(defindex: number) {
        return this.rawItemsByDefindex.get(Number(defindex));
    }

    public getUnusualEffectById(id: number) {
        return this.unusualEffectsById.get(Number(id));
    }

    public getUnusualEffectByName(name: string) {
        return this.unusualEffectsByName.get(name);
    }

    public getAllUnusualEffects() {
        return Array.from(this.unusualEffectsById.values());
    }

    public getSkuFromFullName(fullName: string) {
        return skuUtils.fullNameToSku(fullName, this);
    }

    public skuToItemObject(sku: string) {
        return skuUtils.skuToItemObject(sku, this);
    }

    public skuToFullName(sku: string) {
        return skuUtils.skuToFullName(sku, this);
    }

    private clearMaps() {
        this.itemsByDefindex.clear();
        this.itemsByName.clear();
        this.unusualEffectsById.clear();
        this.unusualEffectsByName.clear();
    }

    private addItem(defindex: number, name: string) {
        let _name = normalizeName(name);
        this.rawItemsByDefindex.set(defindex, name);
        this.itemsByDefindex.set(defindex, _name);
        this.itemsByName.set(_name, defindex);
    }

    private addUnusualEffect(id: number, name: string) {
        this.unusualEffectsById.set(id, name);
        this.unusualEffectsByName.set(name, id);
    }
}

function normalizeName(str: string) : string {
    return str
        .toLowerCase()
        .replace("the ", '')
        .replace("non-craftable ", '')
        .replace("australium ", '')
        .replace("festivized ", '')
        .replace(/ +/g, ' ')
        .trim()
    ;
}

const itemsThatNeedToBeRenamed = [
    // Old taunts
    [167, "Taunt: High Five"],
    [438, "Taunt: The Director's Vision"],
    [463, "Taunt: The Schadenfreude"],
    [477, "Taunt: Meet The Medic"],
    [1106, "Taunt: Square Dance"],
    [1107, "Taunt: Flippin' Awesome"],
    [1108, "Taunt: Buy A Life"],
    [1109, "Taunt: Results Are In"],
    [1110, "Taunt: Rock, Paper, Scissors"],
    [1111, "Taunt: Skullcracker"],
    [1112, "Taunt: Party Trick"],
    [1113, "Taunt: Fresh Brewed Victory"],
    [1114, "Taunt: Spent Well Spirits"],
    [1115, "Taunt: Rancho Relaxo"],
    [1116, "Taunt: I See You"],
    [1117, "Taunt: Battin' a Thousand"],
    [1118, "Taunt: Conga"],
    [1119, "Taunt: Deep Fried Desire"],
    [1120, "Taunt: Oblooterated"],
    [30570, "Taunt: Pool Party"],

    // Stock weapons
    [190, "Bat"],
    [191, "Bottle"],
    [192, "Fire Axe"],
    [193, "Kukri"],
    [194, "Knife"],
    [195, "Fists"],
    [196, "Shovel"],
    [197, "Wrench"],
    [198, "Bonesaw"],
    [199, "Shotgun"],
    [200, "Scattergun"],
    [201, "Sniper Rifle"],
    [202, "Minigun"],
    [203, "SMG"],
    [204, "Syringe Gun"],
    [205, "Rocket Launcher"],
    [206, "Grenade Launcher"],
    [207, "Stickybomb Launcher"],
    [208, "Flame Thrower"],
    [209, "Pistol"],
    [210, "Revolver"],
    //[25, "Construction PDA"],
    [211, "Medi Gun"],
    [212, "Invis Watch"],
    //[735, "Sapper"],
    [736, "Sapper"],
    [737, "Construction PDA"],
    //[1132, "Spellbook Magazine"],
    [1070, "Spellbook Magazine"],

    // Noise Maker
    [280, "Noise Maker - Black Cat"],
    [281, "Noise Maker - Gremlin"],
    [282, "Noise Maker - Werewolf"],
    [283, "Noise Maker - Witch"],
    [284, "Noise Maker - Banshee"],
    [286, "Noise Maker - Crazy Laugh"],
    [288, "Noise Maker - Stabby"],
    [365, "Noise Maker - Koto"],
    [493, "Noise Maker - Fireworks"],

    // Misc
    [489, "Power Up Canteen"],
    [490, "Flip-Flops"],
    [1071, "Golden Frying Pan"],
    [5021, "Mann Co. Supply Crate Key"],
    [9258, "Taunt Unusualifier"]
];
