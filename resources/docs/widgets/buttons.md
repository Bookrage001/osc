# Buttons

Buttons are exactly what you think they are.



## Toggle
```js
{
    type:'toggle',
    // etc
}
```

### `doubleTap`
- type: `boolean`
- default: `false`
- usage: set to `true` to make the button require a double tap to be toggled instead of a single tap

### `led`
- type: `boolean`
- default: `false`
- usage: set to `true` to display the toggle's state with a led

### `on`<i class="dynamic-prop-icon" title="dynamic"></i>
- type: `string|number|object`
- default: `1`
- usage: defines which value is sent on `on` position
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](./widgets.md#preargs))

### `off`<i class="dynamic-prop-icon" title="dynamic"></i>
- type: `string|number|object`
- default: `0`
- usage: defines which value is sent on `off` position
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](./widgets.md#preargs))




## Push
```js
{
    type:'push',
    // etc
}
```

### `on`<i class="dynamic-prop-icon" title="dynamic"></i>
- type: `string|number|object`
- default: `1`
- usage: defines which value is sent when pushing the button
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](./widgets.md#preargs))

### `off`<i class="dynamic-prop-icon" title="dynamic"></i>
- type: `string|number|object`
- default: `0`
- usage: defines which value is sent when releasing the button
    - set to `null` to send send no argument in the osc message
    - can be an `object` if the type needs to be specified (see [preArgs](./widgets.md#preargs))

### `norelease`
- type: `bool`
- default: `false`
- usage: set to true to prevent sending any osc message when releasing the button

Setting the `push`'s value externally (via osc) will toggle it's inner light.




## Switch

```js
{
    type:'switch',
    // etc
}
```
### `values`
- type: `array|object`
- default: `{"Value 1":1,"Value 2":2}`
- usage:
    - `array` of possible values to switch between : `[1,2,3]`
    - `object` of `"label":value` pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won't be kept.

### `showValues`
- type: `boolean`
- default: `false`
- usage: if `values` is an `object`, set to `true` to display both values and labels instead of labels only


## Dropdown
```js
{
    type:'dropdown',
    // etc
}
```

### `values`<i class="dynamic-prop-icon" title="dynamic"></i>
- type: `array|object`
- default: `{"Value 1":1,"Value 2":2}`
- usage:
    - `array` of possible values to switch between : `[1,2,3]`
    - `object` of `"label":value` pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won't be kept.
    - an empty option will always be prepended to `values` (sends an osc message without any value); it can be hidden by adding `option:first-child{display:none}` to the widget's `css`
