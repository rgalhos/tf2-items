import EQuality from "../enums/EQuality";
import ISchemaItem from "../interfaces/ISchemaItem";
import ASchemaItem from "../interfaces/ASchemaItem";
import * as itemAttributes from "../lib/attributes";

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

    public getPaintColor() {
        return itemAttributes.getPaintColor(this);
    }

    public getCrateSeries() {
        return itemAttributes.getCrateSeries(this);
    }

    public getCrateKey() {
        return itemAttributes.getCrateKey(this);
    }

    public isCrate() {
        return itemAttributes.isCrate(this);
    }
    
    public isKey() {
        return itemAttributes.isKey(this);
    }
    
    public isPaintCan() {
        return itemAttributes.isPaintCan(this);
    }
    
    public isUntradableByDefault() {
        return itemAttributes.isUntradableByDefault(this);
    }
    
    public isVoodooSoul() {
        return itemAttributes.isVoodooSoul(this);
    }
    
    public isHalloweenItem() {
        return itemAttributes.isHalloweenItem(this);
    }
    
    public isNoiseMaker() {
        return itemAttributes.isNoiseMaker(this);
    }
    
    public isRestricted() {
        return itemAttributes.isRestricted(this);
    }
    
    public isStrangifier()  {
        return itemAttributes.isStrangifier(this);
    }
    
    public isStrangeFilter() {
        return itemAttributes.isStrangeFilter(this);
    }
    
    public isStrangePart() {
        return itemAttributes.isStrangePart(this);
    }
    
    public hasHolidayRestriction() {
        return itemAttributes.hasHolidayRestriction(this);
    }
    
    public getItemTarget() {
        return itemAttributes.getItemTarget(this);
    }
}
