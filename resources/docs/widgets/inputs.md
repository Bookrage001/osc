# inputs

## Input


```js
{
    type:'input',
    // etc
}
```

### `editable`
- type: `boolean`
- default: `true`
- usage: set to `false` to make the input non-editable

### `horizontal`
- type: `boolean`
- default: `false`
- usage: set to `true` to display the input horizontally

### `align`
- type: `string`
- default: `''`
- usage: set to `left` or `right` to change text alignment (otherwise `center`)

### `unit`
- type: `string`
- default: `empty`
- usage: `unit` will be appended to the displayed widget's value (it doesn't affect osc messages)


## Keys


```js
{
    type:'keys',
    // etc
}
```

### `binding`
- type: `string|array`
- default: `''`
- usage: [keyboardjs](https://github.com/RobertWHurst/KeyboardJS) key combo string or array of strings.

### `keydown`
- type: `string`
- default: `''`
- usage: this property is evaluated each time the key combo is pressed. [Formulas](../extras/advanced-property-syntax/#formulas) are given extras variables in this context:
  - `key`: pressed key name (usefull for handling multiple keys with a single `keys` widget)
  - `ctrl`: control key state
  - `alt`: alt key state    
  - `shift`: shift key state   
  - `super`: command/windows key state   

### `keyup`
- type: `string`
- default: `''`
- usage: same as `keydown`, but evaluated when releasing the key combo.

### `repeat`
- type: `boolean`
- default: `true`
- usage: set to `false` to prevent `keydown` repeats when holding the key combo pressed.


## Script


```js
{
    type:'script',
    // etc
}
```

### `condition`
- type: `string`
- default: `''`
- usage: when the widget receives a value, if this property return a falsy value, the `script` property won't be evaluated. If it's non-falsy, it will be evaluated normally. [Formulas](../extras/advanced-property-syntax/#formulas) are given 1 extra variable in this context:
  - `value`: the value received by the widget

### `script`
- type: `string`
- default: `''`
- usage: this property is evaluated each time the widget receives a value if `condition` is non-falsy. [Formulas](../extras/advanced-property-syntax/#formulas) are given extras variables in this context:
  - `value`: the value received by the widget
  - `send`: `function` for sending osc messages
  - `set`: `function` for setting a widget's value

#### `send(target, address, arg1, arg2, ...)`
- `target` (`string` or `array` or `false`): one or several osc targets. Default targets (`--send` and the script's `target` property) are ignored unless `target` is `false`
- `address` (`string`): a valid osc address
- `arg`: one or several osc arguments to be sent. The script's `preArgs` property is ignored


#### `set(id, value)`
- `id` (`string`): a widget's id
- `value`: the widget's new value


## Gyroscope


```js
{
    type:'gyroscope',
    // etc
}
```

The gyroscope's value is an object containing multiple values, which can be used by other widgets via the [property maths syntax](../extras/advanced-property-syntax.md) :

```
// value.do.alpha       ( deviceorientation event alpha value )
// value.do.beta        ( deviceorientation event beta value )
// value.do.gamma       ( deviceorientation event gamma value )
// value.do.absolute    ( deviceorientation event absolute value )

// value.dm.x        ( devicemotion event acceleration x value )
// value.dm.y        ( devicemotion event acceleration y value )
// value.dm.z        ( devicemotion event acceleration z value )

// value.dm.gx        ( devicemotion event accelerationIncludingGravity x value )
// value.dm.gy        ( devicemotion event accelerationIncludingGravity y value )
// value.dm.gz        ( devicemotion event accelerationIncludingGravity z value )

// value.dm.alpha    ( devicemotion event rotationRate alpha value )
// value.dm.beta     ( devicemotion event rotationRate beta value )
// value.dm.gamma    ( devicemotion event rotationRate gamma value )

```


### `frequency`
- type: `number`
- default: `30`
- usage: update frequency in Hz (value updates per seconds)

### `normalize`
- type: `boolean`
- default: `true`
- usage: normalize gravity related values

### `compass`
- type: `boolean`
- default: `false`
- usage: set to `true` to return the orientation values with respect to the actual north direction of the world instead of the head direction of the device

### `screenAdjusted`
- type: `boolean`
- default: `false`
- usage: set to `true` to return screen adjusted values
