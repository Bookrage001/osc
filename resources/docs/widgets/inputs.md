# inputs

## Input


```js
{
    type:'input',
    // etc
}
```

### `widgetId`
- type: `object`
- default: `empty`
- usage: a widget's `id` whose value will be linked to the input

### `editable`
- type: `boolean`
- default: `true`
- usage: set to `false` to make the input non-editable

### `horizontal`
- type: `boolean`
- default: `false`
- usage: set to `true` to display the input horizontally

### `unit`
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

### `widgetId`
- type: `object`
- default: `empty`
- usage: a widget's `id` whose value will be linked to the Keys

### `binding`
- type: `string|array`
- default: `''`
- usage: [keyboardjs](https://github.com/RobertWHurst/KeyboardJS) key combo string or array of strings.

### `keydown`
- type: `string`
- default: `''`
- usage: [MathJS](http://mathjs.org/docs/expressions/syntax.html) expression whose output will be sent to the linked widget. This will be evaluated when the key combo is pressed. Available variables are ;
  - `value`: widget's value
  - `key`: pressed key name (usefull for handling multiple keys with a single `keys` widget)
  - `ctrl`: control key state
  - `alt`: alt key state    
  - `shift`: shift key state   
  - `super`: command/windows key state   

### `keyup`
- type: `string`
- default: `''`
- usage: same as `keydown`, but evaluated when releasing the key combo.

### `repeat`
- type: `boolean`
- default: `true`
- usage: set to `false` to prevent `keydown` repeats when holding the key combo pressed.
