import EQuality from "../enums/EQuality";
import ISchemaItem from "../interfaces/ISchemaItem";
import ASchemaItem from "../interfaces/ASchemaItem";
import * as itemAttributes from "../lib/attributes";

export default class SchemaItem extends ASchemaItem {
    constructor(item: ISchemaItem) {
        super();

        Object.assign(this, item);

        for (const key of Object.keys(this)) {
            // @ts-ignore
            if (typeof this[key] === "function") {
                Object.defineProperty(this, key, {
                    configurable: false,
                    enumerable: false,
                    // @ts-ignore
                    value: this[key],
                });
            }
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
