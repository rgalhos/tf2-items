import { EKillstreakTier } from "../enums/EKillstreak";
import EQuality from "../enums/EQuality";
import IItemAttribute from "../interfaces/IItemAttribute";
import ISchemaItem from "../interfaces/ISchemaItem";

export function getAttribute(attrName: string, attributes: IItemAttribute[]) : IItemAttribute | undefined {
    return attributes.find(({ class: _class }) => attrName === _class);
}

function _getValue(attrName: string, item: ISchemaItem) : number | null {
    if (!item || !item.attributes)
        return null;
        
    return getAttribute(attrName, item.attributes)?.value || null;
}


export function getPaintColor(item: ISchemaItem) : number | { red: number, blu: number } | null {
    const red = _getValue("set_item_tint_rgb", item);
    const blu = _getValue("set_item_tint_rgb_2", item);

    if (!blu) return red as number;
    else if (blu && red) return { red, blu };

    return null;
}

export function getCrateSeries(item: ISchemaItem) {
    return _getValue("supply_crate_series", item);
}

export function getCrateKey(item: ISchemaItem) {
    return _getValue("decoded_by_itemdefindex", item);
}

export function getDefaultQuality(item: ISchemaItem) {
    return item.item_quality;
}

export function isCrate(item: ISchemaItem) {
    return item.item_class === "supply_crate" || keyLessCratesDefindexes.indexOf(item.defindex) !== -1;
}

export function isKey(item: ISchemaItem) {
    return !!(item?.tool?.type === "decoder_ring" && item?.tool?.usage_capabilities?.decodable === true);
}

export function isPaintCan(item: ISchemaItem) {
    return item?.tool?.type === "paint_can";
}

export function isWarPaint(item: ISchemaItem) {
    return getDefaultQuality(item) === EQuality.DecoratedWeapon && item.tool?.type === "paintkit";
}

export function isDecoratedWeapon(item: ISchemaItem) {
    return item.item_quality === EQuality.DecoratedWeapon && !isWarPaint(item);
}

export function isUntradableByDefault(item: ISchemaItem) {
    return _getValue("cannot_trade", item) === 1;
}

export function isAlwaysTradable(item: ISchemaItem) {
    return _getValue("always_tradable", item) === 1;
}

export function isVoodooSoul(item: ISchemaItem) {
    return _getValue("zombiezombiezombiezombie", item) === 1;
}

export function isHalloweenItem(item: ISchemaItem) : number | false {
    return _getValue("halloween_item", item) || false;
}

export function isNoiseMaker(item: ISchemaItem) {
    return item?.tool?.type === "noise_maker";
}

export function isRestricted(item: ISchemaItem) : string | false {
    return item?.tool?.restriction || false;
}

export function isStrangifier(item: ISchemaItem)  {
    return item?.tool?.type === "strangifier" && item?.tool?.usage_capabilities?.can_strangify === true;
}

export function isKillstreakKit(item: ISchemaItem) : EKillstreakTier | false {
    if (item?.tool?.type !== "killstreakifier") {
        return false;
    }

    return  _getValue("killstreak_tier", item) || false;
}

export function isStrangeFilter(item: ISchemaItem) {
    return item?.tool?.type === "strange_part_restriction";
}

export function isStrangePart(item: ISchemaItem) {
    return item?.tool?.type === "strange_part";
}

export function hasHolidayRestriction(item: ISchemaItem) : string | false {
    return item?.holiday_restriction || false;
}

export function getItemTarget(item: ISchemaItem) : number | null {
    return _getValue("tool_target_item", item);
}

const keyLessCratesDefindexes = [
    5763, // Unlocked Creepy Scout Crate
    5764, // Unlocked Creepy Pyro Crate
    5765, // Unlocked Creepy Heavy Crate
    5766, // Unlocked Creepy Engineer Crate
    5767, // Unlocked Creepy Spy Crate
    5768, // Unlocked Creepy Sniper Crate
    5769, // Unlocked Creepy Soldier Crate
    5770, // Unlocked Creepy Medic Crate
    5771, // Unlocked Creepy Demo Crate
    5850, // Unlocked Cosmetic Crate Scout
    5851, // Unlocked Cosmetic Crate Sniper
    5852, // Unlocked Cosmetic Crate Soldier
    5853, // Unlocked Cosmetic Crate Demo
    5854, // Unlocked Cosmetic Crate Medic
    5855, // Unlocked Cosmetic Crate Heavy
    5856, // Unlocked Cosmetic Crate Pyro
    5857, // Unlocked Cosmetic Crate Spy
    5858, // Unlocked Cosmetic Crate Engineer
    5860, // Unlocked Cosmetic Crate Multi-Class
];
