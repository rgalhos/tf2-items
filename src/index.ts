import Schema from "./classes/Schema";
import testAttributes from "./test/testAttributes";
import testSchema from "./test/testSchema";

export default Schema;

const argv = process.argv.slice(2);

if (argv[0] === "test") {
    const schema = new Schema(argv[1]);

    testSchema(schema);
    testAttributes(schema);
}
