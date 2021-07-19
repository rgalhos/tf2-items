import Schema from "../classes/Schema";
import { EKillstreakTier } from "../enums/EKillstreak";
import EQuality from "../enums/EQuality";
import IObjectItem from "../interfaces/IObjectItem";

// const sku_regExp = /\d+;\d+(;uncraftable)?(;untradable)?(;australium)?(;festive)?(;strange)?(;kt-(1|2|3))?(;u\d+)?(;p\d{7,8})?(;td-\d+)?$/;
export const sku_regExp = /^(\d+);([0-9]|[1][0-5])(;((uncraftable)|(untrad(e)?able)|(australium)|(festive)|(strange)|((u|pk|td-|c|od-|oq-|p)\d+)|(w[1-5])|(kt-[1-3])|(n((100)|[1-9]\d?))))*?$/

export function testSku(sku: string) {
    return sku_regExp.test(sku);
}

export function fullNameToSku(fullName: string, schema: Schema) : string {
    let name = fullName;
    let defindex = null;
    let quality: EQuality | undefined;
    let elevatedStrange = false;
    let uncraft = false;
    let effectId = null;
    let ksTier = EKillstreakTier.None;
    let targetItem = null;
    let australium = false;
    let festivized = false;
    let mayBeUnusual = false;
    
    let s = fullName.split(/ /g);

    if (s[0] === "Non-Craftable") {
        uncraft = true;
        s.shift();

        name = name.replace(/Non-Craftable /, '');
    }

    // Get item quality
    if (s[0] === "Genuine") {
        quality = EQuality.Genuine;

        name = name.replace(/Genuine /, '');
    } else if (s[0] === "Vintage") {
        quality = EQuality.Vintage;

        name = name.replace(/Vintage /, '');
    }
    // Generic unusual
    else if (s[0] === "Unusual") {
        quality = EQuality.Unusual;

        name = name.replace(/Unusual /, '');
    } else if (s[0] === "Community") {
        quality = EQuality.Community;
        
        name = name.replace(/Community /, '');
    } else if (s[0] === "Valve") {
        quality = EQuality.Valve;
        
        name = name.replace(/Valve /, '');
    } else if (s[0] === "Self-Made") {
        quality = EQuality.SelfMade;
        
        name = name.replace(/Self-Made /, '');
    } else if (s[0] === "Strange") {
        // is strange genuine
        if (s[1] === "Genuine") {
            quality = EQuality.Genuine;
            elevatedStrange = true;
        
            name = name.replace(/Strange Genuine /, '');
        }
        // is strange vintage
        else if (s[1] === "Vintage") {
            quality = EQuality.Vintage;
            elevatedStrange = true;

            name = name.replace(/Strange Vintage /, '');
        }
        // is generic unusual with elevated quality
        else if (s[1] === "Unusual") {
            quality = EQuality.Unusual;
            elevatedStrange = true;

            name = name.replace(/Strange Unusual /, '');
        }
        // is strange haunted
        else if (s[1] === "Haunted") {
            quality = EQuality.Haunted;
            elevatedStrange = true;

            name = name.replace(/Strange Haunted /, '');
        }
        // is strange collector's
        else if (s[1] === "Collector's") {
            quality = EQuality.Collectors;
            elevatedStrange = true;

            name = name.replace(/Strange Collector's /, '');
        }
        // strange filter or strange part
        else if (s[1] === "Filter:" || s[1] === "Part:") {
            quality = EQuality.Unique;
        } else {
            quality = EQuality.Strange;
            
            name = name.replace(/Strange /, '');
            mayBeUnusual = true; // May be an unusual with elevated quality
        }
    } else if (s[0] === "Haunted") {
        quality = EQuality.Haunted;
        
        name = name.replace(/Haunted /, '');
    } else if (s[0] === "Collector's") {
        quality = EQuality.Collectors;
        
        name = name.replace(/Collector's /, '');
    } else {
        mayBeUnusual = true;
    }

    if (mayBeUnusual) {
        // can be either unique, unusual with effect or unusual with elevated quality
        for (const [ id, effectName ] of schema.getAllUnusualEffects()) {
            if (name.startsWith(effectName + ' ')) {
                if (quality === EQuality.Strange) { // Special case: Unusual with elevated quality
                    elevatedStrange = true;
                }

                quality = EQuality.Unusual;
                effectId = id;
        
                name = name.replace(effectName + ' ', '');

                break;
            }
        }

        // no quality and no effect id = unique
        // has quality but no effect id = strange
        if (!quality && !effectId) {
            quality = EQuality.Unique;
        }
    }

    // Get killstreak tier
    if (!fullName.includes(" Fabricator") && !fullName.includes(" Kit")) {
        if (fullName.includes("Professional Killstreak ")) {
            ksTier = EKillstreakTier.Professional;
        } else if (fullName.includes("Specialized Killstreak ")) {
            ksTier = EKillstreakTier.Specialized;
        } else if (fullName.includes("Killstreak ")) {
            ksTier = EKillstreakTier.Basic;
        }

        name = name
            .replace(/Professional Killstreak /, '')
            .replace(/Specialized Killstreak /, '')
            .replace(/Killstreak /, '')
        ;
    }

    // Unusualifier
    if (fullName.includes(" Unusualifier")) {
        name = "Unusualifier";

        let match = fullName.match(/Unusual (.*?) Unusualifier/);
        
        if (!match || !match?.[1]) {
            throw new Error("invalid item: unusualifier - invalid target");
        }

        targetItem = schema.getItemDefindexByName(match[1]);
    }

    // Strangifier
    if (fullName.includes(" Strangifier")) {
        // Special case: Older strangifiers such as anger, widowmaker, etc
        /*
        // NOTE: Strangifiers are strange (ba dum tss)
        //       so I'm ignoring this special case and defining all strangifiers as "6522;6;td-#"
        if (schema.getItemDefindexByName(fullName)) {
            name = fullName;
        } else {
            name = "Strangifier";
        }
        */

        name = "Strangifier";

        let match = fullName.match(/(.*?) Strangifier/);

        if (!match || !match?.[1]) {
            throw new Error("invalid item: strangifier - invalid target");
        }

        targetItem = schema.getItemDefindexByName(match[1]);
    }

    // Australium
    if (name.includes("Australium ") && !name.includes("Australium Gold")) {
        australium = true;
        name = name.replace(/Australium /, '');
    }

    // Festivized
    if (name.includes("Festivized ")) {
        festivized = true;
        name = name.replace(/Festivized /, '');
    }

    name = name.replace(/ +/g, ' ').trim();

    defindex = schema.getItemDefindexByName(name);

    if (!quality) {
        throw new Error("no quality");
    } else if (!defindex) {
        throw new Error(`defindex not found for "${name}"`);
    }

    // defindex;quality[;uncraftable[;untradable[;australium[;festive[;strange[;kt-#[;u#[;p#[;pk#[;w#[;td-#[;n-#[;c-#[;od-#[;oq-#]]]]]]]]]]]]]]]
    
    let sku: string[] = [ String(defindex), String(quality) ];

    if (uncraft) sku.push("uncraftable");
    if (australium) sku.push("australium");
    if (elevatedStrange) sku.push("strange");
    if (ksTier !== EKillstreakTier.None) sku.push("kt-" + ksTier);
    if (festivized) sku.push("festive");
    if (effectId) sku.push("u" + effectId);
    if (targetItem) sku.push("td-" + targetItem);

    return sku.join(';');
}

export function skuToItemObject(_sku: string, schema: Schema) : IObjectItem {
    if (!testSku(_sku)) {
        throw new Error("invalid sku");
    }

    let sku: string[] = _sku.split(';');

    const defindex: number = Number(sku.shift());
    const quality: EQuality = Number(sku.shift());
    const name = schema.getItemNameByDefindex(defindex);

    if (isNaN(defindex)) {
        throw new Error("no defindex");
    } else if (isNaN(quality)) {
        throw new Error("invalid quality");
    } else if (!name) {
        throw new Error(`no item found for defindex "${defindex}"`);
    }

    let untradable = false;
    let craftable = true;
    let australium = false;
    let festivized = false;
    let elevatedStrange = false;
    let ksTier = EKillstreakTier.None;
    let effectId: number | null = null;
    let effectName: string | null = null;
    let priceIndex: number | null = null;
    let targetName: string | null = null;
    let paint: string | null = null;
    let paintKitId: number | null = null;
    let crateSeries: number | null = null;
    let outputDefindex: number | null = null;
    let outputQuality: number | null = null;
    let craftNo: number | null = null;
    let fullName: string[] = [];

    let s;
    while (s = sku.shift()) {
        if (s === "uncraftable") {
            craftable = false;
        } else if (/untrad(e)?able/.test(s)) {
            untradable = true;
        } else if (s === "australium") {
            australium = true;
        } else if (s === "festive") {
            festivized = true;
        } else if (s === "strange") {
            elevatedStrange = true;
        } else if (/kt\-\d/.test(s)) {
            ksTier = Number(s.substr(3));
        } else if (/u\d+/.test(s)) {
            effectId = Number(s.substr(1));
        } else if (/p\d+/.test(s)) {
            paint = s.substr(1);
        } else if (/td\-\d+/.test(s)) {
            priceIndex = Number(s.substr(3));
        } else if (/pk\d+/.test(s)) {
            paintKitId = Number(s.substr(2));
        } else if (/c\d+/.test(s)) {
            crateSeries = Number(s.substr(1));
        } else if (/od-\d+/.test(s)) {
            outputDefindex = Number(s.substr(3));
        } else if (/oq-\d+/.test(s)) {
            outputQuality = Number(s.substr(3));
        } else if (/n\d+/.test(s)) {
            craftNo = Number(s.substr(1));
        }
    }

    if (priceIndex) {
        targetName = schema.getItemNameByDefindex(priceIndex) as string;

        if (!targetName) {
            throw new Error(`no item found for defindex "${priceIndex}" (target)`);
        }
    }

    //////////////////////////////////////////
    /////////// BEGIN OF FULL NAME ///////////
    //////////////////////////////////////////
    if (!craftable) {
        fullName.push("Non-Craftable");
    }

    if (name === "Strangifier") {
        if (!priceIndex && !targetName) {
            throw new Error("generic strangifiers are not allowed");
        }

        fullName.push(targetName as string, "Strangifier");
    } else if (name === "Unusualifier") {
        if (!priceIndex && !targetName) {
            throw new Error("generic unusualifiers are not allowed");
        }

        fullName.push("Unusual", targetName as string, "Unusualifier");
    } else {
        if (effectId) {
            effectName = schema.getUnusualEffectById(effectId) as string;

            if (!effectName) {
                throw new Error(`no unusual effect found for id ${effectId}`);
            }
        }

        if (elevatedStrange) {
            fullName.push("Strange");
        }
    
        if (!effectId && quality === EQuality.Unusual) { // Generic unusual
            fullName.push("Unusual");
        } else if (effectId && quality === EQuality.Unusual) { // Unusual with effect
            fullName.push(effectName as string);
        } else if (effectId && quality !== EQuality.Unusual) { // Non-unusual with effect (such as Vintage Community Sparkle)
            fullName.push(EQuality[quality], effectName as string);
        } else if (quality !== EQuality.Unique) { // Non-Unusual with no effect
            fullName.push(EQuality[quality]);
        }

        if (festivized) {
            fullName.push("Festivized");
        }

        if (ksTier !== EKillstreakTier.None) {
            if (ksTier === EKillstreakTier.Professional) fullName.push("Professional");
            else if (ksTier === EKillstreakTier.Specialized) fullName.push("Specialized");
            fullName.push("Killstreak");
        }

        if (australium) {
            fullName.push("Australium");
        }

        fullName.push(name);
    }

    //////////////////////////////////////////
    ///////////  END OF FULL NAME  ///////////
    //////////////////////////////////////////
    
    return {
        sku: _sku,
        name: name,
        fullName: fullName.join(' '),
        tradable: !untradable,
        defindex: defindex,
        quality: quality,
        craftable: craftable,
        ksTier: ksTier,
        australium: australium,
        festivized: festivized,
        elevatedStrange: elevatedStrange,
        priceIndex: priceIndex,
        effectId: effectId,
        effectName: effectName,
        paint: paint,
        
        paintKitId: paintKitId,
        crateSeries: crateSeries,
        outputDefindex: outputDefindex,
        outputQuality: outputQuality,
        craftNo: craftNo,
    } as IObjectItem;
}

export function skuToFullName(sku: string, schema: Schema) : string {
    return skuToItemObject(sku, schema).fullName as string;
}
