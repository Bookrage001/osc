# Editing sessions

The session editor can be enabled from the sidepanel. Once enabled, clicking on a widget will make it the *selected widget*.

## Root panel

The root panel can be selected by clicking on the "Root" button in the sidepanel.

## Context menu

Right clicking / long touch on a widget or on a tab will also display a context menu providing useful utilities :

- `Edit parent`: select widget's parent for edition
- `Copy`: copy widget's data
- `Cut`: copy widget's data and delete selected widget
- `Wrap in`: wrap the widget in a new container
- `Paste`: paste copied widget in selected container
  - `Paste`: paste the widget as is
  - `ID + 1` : increments the id of the copied widget (and all its children) before pasting
  - `Clone` : create a clone widget targetting the copied widget
- `Add widget`: create a new widget in selected container
- `Add tab`: create a new tab in selected container
- `Delete`: delete selected tab or widget

## Save

Current session can be exported as a `.json` file. When overwriting a session file that's currently is use by other clients, they will reload it automatically.

## Load

Loading a session file doesn't affect other clients.

## Grid

By default, widget resizing / dragging snaps to a 10 pixel wide grid. Its width can be customized in the editor (when it's enabled). Setting its width to 1 will disable it. Note that the grid doesn't affect manual setting of a widget's size / position.

## Properties

Selected widget's properties are displayed and can be modified in the sidepanel. The [widgets reference](widgets/widgets) section lists the available properties for each widget type. Property fields are all multiline (press `shift + enter` for new line).

Properties are written in JSON, with some flexibility brought by the [JSON5](https://github.com/json5/json5) format. For example, doubles quotes around object keys are not mandatory. All input will be converted to standard JSON.


## Widget resizing / dragging

Selected widget can be resized using its south, south-east and east handles. It can be dragged with its north-west handle. Using this feature will convert position and size values to plain number values, thus breaking previously set percent or inherited values.

## Keyboard shortcuts

The following shortcuts are always available:

| Shortcut | Description |
|---|---|
| `mod + e` | enable/disable editor |
| `mod + s` | save session as... |
| `mod + o` | open a session file |

The following shortcuts are available only when the editor is enabled:

| Shortcut | Description |
|---|---|
| `mod + click`* | Multi-widget selection. Widgets can be toggled from selection by clicking on them individually.|
| `shift + click + drag`* | Draw a selection rectangle and attempt to select widgets in it (starts by selecting the widget under the cursor). If `mod` is pressed too, current selection is kept and will be merged with the new one if possible. |
| `f2` | Edit selected widget's label |
| `mod + z` | Undo |
| `mod + y / mod + shift + z` | Redo |
| `delete` (`backspace` on Mac) | Delete selected widgets |
| `mod + c` | Copy selected widgets |
| `mod + x` | Cut selected widgets |
| `mod + v` | Paste clipboard in selected widget |
| `mod + shift + v` | Paste and increment id |
| `up, down, left, right` | Move selected widgets (1 grid unit, hold `shift` for 5 grid units) |
| `alt + [up, down, left, right]` | Resize selected widgets (1 grid unit, hold `shift` for 5 grid units) |
| `mod + a` | Select current widget's siblings and itself |
| `mod + shift + a` | Cancel current widget selection |
| `mod + up` | Select current widget's parent |
| `mod + down` | Select current widget's first child |
| `mod + right` | Select current widget's next sibling |
| `mod + left` | Select current widget's previous sibling |


Where `mod` is `ctrl` except on MacOs (`command`)


!!! note "* Multi-widgets editing"
    - selection can only contain sibling widgets (same direct parent)
    - context-menu actions and properties changes apply to all selected widgets
    - resizing / dragging will affect all selected widgets, relatively to the first selected widget
