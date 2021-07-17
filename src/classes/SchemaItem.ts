import EQuality from "../enums/EQuality";
import IItemAttribute from "../interfaces/IItemAttribute";
import ISchemaItem from "../interfaces/ISchemaItem";
import ASchemaItem from "../interfaces/ASchemaItem";

export default class SchemaItem extends ASchemaItem {
    public name: string = super.name;
    public defindex: number = super.defindex;
    public item_name: string = super.item_name;
    public proper_name: boolean = super.proper_name;
    public model_player: string | null = super.model_player;
    public item_quality: EQuality | 255 = super.item_quality;
    public image_inventory: string | null = super.image_inventory;
    public min_ilevel: number = super.min_ilevel;
    public max_ilevel: number = super.max_ilevel;
    public image_url: string | null = super.image_url;
    public image_url_large: string | null = super.image_url_large;
    public craft_class: string = super.craft_class;
    public craft_material_type: string = super.craft_material_type;
    public used_by_classes = super.used_by_classes;
    public capabilities = super.capabilities;

    constructor(item: ISchemaItem) {
        super();

        Object.assign(this, item);

        for (const func of [
            "_get",
            "getAttribute",
            "getPaintColor",
            "getCrateSeries",
            "getCrateKey",
            "isCrate",
            "isKey",
            "isPaintCan",
            "isUntradableByDefault",
            "isVoodooSoul",
            "isHalloweenItem",
            "isNoiseMaker",
            "isRestricted",
            "isStrangifier",
            "isStrangeFilter",
            "isStrangePart",
            "hasHolidayRestriction",
            "getItemTarget"
        ]) {
            Object.defineProperty(this, func, {
                configurable: false,
                enumerable: false,
                // @ts-ignore
                value: this[func],
            })
        }
    }

    private _get(attrName: string) {
        if (!this.attributes) {
            return null;
        }
    
        return this.getAttribute(attrName)?.value;
    }

    public getAttribute(attrName: string) : IItemAttribute | undefined {
        return this.attributes?.find(({ class: _class }) => attrName === _class);
    }

    public getPaintColor() : number | { red: number, blu: number } | undefined {
        const red = this._get("set_item_tint_rgb");
        const blu = this._get("set_item_tint_rgb_2");
    
        if (!blu) return red;
        else if (blu && red) return { red, blu };
    }

    public getCrateSeries() {
        return this._get("supply_crate_series");
    }

    public getCrateKey() {
        return this._get("decoded_by_itemdefindex");
    }

    public isCrate() {
        return this.item_class === "supply_crate";
    }
    
    public isKey() {
        return !!(this?.tool?.type === "decoder_ring" && this?.tool?.usage_capabilities?.decodable === true);
    }
    
    public isPaintCan() {
        return this?.tool?.type === "paint_can";
    }
    
    public isUntradableByDefault() {
        return this._get("cannot_trade") === 1;
    }
    
    public isVoodooSoul() {
        return this._get("zombiezombiezombiezombie") === 1;
    }
    
    public isHalloweenItem() : number | false {
        return this._get("halloween_item") || false;
    }
    
    public isNoiseMaker() {
        return this?.tool?.type === "noise_maker";
    }
    
    public isRestricted() : string | false {
        return this?.tool?.restriction || false;
    }
    
    public isStrangifier()  {
        return this?.tool?.type === "strangifier" && this?.tool?.usage_capabilities?.can_strangify === true;
    }
    
    public isStrangeFilter() {
        return this?.tool?.type === "strange_part_restriction";
    }
    
    public isStrangePart() {
        return this?.tool?.type === "strange_part";
    }
    
    public hasHolidayRestriction() : string | false {
        return this?.holiday_restriction || false;
    }
    
    public getItemTarget() : number | undefined {
        return this._get("tool_target_item");
    }
}
