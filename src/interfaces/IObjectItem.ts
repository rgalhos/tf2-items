import { EKillstreakTier } from "../enums/EKillstreak";
import EQuality from "../enums/EQuality";

export default interface IObjectItem {
    sku: string,
    name: string,
    fullName?: string,
    defindex: number,
    quality: EQuality,
    craftable: boolean,
    tradable?: boolean,

    ksTier?: EKillstreakTier,
    festivized?: boolean,
    australium?: boolean,
    elevatedStrange?: boolean,
    effectId?: number | null,
    effectName?: string | null,
    priceIndex?: number | null,
    paint?: string | null,
};
