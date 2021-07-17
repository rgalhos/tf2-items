import ISchemaItem from "./ISchemaItem";

export default interface IRawSchemaItems {
    status: number,
    items_game_schema: string,
    items: ISchemaItem[],
};
