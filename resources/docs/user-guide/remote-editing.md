# Remote editing

The interface can be remotely edited by sending the appropriate osc messages (`-o` / `--osc-port` must be set).

```
/EXEC COMMAND ARGS
```

## Supported commands

### `edit` :  `/EXEC edit id options`

Apply a set of options to an existing widget

- `id`: `string`, widget's `id`
- `options`: `string`, JSON object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`
