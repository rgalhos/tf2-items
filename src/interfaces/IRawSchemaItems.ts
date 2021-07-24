import ISchemaItem from "./ISchemaItem";

export default interface IRawSchemaItems {
    headers: any,
    status: number,
    items_game_schema: string,
    items: ISchemaItem[],
};
