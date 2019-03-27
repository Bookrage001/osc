# Remote control

All widgets that send osc messages respond to the same messages. Additionnaly, Open Stage Control responds to some general osc commands.


## `/EDIT id options`


Apply a set of options to an existing widget by replacing the old ones with the new ones.


- `id`: `string`, widget's `id`
- `options`: `string`, [JSON5](https://github.com/json5/json5) stringified object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`

!!! warning ""
    Editing a widget can be cpu expensive, hence updating the UI continuously is not a good idea

## `/EDIT/MERGE id options`

Apply a set of options to an existing widget by merging them to the widget's options.  


- `id`: `string`, widget's `id`
- `options`: `string`, [JSON5](https://github.com/json5/json5) stringified object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`

!!! warning ""
    Editing a widget can be cpu expensive, hence updating the UI continuously is not a good idea

## `/EDIT/UNDO`

Undo editing action

## `/EDIT/REDO`

Redo editing action

## `/EDIT/GET target id`

Sends back a widget's data (JSON stringified object), including its children, to specified target.

- `target`: `string`, `ip:port` pair
- `id`: `string`, widget's `id`

Returns `/EDIT/GET id data`

- `id`: `string`
- `data`: `string`

## `/EDIT/GET target address preArg1 preArg2 ...`

Sends back a widget's data (JSON stringified object), including its children, to specified target.

- `target`: `string`, `ip:port` pair
- `address`: `string`, widget's `address`
- `preArg[1...]`: `*`, widget's `preArgs`

Returns `/EDIT/GET address preArg1 preArg2 ... data`

- `address`: `string`, widget's `address`
- `preArg[1...]`: `*`, widget's `preArgs`
- `data`: `string`


## `/GET target id`

Sends back a widget's value to specified target.

- `target`: `string`, `ip:port` pair
- `id`: `string`, widget's `id`

Returns `/GET id value`

- `id`: `string`
- `value`: `*`

## `/GET target address preArg1 preArg2 ...`

Sends back a widget's value to specified target.

- `target`: `string`, `ip:port` pair
- `address`: `string`, widget's `address`
- `preArg[1...]`: `*`, widget's `preArgs`

Returns `/GET address preArg1 preArg2 ... value`

- `address`: `string`, widget's `address`
- `preArg[1...]`: `*`, widget's `preArgs`
- `value`: `*`

## `/GET/#`

Same as `/GET` but uses the widget's address instead of `/GET` to reply.

## `/SET target id value`

Set a widget's value as if it was interacted with from the interface. This is likely to make it send its value.

- `id`: `string`, widget's `id`
- `value`: `*`, widget's new value

## `/SET address preArg1 preArg2 ... value`

Set a widget's value as if it was interacted with from the interface. This is likely to make it send its value.

- `address`: `string`, widget's `address`
- `preArg[1...]`: `*`, widget's `preArgs`
- `value`: `*`, widget's new value


## `/TABS id id etc`

Open the tabs designated by the `id` parameters. The target tab link must be accesible (opening a tab located in a disabled tab won't work unless you specify the parent tab's `id` before; the safest way to go is to pass the whole tab tree to enable).
