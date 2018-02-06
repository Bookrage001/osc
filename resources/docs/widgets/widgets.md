# Widgets properties

All widgets share a set of generic properties described below.

## Basics

### `type`
- type: `string`
- default: `fader`

### `id`
- type: `string`
- default: generated unique 'widget_n'
- usage: widgets sharing the same `id` will act as clones and update each other's value(s) without sending extra osc messages.

### `linkId`
- type: `string`
- default: `empty`
- usage: widgets sharing the same `linkId` update each other's value(s) AND send their respective osc messages.


## Style

### `label`
- type: `string|false`
- default: `auto`, which displays `id`
- usage:
    - set to `false` to hide completely
    - insert icons from [FontAwesome](https://fontawesome.com/icons?d=gallery&s=solid&m=free) using the prefix `^` followed by the icon's name : `made with ^heart`, etc

### `top` / `left`
- type: `number|percentage`
- default: `auto`
- usage:
    - when both `top` and `left` are set to `auto`, the widget is positioned according to the normal flow of the page (from left to right, by order of creation).
    - otherwise, the widget will be absolutely positioned


### `width` / `height`
- type: `number|percentage`
- default: `auto`

### `color`<i class="md-icon" title="dynamic">flash_on</i>
- type: `string`
- default: `auto`, inherited accent color
- usage: any valid `css` color code is valid, this will change the default accent color for the widget and all its children


### `css`
- type: `string`
- default: *empty*
- usage: the `css` property can be used to override inherited [theming](../extras/theming.md) variables. Also, some widgets expose specific theming variables that allow a finer customization. Standard `css` properties can be applied to the widget's root element through this property, `css` selectors can also be used apply custom styles to the widget's children.
- examples:
    - `border-radius:5rem; .label {font-size: 20rem}` will round the widget's corners and increase its label's font-size and all its children's labels'
    - `border-radius:5rem; > .label {font-size: 20rem}` will round the widget's corners and increase its label's font-size (the `>` selector targets only the direct children of the widget element)


## OSC


### `value`<i class="md-icon" title="dynamic">flash_on</i>
- type: `*`
- default: `empty`
- usage: if set, the widget will be initialized with this `value`. This won't send any osc message unless it is changed because of a property inheritance update initiated by an action that should send osc (e.g. dragging a slider).
- note: its `type` must match the widget's value type (ie a `number` for sliders, an `array` for pads, etc).


### `precision`<i class="md-icon" title="dynamic">flash_on</i>
- type: `integer|string`
- default: `2`
- usage: the `precision` property defines the number of decimals to display and to send.
  - set to `0` to send `integers` only.
  - a specific data type can be specified by appending a valid osc type tag to the precision value, for example : `3d` will make the widget send double precision numbers rounded to three decimals

### `target`<i class="md-icon" title="dynamic">flash_on</i>
- type: `array`
- default: `[]`
- usage:
    - this defines the targets of the widget's osc messages
    - each element of the `array` must be a string formatted as follows : `"ip:port"`
    - multiple targets can be specified : `["ip1:port1","ip2:port2"]`
    - if [`midi`](../extras/midi.md) is enabled, targets can be `"midi:device_name"`
    - special item `"self"` can be used to refer to the emitting client directly
    - if no target is set (empty array `[]`), messages can still be sent if the server has defaults targets (`-s / --send`)
    - to disable osc regardless of the previous point, set `target` to `[null]`

### `address`<i class="md-icon" title="dynamic">flash_on</i>
- type: `string`
- default: `/widgets_id`
- usage: this is the `address` of the osc messages sent by the widget, it must start with a `/`

### `touchAddress`
- type: `string`
- default: `empty`
- usage: sliders and pads can send special osc messages to inform weither they are currently touched or not. The osc message will be of the following form :
```
    /touch/address [preArgs] 0/1
```

### `preArgs`<i class="md-icon" title="dynamic">flash_on</i>
- type: `array`
- default: `[]`
- usage:
    - each element of the `array` defines a constant value that will be prepended to the osc message
    - values can be defined as objects if the osc data type needs to be specified (ie different from the default implied by the `precision` option)
- example:
```js
preArgs: [
    "1",        // this will always be sent as a string
    0.5,        // this will be sent as an integer if precision equals 0
    1,          // this will be sent as float if precision is different from 0
    {
        type:"f",
        value:0.5
    },
    {
        type:"i",
        value:1
    },
    {
        type:"T",
        value:true
    },
    {
        type:"F",
        value:false
    }
]
```
