# Remote editing

The interface can be remotely edited by sending the appropriate osc messages (`-o` / `--osc-port` must be set).

## supported commands

### `/EDIT id options`

Apply a set of options to an existing widget

- `id`: `string`, widget's `id`
- `option`: `string`, JSON object defining the new properties to merge
  - example: `{"label":"New Label", "color":"red"}`
