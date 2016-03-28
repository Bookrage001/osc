# Widgets reference

## Widget generics

Every widget has the following properties:

```js
{
    id:"my_widget_id",      // [string] optional, default to unique 'widget_n'

    label:"My widget",      // [string|false] default to id, false to hide completely
    top:"auto",             // [number|percentage%] if set, the widget will have an absolute position
    left:"auto",            // [string|percentage%] if set, the widget will have an absolute position
    width:"auto",           // [string|percentage%] widget's width
    height:"auto",          // [string|percentage%] widget's height
    color:'auto',           // [string] css color code replacing the default accent color
    css:"",                 // [string] css styles, yeah

    precision:2,            // [integer] number of decimals : 0 to send integers
    target:false,           // [array/string] List of target hosts ("ip:port" pairs), separated by spaces
    path:false,             // [string] osc path, default to '/widget_id'
    preArgs:[]              // [array] list of constant values to prepend to the sent value(s)
                            // a value's type can be specified by writing it as an object:
                            // preArgs: [{type:"integer",value:1}]
}
```

**Important note about position (`left` & `top`)** : by default, the widget will be positioned according to the normal flow of the page (from left to right, by order of creation).

## CSS

The css property can be used to override theming variables (see [theming](theming.md) for a widget. Also, some widgets expose specific theming variables that allow a finer customization.

## Widget specifics

Each widget type comes with an additional set of specific properties which are described in the pages listed below.

- [Sliders](widgets/sliders.md)
- [Buttons](widgets/buttons.md)
- [Pads](widgets/pads.md)
- [Matrices](widgets/matrices.md)
- [Plots](widgets/plots.md)
- [Containers](widgets/containers.md)
