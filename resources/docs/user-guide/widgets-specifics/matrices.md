# Matrices

Matrices are special containers that only contain one type of widget. All contained widgets will be traversed by single dragging gestures.

## Multifader

Multifader creates a row of vertical faders that respond to the same gestures.

```js
{
    type:'multifader',
    // etc
}
```

#### `strips`
- type: `integer`
- default: `2`
- usage: number of faders in the row, each fader will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `path`: same as the widget's with `/i` appended to it


#### `range`
- see fader's [`range`](sliders/#fader)

#### `logScale`
- see fader's [`logScale`](sliders/#fader)

#### `unit`
- see fader's [`unit`](sliders/#fader)

----

## Multitoggle
```js
{
    type:'multitoggle',
    // etc
}
```

#### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows. Each cell will contain a toggle button that will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `path`: same as the widget's with `/i` appended to it


#### `on`
- see toggle's [`on`](buttons/#toggle)

#### `off`
- see toggle's [`off`](buttons/#toggle)


----
## Multipush
```js
{
    type:'multipush',
    // etc
}
```

#### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows. Each cell will contain a push button that will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `path`: same as the widget's with `/i` appended to it


#### `on`
- see push's [`on`](buttons/#push)

#### `off`
- see push's [`off`](buttons/#push)
