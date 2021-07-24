import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import * as skuUtils from "../lib/sku";
import * as itemAttributes from "../lib/attributes";
import IRawSchemaOverview from "../interfaces/IRawSchemaOverview";
import IRawSchemaItems from "../interfaces/IRawSchemaItems";
import ISchemaItem from "../interfaces/ISchemaItem";
import EQuality from "../enums/EQuality";
import SchemaItem from "./SchemaItem";

const ITEMSGAME_URL = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/scripts/items/items_game.txt";
const LOCALIZATION_TF_ENGLISH = "https://raw.githubusercontent.com/SteamDatabase/GameTracking-TF2/master/tf/resource/tf_english.txt";
const SCHEMA_OVERVIEW_URL = "http://api.steampowered.com/IEconItems_440/GetSchemaOverview/v0001/";
const SCHEMA_ITEMS = "http://api.steampowered.com/IEconItems_440/GetSchemaItems/v0001/";

export default class Schema {
    // Items
    private readonly itemsByDefindex = new Map<number, string>();
    private readonly itemsByName = new Map<string, number>();
    private readonly itemSchema = new Map<number, SchemaItem>();

    // Unusual effects
    private readonly effectsById = new Map<number, string>();
    private readonly effectsByName = new Map<string, number>();

    // Raw data
    private rawSchemaOverview: null | IRawSchemaOverview = null;
    private rawSchemaItems: null | IRawSchemaItems = null;

    // Options
    public options: SchemaOptions = {
        cacheSchema: true,
        cacheFilePath: "../../cache/schema.json",
        enableGenericStrangifiers: false,
        enableGenericUnusualifiers: false,
        enableGenericCrates: 5022,
    };

    private readonly steamApiKey: string;
    private ready: boolean = false;

    constructor(options: string | SchemaOptions) {
        let steamApiKey: string;

        if (typeof options === "string") {
            steamApiKey = options;
        } else {
            steamApiKey = options.steamApiKey as string;
            delete options.steamApiKey;

            if (options.enableGenericCrates === true) {
                options.enableGenericCrates = 5022;
            } else if (options.enableGenericCrates !== false
                && options.enableGenericCrates !== undefined
                && typeof options.enableGenericCrates !== "number"
            ) {
                throw new Error("'enableGenericCrates' must be a defindex or boolean (true = #5022)");
            }

            Object.assign(this.options, options);
        }
        
        if (!steamApiKey) {
            throw new Error("no steam api key");
        }

        this.steamApiKey = steamApiKey;

        Object.defineProperty(this, "steamApiKey", {
            configurable: true,
            enumerable: false,
            value: steamApiKey
        });
    }

    public get isReady() : boolean {
        return this.ready;
    }

    /**
     * @async
     */
    public async load() {
        this.ready = false;

        await this.loadSchemaOverview();

        if (!this.options.cacheSchema) {
            console.debug("Option to cache schema is disabled");
            await this.downloadItemSchema();
        } else {
            console.debug("Option to cache schema is enabled!!!");
            try {
                await this._getCachedSchema();
            } catch(e) {
                console.debug(e);
                await this.downloadItemSchema();
            }
        }

        await this.loadItemSchema();

        this.ready = true;
    }

    public loadItemSchema() : Promise<void> {
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
                else if (itemAttributes.isCrate(item)) {
                    let series = itemAttributes.getCrateSeries(item);
                    
                    // Crates with series number
                    if (series) {
                        this._addItem(defindex, item_name + " #" + series, item);
                    }
                    // Cases
                    else {
                        this._addItem(defindex, item_name, item);
                    }
                }
                
                // Key (excluding Mann Co.)
                else if (itemAttributes.isKey(item) && defindex !== 5021) {
                    this._addItem(defindex, item.name, item);
                }
                
                // Exclude stock items
                else if (item.item_quality === EQuality.Normal) {
                    //
                }
                
                // Ignore "The " prefix
                else if (item.proper_name && !item.name.startsWith("The ")) {
                    this._addItem(defindex, item.name, item);
                }

                else {
                    this._addItem(defindex, item_name, item);
                }
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
                        || unusual.system.startsWith("weapon_unusual_")
                        || unusual.system === "community_sparkle"
                    ) {
                        this._addUnusualEffect(unusual.id, unusual.name);
                    }
                });

                resolve();
            });
        });
    }
    
    private _downloadItemSchema(start = 0) : Promise<number | null> {
        return new Promise((resolve, reject) => {
            axios.get(SCHEMA_ITEMS, {
                params: {
                    key: this.steamApiKey,
                    language: "english",
                    start: start,
                }
            }).then(({ status, statusText, data, headers }) => {
                if (status !== 200) {
                    return reject(`failed to get full item schema: status code not 200: ${statusText} (${status})`);
                }

                if (!this.rawSchemaItems) {
                    this.rawSchemaItems = data.result as IRawSchemaItems;
                    this.rawSchemaItems.headers = headers;
                } else {
                    this.rawSchemaItems.items = this.rawSchemaItems.items.concat(data.result.items);
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

    /**
     * @async
     */
    public async downloadItemSchema() : Promise<void> {
        console.debug("Downloading item schema...");

        let index: number | null = 0;

        while (index !== null)
            index = await this._downloadItemSchema(index);
        
        if (this.options.cacheSchema) {
            fs.writeFileSync(path.join(__dirname, this.options.cacheFilePath as string), JSON.stringify(this.rawSchemaItems), { encoding: "utf-8" });
        }

        return;
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
        return this.effectsByName.get(normalizeName(name));
    }

    public getItemSchema(defindex: number) {
        return this.itemSchema.get(Number(defindex));
    }

    public getAllItemsSchema() : SchemaItem[] {
        return Array.from(this.itemSchema.values());
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
        item.fullName = name;
        this.itemsByDefindex.set(defindex, name);
        this.itemsByName.set(normalizeName(name), defindex);
        this.itemSchema.set(defindex, new SchemaItem(item));
    }

    private _addUnusualEffect(id: number, name: string) {
        this.effectsById.set(id, name);
        this.effectsByName.set(normalizeName(name), id);
    }

    private _deleteItem(defindex: number, name: string) {
        this.itemsByDefindex.delete(defindex);
        this.itemsByName.delete(normalizeName(name));
    }

    private _getCachedSchema() : Promise<void> {
        console.debug("Getting cached item schema...");

        return new Promise((resolve, reject) => {
            if (!this.options.cacheFilePath) {
                return reject("no cache file");
            }

            fs.readFile(path.join(__dirname, this.options.cacheFilePath) as string, { encoding: "utf-8" }, (err, data: any) => {
                if (err) {
                    return reject(err);
                }

                data = JSON.parse(data as string);

                this._getSchemaItemsHeader().then(headers => {
                    if (headers["last-modified"] === data.headers["last-modified"]) {
                        console.debug("Cached schema is up to date!");
                        this.rawSchemaItems = data;
                        resolve();
                    } else {
                        console.debug("Cached schema is out of date! Refreshing...");
                        reject("cached schema is outdated");
                    }
                }).catch(reject);
            });
        });
    }

    private _getSchemaItemsHeader() : Promise<any> {
        console.debug("Geting SchemaItems headers...");

        return new Promise((resolve, reject) => {
            axios({
                url: SCHEMA_ITEMS,
                method: "GET",
                params: {
                    key: this.steamApiKey,
                    language: "english",
                }
            }).then(({ headers }) => {
                console.debug("Got SchemaItems headers!", headers);
                resolve(headers);
            }).catch(reject);
        });
    }
}

function normalizeName(str: string) : string {
    return str
        .toLowerCase()
        .replace(/the /, '')
        .replace(/non-craftable /, '')
        .replace(/australium /, '')
        .replace(/festivized /, '')
        .replace(/ +/g, ' ')
        .trim()
    ;
}

interface SchemaOptions {
    steamApiKey?: string,
    cacheSchema?: boolean,
    cacheFilePath?: string,
    enableGenericStrangifiers?: boolean,
    enableGenericUnusualifiers?: boolean,
    enableGenericCrates?: number | boolean,
};

console.debug = (...args: any[]) => {
    if (process.argv[4] === "debug") {
        console.log(...args);
    }
}
