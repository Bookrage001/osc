# User interface

## Sidepanel

The sidepanel can be opened by clicking the navigation icon in the upper right corner or by pressing F10.

### State management

- Store: save the state of all widgets in the temporary slot
- Recall: reload saved state from the temporary slot
- Send All: make all widgets send their current value
- Export: save the state of all widgets to a `.preset` file
- Import: load a state from a `.preset` file

### Traversing gestures

By default, a dragging gesture can only affect the widget it started on. Enabling traversing gesture does two things:

- make gestures affect every widgets no matter where they started
- make sliders-like widgets respond as if their `snap` option is enabled

### Editor

See [Editing sessions](editing-sessions.md).

## Interactions

| Mouse | Touch | Description |
|---|---|---|
| Click | Tap | Handled at pressing time, not releasing. |
| Double Click | Double Tap | Some widgets handle double click / tap events. |
| Right-click | Long touch | Widgets that have only one value input will give focus to it when receiving this event. When the editor is enabled, Right-click / Long touch spawns the editor's context menu. |
| Drag | | The widgets respond to mouse and touch drag gestures with a 1:1 precision ratio. By using two or more fingers, one can obtain higher precision gestures : each finger that touches the widget without moving will slow down the moving one. |
