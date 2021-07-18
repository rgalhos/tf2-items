# Properties
### isReady
`true` se o schema tiver sido baixado e processado.

# Methods
### constructor(steamApiKey)
* `steamApiKey`- Your Steam WebAPI Key

Constructs a new `Schema`.

### load()
Baixa e processa o schema. Nenhum método deve ser chamado antes deste.

### getRawSchemaOverview()
Returns raw TF2's schema overview.

### getRawSchemaItems()
Returns raw TF2's schema items.

### getItemNameByDefindex(defindex)
* `defindex` - Item's defindex.

Returns item name, or `undefined` if not found.

### getItemDefindexByName(name)
* `name` - Item's name.

Returns item's defindex, or `undefined` if not found.

### getUnusualEffectById(id)
* `id` - Effect id.

Return unusual effect name, or `undefined` if not found.

### getUnusualEffectByName(name)
* `name` - Effect name.

Returns unusual effect id, or `undefined` if not found.

### getItemSchema(defindex)
* `defindex` - Item's defindex.

Returns item's `SchemaItem`, or `undefined` if not found.

### getAllUnusualEffects()
Returns an array of id/name pairs of all unusual effects, or an empty array if `#load` or `#loadSchemaOverview` hasn't been called.

### getSkuFromFullName(fullName)
* `fullName` - Full item name

Returns item's sku. Throws an error if not found.

### skuToFullName(sku)
* `sku` - Item sku

Returns full item name. Throws an error if not found.

### skuToItemObject(sku)
* `sku` - Item sku

Returns an `ISchemaItem`. Throws an error if not found.

# SchemaItem

As funções desta classe não são enumeradas, então é possível iterar sobre as propriedades como se fosse um `ISchemaItem`.

## Properties
| Property      | Type          | Description  |
| ------------- | ------------- | ----- |
| fullName | string | Nome completo do item |
| name | string | Internal item name |
| item_name | string | Item name |
| defindex | number | Item defindex |
| item_class? | string | Class of the item |
| item_type_name? | string | Name displayed after the "Level #" tag in the inventory |
| item_description? | string | Item description |
| proper_name | boolean | Se verdadeiro, o nome usado no jogo é o da propriedade "name", se não, o nome usado é o de "item_name" |
| item_slot? | string | Item slot |
| model_player | string \| null | Player model |
| item_quality | EQuality \| 255 | Default item quality. It is *255* only on powerups and item bundles |
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
| &nbsp; &nbsp; &nbsp; &nbsp; usable_gc? | boolean | Items that can be used just by connecting to the game coordinator (Passes, unlocked crates, saxtons, war paints, etc) |
| &nbsp; &nbsp; &nbsp; &nbsp; usable_out_of_game? | boolean | Can be used in the main menu |
| &nbsp; &nbsp; &nbsp; &nbsp; decodable? | boolean | Can be opened (crates) |
| &nbsp; &nbsp; &nbsp; &nbsp; nameable? | boolean | Can be renamed |
| &nbsp; &nbsp; &nbsp; &nbsp; usable? | boolean | Can be used (canteens, noise makers) |
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
| &nbsp; &nbsp; &nbsp; &nbsp; use_string? | string | String que aparece no menu de context da backpack |
| &nbsp; &nbsp; &nbsp; &nbsp; restriction? | string | Item restriction (Eg. crates that cannot be opened anymore) |
| &nbsp; &nbsp; &nbsp; &nbsp; usage_capabilities? | Object | |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; decodable? | boolean | Can be used to open crates (yeah, keys) |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; nameable? | boolean | Name tag and description tag |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; paintable? | boolean | Single-colored paint cans (Team-colored paint cans do not have this property!) |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; paintable_team_colors? | boolean | Team-colored paint |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_card_upgrade? | boolean | Is halloween spell or transmogrifier |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; strange_parts? | boolean | Is strange part or filter |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_customize_texture? | boolean | Decal Tool |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_gift_wrap? | boolean | Gift wrapper and giftapult |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_consume? | boolean | Chemistry sets and fabricators |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_strangify? | boolean | Strangifier |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_killstreakify? | boolean | Killstreak kit |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; can_unusualify? | boolean | Unusualifier |
| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; duck_upgradable? | boolean | Duck token |
| styles? | Object[] | |
| &nbsp; &nbsp; &nbsp; &nbsp; name | string | Style name |
| used_by_classes | Classes[] | Array of classes that can use the item (can be empty) |
| attributes? | IIteamAttribute[] | Item attributes |
| &nbsp; &nbsp; &nbsp; &nbsp; name | string | |
| &nbsp; &nbsp; &nbsp; &nbsp; class | string | |
| &nbsp; &nbsp; &nbsp; &nbsp; value? | number | |

## Methods

### isCrate()
* Retorna `true` se o item for uma caixa.

### isKey()
* Retorna `true` se o item for uma chave.

### isPaintCan()
* Retorna `true` se o item for um paint can.

### isVoodooSoul()
* Retorna `true` se o item for um voodoo-cursed soul.

### isHalloweenItem()
* Retorna `true` se o item for um item de halloween.

### isNoiseMaker()
* Retorna `true` se o item for um noise maker.

### isRestricted()
* Retorna o nome da restrição ou `false` caso não haja.

### isStrangifier()
* Retorna `true` se o item for um strangifier.

### isStrangeFilter()
* Retorna `true` se o item for um strange filter.

### isStrangePart()
* Retorna `true` se o item for uma strange part.

### hasHolidayRestriction()
* Retorna o nome da restrição ou `false` caso não haja.

### isUntradableByDefault()
* Retorna se o item é não-trocável por padrão.

### isAlwaysTradable()
* Retorna se o item é sempre trocável por padrão.

### getPaintColor()
* Single-colored paint cans and spells: Returns color code
* Team-colored paint cans: Returns an object with color codes. Eg:
    * `{ red: 12073019, blu: 5801378 }`
* Retorna `null` se o item não for um paint can ou spell.

### getCrateSeries()
Retorna o número da caixa ou `null` se não tiver.

### getCrateKey()
Retorna o defindex da chave que abre a caixa ou `null` se não tiver.

### getItemTarget()
Retorna o defindex do item alvo ou `null` se não tiver.









