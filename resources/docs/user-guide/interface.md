# User interface


----

## URL Options

Client specific options can be set by adding query parameters to the server's url. One must prepend the url with a question mark (`?`) followed by `parameter=value` pairs separated with ampersands (`&`).

Supported options:

- `hdpi=1`: enable high resolution canvas

Example:

`http://server-ip:port?hdpi=1`

## Interaction events

### Click / Tap

Click / Tap events are handled at pressing time, not releasing.

### Right-click / Long touch

Widgets that have only one value input will give focus to it when receiving this event. When the editor is enabled, Right-click / Long touch spawns the editor's context menu.

### Drag

The widgets respond to mouse and touch drag gestures with a 1:1 precision ratio. By using two or more fingers, one can obtain higher precision gestures : each finger that touches the widget without moving will slow down the moving one.


----


## Editor

The session editor can be enabled in the side panel. Once enabled, clicking on a widget or on a tab will make it the *selected object*, adding a fancy dashed blue border to it.


### Properties

All the selected object's properties are displayed and can be modified in the side panel. Any modification will redraw the object **and all its children** if the submitted data is valid. Please refer to the [widgets reference](widgets-generics.md) for the list of valid options.

Widgets containers such as tabs, strips and panels will also list their children here, which can be reordered using drag-and-drop.

### Size / Position

The selected object can be resized using its south, south-east and east handles. It can be dragged with its north-west handle.

### Grid

By default, widget resizing / dragging snaps to a 10 pixel wide grid. Its width can be customized in the editor (when its enabled). Setting its width to 1 will disable it. Note that the grid doesn't affect manual setting of a widget's size / position.

### Context menu

Right clicking / long touch on a widget or on a tab will also display a context menu providing useful utilities :

- `copy`: copy widget's data
- `cut`: copy widget's data and delete selected widget
- `paste`: paste copied widget in selected container
  - `n+1` : increments the id of the copied widget (and all its children) before pasting
  - `clone` : paste the exact same widget
- `Add widget`: create a new widget in selected container
- `Add tab`: create a new tab in selected container
- `Delete`: delete selected tab or widget
