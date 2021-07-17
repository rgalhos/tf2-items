import * as fs from "fs";
import axios from "axios";
import * as skuUtils from "../lib/sku";
import * as itemAttributes from "../lib/attributes";
import IRawSchemaOverview from "../interfaces/IRawSchemaOverview";
import IRawSchemaItems from "../interfaces/IRawSchemaItems";
import ISchemaItem from "../interfaces/ISchemaItem";
import EQuality from "../enums/EQuality";
const vdf = require("vdf");

const ITEMSGAME_URL = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/scripts/items/items_game.txt";
const LOCALIZATION_TF_ENGLISH = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_english.txt";
const SCHEMA_OVERVIEW_URL = "http://api.steampowered.com/IEconItems_440/GetSchemaOverview/v0001/";
const SCHEMA_ITEMS = "http://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/";

export default class Schema {
    // Items
    private readonly itemsByDefindex = new Map<number, string>();
    private readonly itemsByName = new Map<string, number>();
    private readonly itemSchema = new Map<number, ISchemaItem>();

    // Unusual effects
    private readonly effectsById = new Map<number, string>();
    private readonly effectsByName = new Map<string, number>();

    // Raw data
    private rawSchemaOverview: null | IRawSchemaOverview = null;
    private rawSchemaItems: null | IRawSchemaItems = null;
    private rawItemsGame: any;

    private readonly steamApiKey: string;
    private ready: boolean = false;

    constructor(steamApiKey: string) {
        if (!steamApiKey) {
            throw new Error("no steam api key");
        }

        this.steamApiKey = steamApiKey;
    }

    public get isReady() : boolean {
        return this.ready;
    }

    public load() {
        return this.loadSchemaOverview().then(this.loadItemSchema.bind(this));
    }

    public loadItemSchema() : Promise<void> {
        if (!this.rawSchemaItems) {
            return this.downloadItemSchema().then(this.loadItemSchema);
        }

        return new Promise((resolve, reject) => {
            if (!this.rawSchemaItems) {
                return reject("item schema not loaded");
            }

            this.rawSchemaItems = this.rawSchemaItems as IRawSchemaItems;

            for (let item of this.rawSchemaItems.items) {
                const { defindex, item_name } = item;

                // Strangifier
                if (item_name === "Strangifier") {
                    this._addItem(defindex, item.name, item);
                }
                
                // Killstreak kits
                else if (item_name === "Kit") {
                    // 6527 = Basic
                    // 6523 = Specialized
                    // 6526 = Professional
                    // Ignore the rest
                    if (defindex === 6527 || defindex === 6523 || defindex === 6526) {
                        this._addItem(defindex, item.item_type_name as string, item);
                    }
                }

                // Crate
                else if (item.item_class === "supply_crate") {
                    // Cases
                    if (item_name.includes(" Case")) {
                        this._addItem(defindex, item_name, item);
                    }
                    // Crates with series number
                    else {
                        this._addItem(defindex, item_name + " #" + itemAttributes.getCrateSeries(item), item);
                    }
                }
                
                // Key
                else if (itemAttributes.isKey(item)) {
                    this._addItem(defindex, item.name, item);
                }
                
                // Skins
                else if (item.item_quality === EQuality.DecoratedWeapon) {
                    this._addItem(defindex, item.name, item);
                }
                
                // Rest (excluding stock weapons)
                else if (defindex > 30 && defindex !== 735 && defindex !== 1132) {
                    this._addItem(defindex, item_name, item);
                }
            }

            //
            // Special cases
            //
            // Items that need to be deleted
            for (const [ id, name ] of [
                [ 2093, "Name Tag For Bundles" ],
                /*
                [ 27, "Construction PDA" ],
                [ 735, "Sapper" ],
                [ 1132, "Spellbook Magazine" ],
                */
            ]) {
                this._deleteItem(id as number, name as string);
            }

            resolve();
        });
    }

    public loadSchemaOverview() : Promise<void> {
        return new Promise((resolve, reject) => {
            axios.get(SCHEMA_OVERVIEW_URL, {
                params: {
                    key: this.steamApiKey,
                    language: "english",
                }
            }).then(({ status, statusText, data }) => {
                if (status !== 200) {
                    return reject(`failed to get schema overview: ${statusText} (${status})`);
                } else if (!data || !data.result || data.result.status !== 1) {
                    return reject("failed to get schema overview: invalid response");
                }

                const schemaOverview: IRawSchemaOverview = data.result;
                this.rawSchemaOverview = schemaOverview;

                // List of unusual effects
                schemaOverview.attribute_controlled_attached_particles.forEach((unusual) => {
                    if (unusual.system.startsWith("unusual_")
                        || unusual.system.startsWith("utaunt_")
                        || unusual.system.startsWith("superrare_")
                        || unusual.system === "community_sparkle"
                    ) {
                        this._addUnusualEffect(unusual.id, unusual.name);
                    }
                });

                resolve();
            });
        });
    }

    public async downloadItemSchema() : Promise<void> {
        const self = this;

        function _downloadItemSchema(start = 0) : Promise<number | null> {
            return new Promise((resolve, reject) => {
                axios.get(SCHEMA_ITEMS, {
                    params: {
                        key: self.steamApiKey,
                        language: "english",
                        start: start,
                    }
                }).then(({ status, statusText, data }) => {
                    if (status !== 200) {
                        return reject(`failed to get full item schema: status code not 200: ${statusText} (${status})`);
                    }
    
                    if (!self.rawItemsGame.hasOwnProperty("items")) {
                        self.rawItemsGame = data.result;
                    } else {
                        self.rawItemsGame.items = self.rawItemsGame.items.concat(data.result.items);
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

        let index: number | null = 0;

        while (index !== null)
            index = await _downloadItemSchema(index);

        return;
    }

    public saveSchema(path: fs.PathOrFileDescriptor, version: string = "1.3.0") : Promise<void> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            if (!this.isReady || Object.keys(this.rawSchemaItems).length === 0) {
                return reject("schema not loaded");
            }

            fs.writeFile(path, JSON.stringify({
                success: true,
                version: version,
                time: Date.now(),
                raw: {
                    schema: {
                        ...this.rawSchemaOverview,
                        items: (this.rawSchemaItems as IRawSchemaItems).items,
                    },
                    // items_game: this.rawItemsGame,
                }
            }), (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            })
        });
    }

    public getRawSchemaOverview() {
        return this.rawSchemaOverview;
    }

    public getRawSchemaItems() {
        return this.rawSchemaItems;
    }

    public getItemNameByDefindex(defindex: number) {
        return this.itemsByDefindex.get(Number(defindex));
    }

    public getItemDefindexByName(name: string) {
        return this.itemsByName.get(normalizeName(name));
    }

    public getUnusualEffectById(id: number) {
        return this.effectsById.get(Number(id));
    }

    public getUnusualEffectByName(name: string) {
        return this.effectsByName.get(name);
    }

    public getAllUnusualEffects() {
        return Array.from(this.effectsById.entries());
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

    private _addItem(defindex: number, name: string, item: ISchemaItem) {
        this.itemsByDefindex.set(defindex, name);
        this.itemsByName.set(normalizeName(name), defindex);
        this.itemSchema.set(defindex, item);
    }

    private _addUnusualEffect(id: number, name: string) {
        this.effectsById.set(id, name);
        this.effectsByName.set(normalizeName(name), id);
    }

    private _deleteItem(defindex: number, name: string) {
        this.itemsByDefindex.delete(defindex);
        this.itemsByName.delete(normalizeName(name));
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
