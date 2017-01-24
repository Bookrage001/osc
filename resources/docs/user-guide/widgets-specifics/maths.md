# Maths

Maths do the maths !

----

## Formula

Formula evaluates mathematical expressions over other widgets' values each one of these widgets changes.

```js
{
    type:'formula',
    // etc
}
```


#### `formula`
- type: `string`
- default: `''`
- usage: a javascript expression in which
  - `${id}` will be replaced the `id`'s value  
- example: `${fader_1} * 2 + ${fader_2}`
