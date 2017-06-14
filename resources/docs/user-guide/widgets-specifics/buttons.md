# Buttons

Buttons are exactly what you think they are.

----

## Toggle
```js
{
    type:'toggle',
    // etc
}
```

#### `on`
- type: `string|number|object`
- default: `1`
- usage: defines which value is sent on `on` position
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](../widgets-properties.md#preargs))

#### `off`
- type: `string|number|object`
- default: `0`
- usage: defines which value is sent on `off` position
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](../widgets-properties.md#preargs))


----

## Push
```js
{
    type:'push',
    // etc
}
```

#### `on`
- type: `string|number|object`
- default: `1`
- usage: defines which value is sent when pushing the button
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](../widgets-properties.md#preargs))

#### `off`
- type: `string|number|object`
- default: `0`
- usage: defines which value is sent when releasing the button
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](../widgets-properties.md#preargs))

### `norelease`
- type: `bool`
- default: `false`
- usage: set to true to prevent sending any osc message when releasing the button

Setting the `push`'s value externally (via osc) will toggle it's inner light.


----

## Switch
```js
{
    type:'switch',
    // etc
}
```

#### `values`
- type: `array|object`
- default: `{"Value 1":1,"Value 2":2}`
- usage:
    - `array` of possible values to switch between : `[1,2,3]`
    - `object` of `"label":value` pairs
