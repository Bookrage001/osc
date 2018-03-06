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

### `strips`
- type: `integer`
- default: `2`
- usage: number of faders in the row, each fader will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `address`: same as the widget's with `/i` appended to it

### `start`
- type: `integer`
- default: `0`
- usage: first faders's index

### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures

### `split`
- type: `boolean`
- default: `false`
- usage: if `true`, the fader's index will be appended to the widget's osc `address`; if `false` it will be prepended to the widget's `preArgs`

### `color`
- type: `string|array`
- default: `auto`, inherited accent color
- usage: can be an `array` of css color `strings`, which will be sequentially passed to the faders

### `options`
- see fader's [`options`](sliders/#fader)





## Multitoggle
```js
{
    type:'multitoggle',
    // etc
}
```

### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows. Each cell will contain a toggle button that will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `address`: same as the widget's with `/i` appended to it

### `start`
- type: `integer`
- default: `0`
- usage: first toggle's index

### `spacing`
- type: `integer`
- default: `0`
- usage: adds space between widgets

### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures

### `split`
- type: `boolean`
- default: `false`
- usage: if `true`, the toggle's index will be appended to the widget's osc `address`; if `false` it will be prepended to the widget's `preArgs`

### `color`
- type: `string|array`
- default: `auto`, inherited accent color
- usage: can be an `array` of css color `strings`, which will be sequentially passed to the toggles



### `options`
- see toggle's [`options`](buttons/#toggle)



## Multipush
```js
{
    type:'multipush',
    // etc
}
```

### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows. Each cell will contain a push button that will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `address`: same as the widget's with `/i` appended to it

### `start`
- type: `integer`
- default: `0`
- usage: first push's index

### `spacing`
- type: `integer`
- default: `0`
- usage: adds space between widgets

### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures

### `split`
- type: `boolean`
- default: `false`
- usage: if `true`, the push's index will be appended to the widget's osc `address`; if `false` it will be prepended to the widget's `preArgs`

### `color`
- type: `string|array`
- default: `auto`, inherited accent color
- usage: can be an `array` of css color `strings`, which will be sequentially passed to the pushes

### `options`
- see push's [`options`](buttons/#push)



## Keyboard

This one works pretty much like the multipush, excepts it looks like a piano keyboard ad

```js
{
    type:'keyboard',
    // etc
}
```

### `keys`
- type: `integer`
- default: `24`
- usage: defines the number keys

### `start`
- type: `integer`
- default: `60`
- usage: MIDI note number to start with (default is C4)

!!! note ""
    Standard keyboards settings are:
    25 keys - start 48
    49 keys - start 36
    61 keys - start 36
    88 keys - start 21


### `traversing`
- type: `boolean`
- default: `true`
- usage: enable traversing gestures

### `split`
- type: `boolean`
- default: `false`
- usage: if `true`, the note's midi code will be appended to the widget's osc `address`; if `false` it will be prepended to the widget's `preArgs`

### `options`
- see push's [`options`](buttons/#push)

### `css`
```
--color-white:color; /* white keys color */
--color-black:color; /* black keys color */
```
