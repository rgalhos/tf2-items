import Schema from "./classes/Schema";

export default Schema;

const x = new Schema(false);

x.load().then(() => {
    x.downloadFullItemSchema().then(() => {
        x.dumpSchema("./schema.json");
    });
});
