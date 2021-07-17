import Schema from "../classes/Schema";
import EQuality from "../enums/EQuality";
import IObjectItem from "../interfaces/IObjectItem";
import TestLog from "./utils";
import { deepStrictEqual, strictEqual, throws } from "assert";
import { EKillstreakTier } from "../enums/EKillstreak";

const schema = new Schema("steamApiKeyHere", false);

schema.load().then(test);

function test() {
    if (!schema.isReady) {
        throw new Error("promise resolved too early");
    } else if (schema.getAllUnusualEffects().length === 0) {
        throw new Error("unusual effects not loaded");
    }

    test_getSkuFromFullName();
    test_skuToItemObject();
}

function test_skuToItemObject() {
    // Non-Craftable Strange Collector's '72 Professional Killstreak Australium Slick Cut
    deepStrictEqual(
        schema.skuToItemObject("30187;14;uncraftable;untradable;australium;strange;kt-3;u3004;p6666666;td-776"),
        {
            sku: "30187;14;uncraftable;untradable;australium;strange;kt-3;u3004;p6666666;td-776",
            name: "Slick Cut",
            fullName: "Non-Craftable Strange Collector's '72 Professional Killstreak Australium Slick Cut",
            defindex: 30187, // Slick Cut
            quality: EQuality.Collectors,
            ksTier: EKillstreakTier.Professional,
            tradable: false,
            craftable: false,
            australium: true,
            festivized: false,
            elevatedStrange: true,
            effectId: 3004, // '72
            effectName: "'72",
            paint: "6666666",
            priceIndex: 776, // The Bird-Man of Aberdeen
        } as IObjectItem
    );

    // Strange Festivized Professional Killstreak Australium Scattergun
    deepStrictEqual(
        schema.skuToItemObject("200;11;australium;festive;kt-3"),
        {
            sku: "200;11;australium;festive;kt-3",
            name: "Scattergun",
            fullName: "Strange Festivized Professional Killstreak Australium Scattergun",
            defindex: 200, // Scattergun
            quality: EQuality.Strange,
            ksTier: EKillstreakTier.Professional,
            tradable: true,
            craftable: true,
            australium: true,
            festivized: true,
            elevatedStrange: false,
            effectId: null,
            effectName: null,
            paint: null,
            priceIndex: null,
        } as IObjectItem
    );
    
    // Genuine Horace
    deepStrictEqual(
        schema.skuToItemObject("30469;1"),
        {
            sku: "30469;1",
            name: "Horace",
            fullName: "Genuine Horace",
            defindex: 30469,
            quality: EQuality.Genuine,
            ksTier: EKillstreakTier.None,
            tradable: true,
            craftable: true,
            australium: false,
            festivized: false,
            elevatedStrange: false,
            effectId: null,
            effectName: null,
            paint: null,
            priceIndex: null,
        } as IObjectItem
    );

    // Strange Massed Flies Thirst Blood
    deepStrictEqual(
        schema.skuToItemObject("30479;5;strange;u12"),
        {
            sku: "30479;5;strange;u12",
            name: "Thirst Blood",
            fullName: "Strange Massed Flies Thirst Blood",
            defindex: 30479,
            quality: EQuality.Unusual,
            ksTier: EKillstreakTier.None,
            tradable: true,
            craftable: true,
            australium: false,
            festivized: false,
            elevatedStrange: true,
            effectId: 12,
            effectName: "Massed Flies",
            paint: null,
            priceIndex: null,
        } as IObjectItem
    );

    // Non-Craftable Unusual Taunt: Yeti Punch Unusualifier
    deepStrictEqual(
        schema.skuToItemObject("9258;5;uncraftable;td-1182"),
        {
            sku: "9258;5;uncraftable;td-1182",
            name: "Taunt Unusualifier",
            fullName: "Non-Craftable Unusual Taunt: Yeti Punch Unusualifier",
            defindex: 9258,
            quality: EQuality.Unusual,
            ksTier: EKillstreakTier.None,
            tradable: true,
            craftable: false,
            australium: false,
            festivized: false,
            elevatedStrange: false,
            effectId: null,
            effectName: null,
            paint: null,
            priceIndex: 1182,
        } as IObjectItem
    );

    // Anger Strangifier
    deepStrictEqual(
        schema.skuToItemObject("6522;6;td-518"),
        {
            sku: "6522;6;td-518",
            name: "Strangifier",
            fullName: "Anger Strangifier",
            defindex: 6522,
            quality: EQuality.Unique,
            ksTier: EKillstreakTier.None,
            tradable: true,
            craftable: true,
            australium: false,
            festivized: false,
            elevatedStrange: false,
            effectName: null,
            effectId: null,
            paint: null,
            priceIndex: 518,
        } as IObjectItem
    )
}

function test_getSkuFromFullName() {
    const log_getSkuFromFullName = new TestLog("getSkuFromFullName");

    function getSkuFromFullName(fullName: string, expectedSku: string) {
        try {
            let sku = schema.getSkuFromFullName(fullName);
            strictEqual(sku, expectedSku, new Error(`sku does not match! expected "${expectedSku}", got "${sku}"`));
            log_getSkuFromFullName.setPassed(fullName, expectedSku);
        } catch (e) {
            log_getSkuFromFullName.setFailed(fullName, e.message);
        }
    }

    getSkuFromFullName("Strange Massed Flies Thirst Blood", "30479;5;strange;u12");
    getSkuFromFullName("Massed Flies Thirst Blood", "30479;5;u12");
    getSkuFromFullName("Unusual Thirst Blood", "30479;5");
    getSkuFromFullName("Strange Thirst Blood", "30479;11");
    getSkuFromFullName("Thirst Blood", "30479;6");

    getSkuFromFullName("Taunt: Kazotsky Kick", "1157;6");
    getSkuFromFullName("Unusual Taunt: Kazotsky Kick", "1157;5");
    getSkuFromFullName("'72 Taunt: Kazotsky Kick", "1157;5;u3004");
    getSkuFromFullName("Silver Cyclone Taunt: Kazotsky Kick", "1157;5;u3009");
    getSkuFromFullName("Skill Gotten Gains Taunt: Kazotsky Kick", "1157;5;u3007");
    getSkuFromFullName("Creepy Crawlies Taunt: Kazotsky Kick", "1157;5;u3048");

    getSkuFromFullName("Taunt: Conga", "1118;6");
    getSkuFromFullName("'72 Taunt: Conga", "1118;5;u3004");
    getSkuFromFullName("Screaming Tiger Taunt: Conga", "1118;5;u3006");
    getSkuFromFullName("Silver Cyclone Taunt: Conga", "1118;5;u3009");
    getSkuFromFullName("Infernal Smoke Taunt: Conga", "1118;5;u3016");

    getSkuFromFullName("Taunt: The Meet the Medic", "477;6");
    getSkuFromFullName("Non-Craftable Taunt: The Meet the Medic", "477;6;uncraftable");
    getSkuFromFullName("Non-Craftable Ascension Taunt: The Meet the Medic", "477;5;uncraftable;u3052");
    getSkuFromFullName("Ascension Taunt: The Meet the Medic", "477;5;u3052");
    getSkuFromFullName("Ghastly Ghosts Taunt: The Meet the Medic", "477;5;u3012");
    getSkuFromFullName("Non-Craftable '72 Taunt: The Meet the Medic", "477;5;uncraftable;u3004");
    getSkuFromFullName("'72 Taunt: The Meet the Medic", "477;5;u3004");

    getSkuFromFullName("Collector's Professional Killstreak Ambassador", "61;14;kt-3");
    getSkuFromFullName("Collector's Specialized Killstreak Ambassador", "61;14;kt-2");
    getSkuFromFullName("Collector's Killstreak Ambassador", "61;14;kt-1");
    getSkuFromFullName("Collector's Ambassador", "61;14");
    getSkuFromFullName("Strange Ambassador", "61;11");
    getSkuFromFullName("Ambassador", "61;6");
    getSkuFromFullName("Non-Craftable Ambassador", "61;6;uncraftable");

    getSkuFromFullName("Strange Festivized Professional Killstreak Kritzkrieg", "35;11;kt-3;festive");
    getSkuFromFullName("Strange Festivized Killstreak Kritzkrieg", "35;11;kt-1;festive");
    getSkuFromFullName("Strange Killstreak Kritzkrieg", "35;11;kt-1");
    getSkuFromFullName("Strange Kritzkrieg", "35;11");

    getSkuFromFullName("Strange Archimedes", "828;11");
    getSkuFromFullName("Non-Craftable Strange Archimedes", "828;11;uncraftable");
    getSkuFromFullName("Strange Genuine Archimedes", "828;1;strange");
    getSkuFromFullName("Strange Genuine Merc's Pride Scarf", "541;1;strange");
    getSkuFromFullName("Strange Genuine Widowmaker", "527;1;strange");
    getSkuFromFullName("Strange Genuine Professional Killstreak Widowmaker", "527;1;strange;kt-3");

    getSkuFromFullName("Strange Professional Killstreak Australium Eyelander", "132;11;australium;kt-3");
    getSkuFromFullName("Strange Specialized Killstreak Australium Eyelander", "132;11;australium;kt-2");
    getSkuFromFullName("Strange Killstreak Australium Eyelander", "132;11;australium;kt-1");
    getSkuFromFullName("Strange Australium Eyelander", "132;11;australium");
    getSkuFromFullName("Non-Craftable Eyelander", "132;6;uncraftable");
    getSkuFromFullName("Eyelander", "132;6");

    getSkuFromFullName("Strange Festivized Professional Killstreak Australium Scattergun", "200;11;australium;kt-3;festive");
    getSkuFromFullName("Strange Festivized Specialized Killstreak Australium Scattergun", "200;11;australium;kt-2;festive");
    getSkuFromFullName("Strange Festivized Killstreak Australium Scattergun", "200;11;australium;kt-1;festive");
    getSkuFromFullName("Strange Festivized Australium Scattergun", "200;11;australium;festive");

    getSkuFromFullName("Strange Professional Killstreak Festive Flare Gun", "1081;11;kt-3");
    getSkuFromFullName("Strange Festive Flare Gun", "1081;11");

    getSkuFromFullName("Genuine Professional Killstreak Fortified Compound", "1092;1;kt-3");

    getSkuFromFullName("Strange Specialized Killstreak Diamond Botkiller Flame Thrower Mk.I", "914;11;kt-2");
    getSkuFromFullName("Strange Killstreak Blood Botkiller Medi Gun Mk.I", "894;11;kt-1");
    getSkuFromFullName("Strange Professional Killstreak Silver Botkiller Minigun Mk.II ", "958;11;kt-3");
    getSkuFromFullName("Strange Professional Killstreak Silver Botkiller Flame Thrower Mk.I", "798;11;kt-3");
    getSkuFromFullName("Strange Professional Killstreak Carbonado Botkiller Scattergun Mk.I", "906;11;kt-3");
    // Strangifiers
    getSkuFromFullName("Apparition's Aspect Strangifier", "6522;6;td-571");
    getSkuFromFullName("Anger Strangifier", "6522;6;td-518");
    // getSkuFromFullName("Widowmaker Strangifier", "5757;6;td-527");
    getSkuFromFullName("Widowmaker Strangifier", "6522;6;td-527");
    getSkuFromFullName("Combat Slacks Strangifier", "6522;6;td-30372");

    // Unusualifiers
    getSkuFromFullName("Non-Craftable Unusual Taunt: Yeti Punch Unusualifier", "9258;5;uncraftable;td-1182");
    getSkuFromFullName("Unusual Taunt: Yeti Punch Unusualifier", "9258;5;td-1182");
    getSkuFromFullName("Non-Craftable Unusual Taunt: Party Trick Unusualifier", "9258;5;uncraftable;td-1112");
    getSkuFromFullName("Non-Craftable Unusual Taunt: Burstchester Unusualifier", "9258;5;uncraftable;td-30621");

    // glitched killstreak hats
    getSkuFromFullName("Nuts n' Bolts Specialized Killstreak Team Captain", "378;5;kt-2;u31");
    getSkuFromFullName("Green Energy Professional Killstreak Team Captain", "378;5;kt-3;u9");
    getSkuFromFullName("Strange Hellfire Specialized Killstreak Rotation Sensation", "30623;5;strange;kt-2;u78");
    getSkuFromFullName("Strange Vintage Professional Killstreak Ghastlierest Gibus", "116;3;strange;kt-3");
    getSkuFromFullName("Specialized Killstreak Hat of Undeniable Wealth And Respect", "334;6;kt-2");
    getSkuFromFullName("Strange Professional Killstreak Law", "30362;11;kt-3");
    getSkuFromFullName("Strange Dead Presidents Professional Killstreak Law", "30362;5;strange;kt-3;u60");
    getSkuFromFullName("Professional Killstreak Max's Severed Head", "162;6;kt-3");
    getSkuFromFullName("Specialized Killstreak Max's Severed Head", "162;6;kt-2");
    getSkuFromFullName("Non-Craftable Specialized Killstreak Summer Hat", "492;6;uncraftable;kt-2");
    getSkuFromFullName("Specialized Killstreak B.M.O.C.", "666;6;kt-2");
    getSkuFromFullName("Vintage Specialized Killstreak Bill's Hat", "126;3;kt-2");

    // Some special cases
    getSkuFromFullName("Mann Co. Supply Crate Key", "5021;6");
    getSkuFromFullName("Bat", "190;6"); // 0 = stock
    getSkuFromFullName("Strange Bat", "190;11"); // 0 = stock
    getSkuFromFullName("Knife", "194;6"); // 4 = stock
    getSkuFromFullName("Strange Knife", "194;11"); // 4 = stock
    getSkuFromFullName("Sapper", "736;6"); // 735 = stock
    getSkuFromFullName("Strange Sapper", "736;11"); // 735 = stock
    getSkuFromFullName("Construction PDA", "737;6"); // 25 = stock
    getSkuFromFullName("Strange Construction PDA", "737;11"); // 25 = stock
    getSkuFromFullName("Spellbook Magazine", "1070;6"); // 1069 = stock
    getSkuFromFullName("Non-Craftable Noise Maker - Black Cat", "280;6;uncraftable");
    getSkuFromFullName("Noise Maker - Black Cat", "280;6");
    getSkuFromFullName("Power Up Canteen", "489;6"); // 1163 = stock
    getSkuFromFullName("Flip-Flops", "490;6");
    getSkuFromFullName("Australium Gold", "5037;6"); // starts with "australium " but it's not an australium weapon
    getSkuFromFullName("What's in the Sandvich Box?", "790;6");
    getSkuFromFullName("What's in the Companion Square Box?", "791;6");
    getSkuFromFullName("What's in the Portal 2 Soundtrack Box?", "928;6");
    getSkuFromFullName("What's in the Team Fortress 2 Soundtrack Box?", "1176;6");

    // Errors
    getSkuFromFullName("expected error", "throw error pls");
    getSkuFromFullName("another expected error", "<<-- ma man got the drip 🔥");
    getSkuFromFullName("Strange EXPECTED ERROR", "throw error pls");
    getSkuFromFullName("Strange Genuine EXPECTED ERROR", "throw error pls");
    getSkuFromFullName("Professional Killstreak EXPECTED ERROR", "throw error pls");
    getSkuFromFullName("Non-Craftable THROW!!!", "throw error pls");
    getSkuFromFullName("Unusual THROW!!!", "throw error pls");
    getSkuFromFullName("Scorching Flames THROW!!!", "throw error pls");
    getSkuFromFullName("Strange Unusual THROW!!!", "throw error pls");
    getSkuFromFullName("Strange Dead Presidents THROW!!!", "throw error pls");

    log_getSkuFromFullName.log();
}
