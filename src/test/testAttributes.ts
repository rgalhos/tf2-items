import Schema from "../classes/Schema";
import * as itemAttribute from "../lib/attributes";
import { deepStrictEqual, strictEqual } from "assert";
import ISchemaItem from "../interfaces/ISchemaItem";

var schema: Schema;

export default function testAttributes(_schema: Schema) {
    schema = _schema;
    
    schema.load().then(startTest);
}

function startTest() {
    if (!schema.isReady) {
        throw new Error("promise resolved too early");
    } else if (schema.getAllUnusualEffects().length === 0) {
        throw new Error("unusual effects not loaded");
    }

    testPaints();
    testCrates();
    testKeys();
    testHats();
    testMisc();
}

function testPaints() {
    // Team Spirit
    const teamSpirit = schema.getItemSchema(5046) as ISchemaItem;

    strictEqual(teamSpirit.tool?.usage_capabilities?.paintable_team_colors, true);

    strictEqual(itemAttribute.isPaintCan(teamSpirit), true);
    strictEqual(itemAttribute.getPaintColor(teamSpirit), { red: 12073019, blu: 5801378 });

    // Mann Co. Orange
    const orange = schema.getItemSchema(5032) as ISchemaItem;

    strictEqual(orange.tool?.usage_capabilities?.paintable, true);
    strictEqual(itemAttribute.isPaintCan(orange), true);
    strictEqual(itemAttribute.getPaintColor(orange), 13595446);

    // Pink as Hell
    const pink = schema.getItemSchema(5032) as ISchemaItem;

    strictEqual(pink.tool?.usage_capabilities?.paintable, true);
    strictEqual(itemAttribute.isPaintCan(pink), true);
    strictEqual(itemAttribute.getPaintColor(pink), 16738740);
}

function testCrates() {
    // Naughty Winter Crate 2011
    const naughty2011 = schema.getItemSchema(5070) as ISchemaItem;

    strictEqual(itemAttribute.isCrate(naughty2011), true);
    strictEqual(itemAttribute.getCrateSeries(naughty2011), 35);
    strictEqual(itemAttribute.getCrateKey(naughty2011), undefined);
    strictEqual(itemAttribute.isRestricted(naughty2011), "winter2011_naughty");

    // Gun Mettle Cosmetic Case
    const gunMettle = schema.getItemSchema(5817) as ISchemaItem;

    strictEqual(itemAttribute.isCrate(gunMettle), true);
    // strictEqual(itemAttribute.getCrateSeries(gunMettle), 35);
    strictEqual(itemAttribute.getCrateKey(gunMettle), undefined);
    strictEqual(itemAttribute.isRestricted(gunMettle), "gunmettlecosmetic2015");

    // Salvaged
    const salvaged = schema.getItemSchema(5068) as ISchemaItem;

    strictEqual(itemAttribute.isCrate(salvaged), true);
    strictEqual(itemAttribute.getCrateSeries(salvaged), 50);
    strictEqual(itemAttribute.getCrateKey(salvaged), 5021);
    strictEqual(itemAttribute.isRestricted(salvaged), false);
}

function testKeys() {
    // Normal
    const normal = schema.getItemSchema(5021) as ISchemaItem;

    strictEqual(itemAttribute.isKey(normal), true);
    strictEqual(itemAttribute.isRestricted(normal), false);


    // Scream Fortress 2018 War Paint Key
    const sf18 = schema.getItemSchema(5898) as ISchemaItem;
    
    strictEqual(itemAttribute.isKey(sf18), true);
    strictEqual(itemAttribute.isRestricted(sf18), "halloween2018paintkit");

    // Summer 2020 Cosmetic Key
    const summer2020 = schema.getItemSchema(5913) as ISchemaItem;
    strictEqual(itemAttribute.isKey(summer2020), true);
    strictEqual(itemAttribute.isRestricted(summer2020), "summer2020");
}

function testHats() {
    // Slick Cut
    const slickCut = schema.getItemSchema(30187) as ISchemaItem;

    strictEqual(itemAttribute.isKey(slickCut), false);
    strictEqual(itemAttribute.isCrate(slickCut), false);
    strictEqual(itemAttribute.isRestricted(slickCut), false);
    strictEqual(itemAttribute.isUntradableByDefault(slickCut), false);
    deepStrictEqual(slickCut.used_by_classes, [ "Medic" ]);

    // Team Captain
    const tc = schema.getItemSchema(378) as ISchemaItem;

    strictEqual(itemAttribute.isKey(tc), false);
    strictEqual(itemAttribute.isCrate(tc), false);
    strictEqual(itemAttribute.isRestricted(tc), false);
    strictEqual(itemAttribute.isUntradableByDefault(tc), false);
    deepStrictEqual(tc.used_by_classes, [ "Soldier", "Medic", "Heavy" ]);
    strictEqual(tc.item_description, "Our lawyers say 'YES! YES!");

    // Voodoo-Cursed Pyro Soul
    const soul = schema.getItemSchema(5624) as ISchemaItem;

    strictEqual(itemAttribute.isKey(soul), false);
    strictEqual(itemAttribute.isCrate(soul), false);
    strictEqual(itemAttribute.isRestricted(soul), false);
    strictEqual(itemAttribute.hasHolidayRestriction(soul), "halloween_or_fullmoon");
    strictEqual(itemAttribute.isVoodooSoul(soul), true);
    strictEqual(itemAttribute.isNoiseMaker(soul), false);
}

function testMisc() {
    // Strange Part: Robots Destroyed
    const strangepart = schema.getItemSchema(6026) as ISchemaItem;

    strictEqual(itemAttribute.isKey(strangepart), false);
    strictEqual(itemAttribute.isCrate(strangepart), false);
    strictEqual(itemAttribute.isRestricted(strangepart), false);
    strictEqual(itemAttribute.hasHolidayRestriction(strangepart), false);
    strictEqual(itemAttribute.isVoodooSoul(strangepart), false);
    strictEqual(itemAttribute.isStrangePart(strangepart), true);
    strictEqual(itemAttribute.isStrangeFilter(strangepart), false);
    strictEqual(itemAttribute.isNoiseMaker(strangepart), false);

    // Strange Filter: Turbine (Community)
    const strangefilter = schema.getItemSchema(6507) as ISchemaItem;

    strictEqual(itemAttribute.isKey(strangefilter), false);
    strictEqual(itemAttribute.isCrate(strangefilter), false);
    strictEqual(itemAttribute.isRestricted(strangefilter), false);
    strictEqual(itemAttribute.hasHolidayRestriction(strangefilter), false);
    strictEqual(itemAttribute.isVoodooSoul(strangefilter), false);
    strictEqual(itemAttribute.isStrangePart(strangefilter), false);
    strictEqual(itemAttribute.isStrangeFilter(strangefilter), true);
    strictEqual(itemAttribute.isNoiseMaker(strangefilter), false);

    // Noise maker
    const noisemaker = schema.getItemSchema(536) as ISchemaItem;

    strictEqual(itemAttribute.isKey(noisemaker), false);
    strictEqual(itemAttribute.isCrate(noisemaker), false);
    strictEqual(itemAttribute.isRestricted(noisemaker), false);
    strictEqual(itemAttribute.hasHolidayRestriction(noisemaker), "birthday");
    strictEqual(itemAttribute.isVoodooSoul(noisemaker), false);
    strictEqual(itemAttribute.isStrangePart(noisemaker), false);
    strictEqual(itemAttribute.isStrangeFilter(noisemaker), false);
    strictEqual(itemAttribute.isNoiseMaker(noisemaker), true);
    strictEqual(itemAttribute.isUntradableByDefault(noisemaker), true);
}
