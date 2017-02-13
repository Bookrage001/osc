# Remote editing

The interface can be remotely edited by sending the appropriate osc messages (from an external source with `-o` / `--osc-port` set, or via `custom-module` scripting).

```
/EXEC COMMAND ARGS
```

## Supported commands

#### `edit` :  `/EXEC edit id options`


Apply a set of options to an existing widget by replacing the old ones with the new ones.


- `id`: `string`, widget's `id`
- `options`: `string`, JSON object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`

*Editing a widget can be cpu expensive, hence updating the UI continuously is not a good idea.*

#### `edit_soft` :  `/EXEC edit_soft id options`


Apply a set of options to an existing widget by merging them to the widget's options.  


- `id`: `string`, widget's `id`
- `options`: `string`, JSON object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`

*Editing a widget can be cpu expensive, hence updating the UI continuously is not a good idea.*
