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

### `widgetId`
- type: `object`
- default: `empty`
- usage: a widget's `id` whose value will be linked to the Keys

### `binding`
- type: `string|array`
- default: `''`
- usage: [keyboardjs](https://github.com/RobertWHurst/KeyboardJS) key combo string or array of strings.

### `keydown`
- type: `string`
- default: `''`
- usage: [MathJS](http://mathjs.org/docs/expressions/syntax.html) expression whose output will be sent to the linked widget. This will be evaluated when the key combo is pressed. Available variables are ;
  - `value`: widget's value
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
