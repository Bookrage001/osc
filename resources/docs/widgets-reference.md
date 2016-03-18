# Widgets reference

## Widget generics

Every widget has the following properties:

```js
{
    id:"my_widget_id",      // [string] optional, default to unique 'widget_n'

    label:"My widget",      // [string|false] default to id, false to hide completely
    top:"auto",             // [string|integer] if set, the widget will have an absolute position (percentages allowed)
    left:"auto",            // [string|integer] if set, the widget will have an absolute position (percentages allowed)
    width:"auto",           // [string|integer] widget's width in px (percentages allowed)
    height:"auto",          // [string|integer] widget's height in px (percentages allowed)
    css:"",                 // [string] css styles, yeah

    precision:2,            // [integer] number of decimals : 0 to send integers
    target:false,           // [array/string] List of target hosts ("ip:port" pairs), separated by spaces
    path:false              // [string] osc path, default to '/widget_id'
}
```

**Important note about position (`left` & `top`)** : by default, the widget will be positioned according to the normal flow of the page (from left to right, by order of creation).

## Widget specifics

Each widget type comes with an additional set of specific properties which are described in the pages listed below.

- [Sliders](widgets/sliders.md)
- [Buttons](widgets/buttons.md)
- [Pads](widgets/pads.md)
- [Matrices](widgets/matrices.md)
- [Plots](widgets/plots.md)
- [Containers](widgets/containers.md)
