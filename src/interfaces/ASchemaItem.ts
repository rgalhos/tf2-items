import EQuality from "../enums/EQuality"
import IItemAttribute from "./IItemAttribute";

export default abstract class ISchemaItem {
    public name: string = "";
    public defindex: number = 0;
    public item_class?: string;
    public item_type_name?: string;
    public item_name: string = "";
    public item_description?: string;
    public proper_name: boolean = false;
    public item_slot?: string;
    public model_player: string | null = null;
    public item_quality: EQuality | 255 = 255;
    public image_inventory: string | null = null;
    public min_ilevel: number = -1;
    public max_ilevel: number = -1;
    public image_url: string | null = null;
    public image_url_large: string | null = null;
    public drop_type?: string;
    public item_set?: string;
    public craft_class: string = "";
    public craft_material_type: string = "";
    public holiday_restriction?: string;

    public capabilities: {
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
    } = {
        can_be_restored: false,
        can_card_upgrade: false,
        can_consume: false,
        can_craft_mark: false,
        can_gift_wrap: false,
        can_killstreakify: false,
        can_strangify: false,
        can_craft_count: false,
        can_craft_if_purchased: false,
        can_customize_texture: false,
        can_unusualify: false,
        strange_parts: false,
    };

    public tool?: {
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
    };
    public styles?: {
        name?: string,
    }[];
    public used_by_classes: Classes[] | [] = [];
    public attributes?: IItemAttribute[];

    constructor() { }
};

type Classes = "Scout" | "Soldier" | "Pyro" | "Demoman" | "Heavy" | "Engineer" | "Medic" | "Sniper" | "Spy";
