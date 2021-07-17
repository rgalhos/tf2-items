// Classes
import Schema from "./classes/Schema";
export default Schema;

import SchemaItem from "./classes/SchemaItem";
export { SchemaItem };

// Enums
import { EKillstreaker, EKillstreakTier, ESheen } from "./enums/EKillstreak";
export { EKillstreaker, EKillstreakTier, ESheen };

import EOrigin from "./enums/EOrigin";
export { EOrigin };

import EQuality from "./enums/EQuality";
export { EQuality };

// Interfaces
import IItemAttribute from "./interfaces/IItemAttribute";
export { IItemAttribute };

import IObjectItem from "./interfaces/IObjectItem";
export { IObjectItem };

import IRawSchemaItems from "./interfaces/IRawSchemaItems";
export { IRawSchemaItems };

import IRawSchemaOverview from "./interfaces/IRawSchemaOverview";
export { IRawSchemaOverview };

import ISchemaItem from "./interfaces/ISchemaItem";
export { ISchemaItem };

// Tests
import testAttributes from "./test/testAttributes";
import testSchema from "./test/testSchema";

if (process.argv[2] === "test") {
    const schema = new Schema(process.argv[3]);

    testSchema(schema);
    testAttributes(schema);
}
