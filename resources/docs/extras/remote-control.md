# Remote control

All widgets that send osc messages respond to the same messages. Additionnaly, Open Stage Control responds to some general osc commands.


## `/EDIT id options`


Apply a set of options to an existing widget by replacing the old ones with the new ones.


- `id`: `string`, widget's `id`
- `options`: `string`, [JSON5](https://github.com/json5/json5) stringified object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`

!!! warning ""
    Editing a widget can be cpu expensive, hence updating the UI continuously is not a good idea

## `/EDIT_/MERGE id options`

Apply a set of options to an existing widget by merging them to the widget's options.  


- `id`: `string`, widget's `id`
- `options`: `string`, [JSON5](https://github.com/json5/json5) stringified object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`

!!! warning ""
    Editing a widget can be cpu expensive, hence updating the UI continuously is not a good idea

## `/TABS id id etc`

Open the tabs designated by the `id` parameters. The target tab link must be accesible (opening a tab located in a disabled tab won't work unless you specify the parent tab's `id` before; the safest way to go is to pass the whole tab tree to enable).
