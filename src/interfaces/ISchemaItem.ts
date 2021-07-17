import EQuality from "../enums/EQuality"
import IItemAttribute from "./IItemAttribute";

export default interface ISchemaItem {
    name: string,
    defindex: number,
    item_class?: string,
    item_type_name?: string,
    item_name: string,
    item_description?: string,
    proper_name: boolean,
    item_slot?: string,
    model_player: string | null,
    item_quality: EQuality | 255,
    image_inventory: string | null,
    min_ilevel: number,
    max_ilevel: number,
    image_url: string | null,
    image_url_large: string | null,
    drop_type?: string,
    item_set?: string,
    craft_class: string,
    craft_material_type: string,
    holiday_restriction?: string,
    capabilities: {
        usable_gc?: boolean,
        usable_out_of_game?: boolean,
        decodable?: boolean,
        nameable?: boolean,
        usable?: boolean,
        can_craft_if_purchased?: boolean,
        can_gift_wrap: boolean,
        can_craft_count?: boolean,
        can_craft_mark: boolean,
        can_be_restored: boolean,
        strange_parts: boolean,
        can_card_upgrade: boolean,
        can_strangify: boolean,
        can_killstreakify: boolean,
        can_unusualify?: boolean,
        can_consume: boolean,
        can_customize_texture?: boolean,
        duck_upgradable?: boolean,
    },
    tool?: {
        type?: string,
        use_string?: string,
        restriction?: string,
        usage_capabilities?: {
            decodable?: boolean,
            paintable?: boolean,
            paintable_team_colors?: boolean,
            strange_parts?: boolean,
            can_customize_texture?: boolean,
            can_gift_wrap?: boolean,
            can_consume?: boolean,
            can_strangify?: boolean,
            can_killstreakify?: boolean,
            can_unusualify?: boolean,
        },
    },
    styles?: {
        name?: string,
    }[],
    used_by_classes: Classes[] | [],
    attributes?: IItemAttribute[],
};

type Classes = "Scout" | "Soldier" | "Pyro" | "Demoman" | "Heavy" | "Engineer" | "Medic" | "Sniper" | "Spy";
