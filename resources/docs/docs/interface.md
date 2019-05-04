# User interface

The interface is made of two main components: the widgets and the sidepanel.

## Widgets

All widgets are contained in the `root` widget, a special `panel` widget that can only contain tabs.

### Interacting with widgets

| Mouse | Touch | Description |
|---|---|---|
| Click | Tap | Handled at pressing time, not releasing. |
| Double Click | Double Tap | Some widgets handle double click / tap events. |
| Drag | Drag | The widgets respond to mouse and touch drag gestures with a 1:1 precision ratio. |
| `Ctrl` + Drag | | Holding the `Ctrl` key while dragging with the mouse increases the gesture's precision by 10.|
| | Two-fingers drag (single target) | Using two fingers on a single-touch target increases the gesture's precision by 10. |


## Sidepanel

The sidepanel can be opened by clicking the navigation icon in the upper right corner or by pressing `F10`.

### State management

- Store: save the state of all widgets in the temporary slot
- Recall: reload saved state from the temporary slot
- Send All: make all widgets send their current value
- Save / Save As: save the state of all widgets to a `.state` file on the server
- Load: load a state from a `.state` file on the server
- Export: save to local filesystem
- Import: load from local filesystem

### Traversing gestures

By default, a dragging gesture can only affect the widget it started on. Enabling traversing gesture does two things:

- make gestures affect every widgets no matter where they started
- make sliders-like widgets respond as if their `snap` option is enabled

When traversing gestures are set to `auto`, these will only affect widgets that have the same type as the first touched widget.

### Editor

See [Editing sessions](/docs/editing-sessions.md).
