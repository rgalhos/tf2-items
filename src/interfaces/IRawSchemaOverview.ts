export default interface IRawSchemaOverview {
    status: number,
    items_game_url: string,
    qualities: { [quality: string]: number },
    originNames: Array<{ origin: number, name: string }>,
    attributes: Array<{
        name: string,
        defindex: number,
        description_string: string,
		description_format: string,
		effect_type: string,
		hidden: boolean,
		stored_as_integer: boolean,
    }>,
    item_sets: Array<{
        item_set: string,
        name: string,
        items: string[],
        store_bundle?: string,
        attributes?: Array<{
            name: string,
            class: string,
            value: number,
        }>
    }>,
    attribute_controlled_attached_particles: Array<{
        system: string,
        id: number,
        attach_to_rootbone: boolean,
        attachment?: string,
        name: string,
    }>,
    item_levels: Array<{
        name: string,
        levels: Array<{
            level: number,
            required_score: number,
            name: string,
        }>,
    }>,
    kill_eater_score_types: Array<{
        type: number,
        type_name: string,
        level_data: string,
    }>,
    string_lookups: Array<{
        table_name: string,
        strings: Array<{
            index: number,
            string: string,
        }>,
    }>,
};
