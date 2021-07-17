import Schema from "../classes/Schema";
import { deepStrictEqual, strictEqual } from "assert";
import SchemaItem from "../classes/SchemaItem";

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
    const teamSpirit = schema.getItemSchema(5046) as SchemaItem;

    strictEqual(teamSpirit.tool?.usage_capabilities?.paintable_team_colors, true);
    strictEqual(teamSpirit.isPaintCan(), true);
    deepStrictEqual(teamSpirit.getPaintColor(), { red: 12073019, blu: 5801378 });

    // Mann Co. Orange
    const orange = schema.getItemSchema(5032) as SchemaItem;

    strictEqual(orange.tool?.usage_capabilities?.paintable, true);
    strictEqual(orange.isPaintCan(), true);
    strictEqual(orange.getPaintColor(), 13595446);

    // Pink as Hell
    const pink = schema.getItemSchema(5051) as SchemaItem;

    strictEqual(pink.tool?.usage_capabilities?.paintable, true);
    strictEqual(pink.isPaintCan(), true);
    strictEqual(pink.getPaintColor(), 16738740);
}

function testCrates() {
    // Naughty Winter Crate 2011
    const naughty2011 = schema.getItemSchema(5070) as SchemaItem;

    strictEqual(naughty2011.isCrate(), true);
    strictEqual(naughty2011.getCrateSeries(), 35);
    strictEqual(naughty2011.getCrateKey(), null);
    strictEqual(naughty2011.isRestricted(), "winter2011_naughty");

    // Gun Mettle Cosmetic Case
    const gunMettle = schema.getItemSchema(5817) as SchemaItem;

    strictEqual(gunMettle.isCrate(), true);
    // strictEqual(gunMettle.getCrateSeries(), 35);
    strictEqual(gunMettle.getCrateKey(), null);
    strictEqual(gunMettle.isRestricted(), "gunmettlecosmetic2015");

    // Salvaged
    const salvaged = schema.getItemSchema(5068) as SchemaItem;

    strictEqual(salvaged.isCrate(), true);
    strictEqual(salvaged.getCrateSeries(), 50);
    strictEqual(salvaged.getCrateKey(), 5021);
    strictEqual(salvaged.isRestricted(), false);
}

function testKeys() {
    // Normal
    const normal = schema.getItemSchema(5021) as SchemaItem;

    strictEqual(normal.isKey(), true);
    strictEqual(normal.isRestricted(), false);


    // Scream Fortress 2018 War Paint Key
    const sf18 = schema.getItemSchema(5898) as SchemaItem;
    
    strictEqual(sf18.isKey(), true);
    strictEqual(sf18.isRestricted(), "halloween2018paintkit");

    // Summer 2020 Cosmetic Key
    const summer2020 = schema.getItemSchema(5913) as SchemaItem;
    strictEqual(summer2020.isKey(), true);
    strictEqual(summer2020.isRestricted(), "summer2020");
}

function testHats() {
    // Slick Cut
    const slickCut = schema.getItemSchema(30187) as SchemaItem;

    strictEqual(slickCut.isKey(), false);
    strictEqual(slickCut.isCrate(), false);
    strictEqual(slickCut.isRestricted(), false);
    strictEqual(slickCut.isUntradableByDefault(), false);
    deepStrictEqual(slickCut.used_by_classes, [ "Medic" ]);

    // Team Captain
    const tc = schema.getItemSchema(378) as SchemaItem;

    strictEqual(tc.isKey(), false);
    strictEqual(tc.isCrate(), false);
    strictEqual(tc.isRestricted(), false);
    strictEqual(tc.isUntradableByDefault(), false);
    deepStrictEqual(tc.used_by_classes, [ "Soldier", "Medic", "Heavy" ]);
    strictEqual(tc.item_description, "Our lawyers say 'YES! YES!'");

    // Voodoo-Cursed Pyro Soul
    const soul = schema.getItemSchema(5624) as SchemaItem;

    strictEqual(soul.isKey(), false);
    strictEqual(soul.isCrate(), false);
    strictEqual(soul.isRestricted(), false);
    strictEqual(soul.hasHolidayRestriction(), "halloween_or_fullmoon");
    strictEqual(soul.isVoodooSoul(), true);
    strictEqual(soul.isNoiseMaker(), false);
}

function testMisc() {
    // Strange Part: Robots Destroyed
    const strangepart = schema.getItemSchema(6026) as SchemaItem;

    strictEqual(strangepart.isKey(), false);
    strictEqual(strangepart.isCrate(), false);
    strictEqual(strangepart.isRestricted(), false);
    strictEqual(strangepart.hasHolidayRestriction(), false);
    strictEqual(strangepart.isVoodooSoul(), false);
    strictEqual(strangepart.isStrangePart(), true);
    strictEqual(strangepart.isStrangeFilter(), false);
    strictEqual(strangepart.isNoiseMaker(), false);

    // Strange Filter: Turbine (Community)
    const strangefilter = schema.getItemSchema(6507) as SchemaItem;

    strictEqual(strangefilter.isKey(), false);
    strictEqual(strangefilter.isCrate(), false);
    strictEqual(strangefilter.isRestricted(), false);
    strictEqual(strangefilter.hasHolidayRestriction(), false);
    strictEqual(strangefilter.isVoodooSoul(), false);
    strictEqual(strangefilter.isStrangePart(), false);
    strictEqual(strangefilter.isStrangeFilter(), true);
    strictEqual(strangefilter.isNoiseMaker(), false);

    // Noise maker
    const noisemaker = schema.getItemSchema(536) as SchemaItem;

    strictEqual(noisemaker.isKey(), false);
    strictEqual(noisemaker.isCrate(), false);
    strictEqual(noisemaker.isRestricted(), false);
    strictEqual(noisemaker.hasHolidayRestriction(), "birthday");
    strictEqual(noisemaker.isVoodooSoul(), false);
    strictEqual(noisemaker.isStrangePart(), false);
    strictEqual(noisemaker.isStrangeFilter(), false);
    strictEqual(noisemaker.isNoiseMaker(), true);
    strictEqual(noisemaker.isUntradableByDefault(), true);
}
