# Maths

Maths do the maths !



## Formula

Formula evaluates mathematical expressions over other widgets' values each one of these widgets changes.

```js
{
    type:'formula',
    // etc
}
```


### `formula`
- type: `string`
- default: `''`
- usage: a [mathjs](http://mathjs.org/docs/expressions/syntax.html) expression in which
    - `${id}` will be replaced the `id`'s value  
    - example: `${fader_1} * 2 + ${fader_2}`
- **important note**: contrary to what is stated in *mathjs*' documentation, **matrix indexes are zero-based** here

### `condition`
- type: `string`
- default: `''`
- usage:
    - a [mathjs](http://mathjs.org/docs/expressions/syntax.html) comparison expression that bypasses widget's osc sending when returning`false`
    - example: `${fader_1} > 0.5`

### `unit`
- type: `string`
- default: `empty`
- usage: `unit` will be appended to the displayed widget's value (it doesn't affect osc messages)

### `split`
- type: `object`
- default: `[]`
- usage: specify a different `address` for each item of the widget's value : `['/a', '/b']`
- note: only use this is the formula return an `array`
