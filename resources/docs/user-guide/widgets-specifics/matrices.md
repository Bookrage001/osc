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

#### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures

#### `options`
- see fader's [`options`](sliders/#fader)


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

#### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures

#### `options`
- see toggle's [`options`](buttons/#toggle)


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

#### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures


#### `options`
- see push's [`options`](buttons/#push)
