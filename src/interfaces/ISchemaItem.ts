import EQuality from "../enums/EQuality"
import IItemAttribute from "./IItemAttribute";

export default interface ISchemaItem {
    fullName: string; // Custom key
    
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
    drop_type?: drop_type_t,
    item_set?: string,
    craft_class: craft_class_t,
    craft_material_type: craft_material_type_t,
    holiday_restriction?: holiday_restriction_t,
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
            nameable?: boolean,
            paintable?: boolean,
            paintable_team_colors?: boolean,
            strange_parts?: boolean,
            can_card_upgrade?: boolean,
            can_customize_texture?: boolean,
            can_gift_wrap?: boolean,
            can_consume?: boolean,
            can_strangify?: boolean,
            can_killstreakify?: boolean,
            can_unusualify?: boolean,
            duck_upgradable?: boolean,
        },
    },
    styles?: {
        name?: string,
    }[],
    used_by_classes: Classes[] | [],
    attributes?: IItemAttribute[],
};

export type Classes = "Scout" | "Soldier" | "Pyro" | "Demoman" | "Heavy" | "Engineer" | "Medic" | "Sniper" | "Spy";
export type drop_type_t = "none" | "drop";
export type craft_class_t = "" | "weapon" | "hat" | "craft_bar" | "haunted_hat" | "tool" | "craft_token" | "supply_crate";
export type craft_material_type_t = "" | "weapon" | "hat" | "craft_bar" | "haunted_hat" | "tool" | "craft_token" | "supply_crate" | "craft_material_burned" | "craft_material_voodoocursed" | "strangepart";
export type holiday_restriction_t = "halloween_or_fullmoon" | "birthday" | "christmas" | "halloween";
