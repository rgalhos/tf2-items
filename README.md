**Alerta de gatilho:** Documentação incompleta, mal feita e em portu-glês abaixo.

## ISchema
| Property&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Type          | Description  |
| ------------------------------------------ | ------------- | ----- |
| fullName | string | Nome completo do item. Tenta imitar o mesmo padrão do backpack.tf, isto é, exclui o prefixo "The" em todos os itens (exceto nos itens que o prefixo realmente faz parte do nome, como _The Essential Accessories_ e _The Superfan_) e inclui o número de série das caixas (Ex: _Select Reserve Mann Co. Supply Crate #60_) |
| name | string | Internal item name |
| item_name | string | Item name |
| defindex | number | Item defindex |
| item_class? | string | Classe do item |
| item_type_name? | string | Name displayed after the "Level #" tag in the inventory |
| item_description? | string | Item description |
| proper_name | boolean | Se verdadeiro, o nome usado no jogo é o da propriedade "name", se não, o nome usado é o de "item_name" |
| item_slot? | string | Item slot |
| model_player | string \| null | Player model |
| item_quality | EQuality \| 255 | Default item quality. Só é *255* em powerups e bundles |
| image_inventory | string \| null | Image used in the in-game backpack |
| min_ilevel | number | Minimum level |
| max_ilevel | number | Maximum level |
| image_url | string \| null | Item image (128x128) |
| image_url_large | string \| null | Item image (512x512) |
| drop_type? | drop_type_t | Drop type |
| item_set? | string | Item set |
| craft_class | craft_class_t | Craft class |
| craft_material_type | craft_material_type_t | Craft material type |
| holiday_restriction? | holiday_restriction_t | Item has holiday restriction |
| capabilities | Object | Item capabilities |
| &nbsp; &nbsp; &nbsp; &nbsp; usable_gc? | boolean | Items that can be used just by connecting to the game coordinator (Passes, unlocked crates, saxtons, war paints, etc) -> [(node-tf2)](https://www.npmjs.com/package/tf2) |
| &nbsp; &nbsp; &nbsp; &nbsp; usable_out_of_game? | boolean | Can be used in the main menu |
| &nbsp; &nbsp; &nbsp; &nbsp; decodable? | boolean | Can be opened (yeah, crates) |
| &nbsp; &nbsp; &nbsp; &nbsp; nameable? | boolean | Can be renamed |
| &nbsp; &nbsp; &nbsp; &nbsp; usable? | boolean | Can be used (canteens and noise makers) |
| &nbsp; &nbsp; &nbsp; &nbsp; can_craft_if_purchased? | boolean | Player receives a craftable version from store purchases |
| &nbsp; &nbsp; &nbsp; &nbsp; can_gift_wrap | boolean | Can be gift wrapped |
| &nbsp; &nbsp; &nbsp; &nbsp; can_craft_count? | boolean | Can craft count |
| &nbsp; &nbsp; &nbsp; &nbsp; can_craft_mark | boolean | Always true |
| &nbsp; &nbsp; &nbsp; &nbsp; can_be_restored | boolean | ??? Always true |
| &nbsp; &nbsp; &nbsp; &nbsp; strange_parts | boolean | Always true |
| &nbsp; &nbsp; &nbsp; &nbsp; can_card_upgrade | boolean | Can be spelled |
| &nbsp; &nbsp; &nbsp; &nbsp; can_strangify | boolean | Always true |
| &nbsp; &nbsp; &nbsp; &nbsp; can_killstreakify | boolean | Always true |
| &nbsp; &nbsp; &nbsp; &nbsp; can_unusualify? | boolean | Can be unusualified |
| &nbsp; &nbsp; &nbsp; &nbsp; can_consume | boolean | ??? Always true |
| &nbsp; &nbsp; &nbsp; &nbsp; can_customize_texture? | boolean | Can be sprayed with the Decal Tool |
| &nbsp; &nbsp; &nbsp; &nbsp; duck_upgradable? | boolean | Duck Badge |
| tool? | Object |
| &nbsp; &nbsp; &nbsp; &nbsp; type? | string | |
| &nbsp; &nbsp; &nbsp; &nbsp; use_string? | string | String que aparece no menu de contexto do item na backpack |
| &nbsp; &nbsp; &nbsp; &nbsp; restriction? | string | Item restriction (Eg. crates that cannot be opened anymore) |
| &nbsp; &nbsp; &nbsp; &nbsp; usage_capabilities? | Object | |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; decodable? | boolean | Can be used to open crates (yeah, keys) |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; nameable? | boolean | Name tag and description tag |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; paintable? | boolean | Single-colored paint cans. Team-colored paint cans do not have this property |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; paintable_team_colors? | boolean | Team-colored paint cans |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_card_upgrade? | boolean | Is halloween spell or transmogrifier |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; strange_parts? | boolean | Is strange part or filter |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_customize_texture? | boolean | Decal Tool |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_gift_wrap? | boolean | Gift wrapper and giftapult |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_consume? | boolean | Chemistry sets and fabricators |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_strangify? | boolean | Strangifier |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_killstreakify? | boolean | Killstreak kit |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_unusualify? | boolean | Unusualifier |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; duck_upgradable? | boolean | Duck Token |
| styles? | Object[] | |
| &nbsp; &nbsp; &nbsp; &nbsp; name | string | Style name |
| used_by_classes | Classes[] | Array of classes that can use the item (can be empty) |
| attributes? | IIteamAttribute[] | Item attributes |
| &nbsp; &nbsp; &nbsp; &nbsp; name | string | |
| &nbsp; &nbsp; &nbsp; &nbsp; class | string | |
| &nbsp; &nbsp; &nbsp; &nbsp; value? | number | |
