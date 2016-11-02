## Widgets generics

A widget object is a javascript object. All widgets share a set of generic properties described below. Each widget type comes with an additional set of specific properties which are documented in these pages:

- [Sliders](widgets-specifics/sliders.md)
- [Buttons](widgets-specifics/buttons.md)
- [Pads](widgets-specifics/pads.md)
- [Matrices](widgets-specifics/matrices.md)
- [Plots](widgets-specifics/plots.md)
- [Containers](widgets-specifics/containers.md)

```js
{
    // widget properties
}
```

----
### Basics

#### `type`
- type: `string`
- default: `fader`

#### `id`
- type: `string`
- default: generated unique 'widget_n'
- usage: widgets sharing the same `id` will act as clones and update each other's value(s) without sending extra osc messages.

#### `id`
- type: `string`
- default: `empty`
- usage: widgets sharing the same `linkId` update each other's value(s) AND send their respective osc messages.



----
### Style

#### `label`
- type: `string|false`
- default: `auto`, which displays `id`
- usage:
    - set to `false` to hide completely
    - set to `icon: fontawesome-class` to display an icon from [FontAwesome](http://fontawesome.io/icons/) (replace `fontawesome-class` with the icon's name)

#### `top` / `left`
- type: `number|percentage`
- default: `auto`
- usage:
    - when both `top` and `left` are set to `auto`, the widget is positioned according to the normal flow of the page (from left to right, by order of creation).
    - otherwise, the widget will be absolutely positioned


#### `width` / `height`
- type: `number|percentage`
- default: `auto`

#### `color`
- type: `string`
- default: `auto`, inherited accent color
- usage: any valid `css` color code is valid, this will change the default accent color for the widget and all its children


#### `css`
- type: `string`
- default: *empty*
- usage: the `css` property can be used to override inherited [theming](theming.md) variables. Also, some widgets expose specific theming variables that allow a finer customization. Standard `css` properties can be applied to the widget's root element through this property.

----
### OSC


#### `precision`
- type: `integer`
- default: `2`
- usage: the `precision` property defines the number of decimals to display and to send. Set to `0` to send `integers` only.


#### `target`
- type: `array`
- default: `[]`
- usage:
    - this defines the targets of the widget's osc messages
    - each element of the `array` must be a string formatted as follows : `"ip:port"`
    - multiple targets can be specified : `["ip1:port1","ip2:port2"]`

#### `address`
- type: `string`
- default: `/widgets_id`
- usage: this is the `address` of the osc messages sent by the widget

#### `preArgs`
- type: `array`
- default: `[]`
- usage:
    - each element of the `array` defines a constant value that will be prepended to the osc message
    - values can be defined as objects if the type needs to be specified (ie different from the default implied by the `precision`)
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
