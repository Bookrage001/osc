## Widgets reference

## Widget generics

Every widget has the following characteristics:

```js
{
    id:"my_widget_id",      // [string] optional, default to unique 'widget_n'

    label:"My widget",      // [string] default to id
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

Each widget type comes with a set of specific characteristics which are described below.

### strip : *simple widget container*
```js
type:'strip',
horizontal:false,           // [bool]  set to true to display widgets horizontally
widgets: []                 // [array] of widget objects
```

### panel :  *widget/tabs containers*
```js
type:'panel',
stretch:false,              // [bool] set to true to stretch widgets width (don't put horizontal strips in it)
widgets: [],                // [array] of widget objects
tabs: []                    // [array] of tab objects
```

### fader
```js
type:'fader',
horizontal:false,           // [bool]   set to true to display fader horizontally
range: {"min":0,"max":1},   // [object] defining the breakpoints of the fader
                            //          keys can be percentages or 'min' / 'max'
unit: false,                // [string] value suffix
absolute:false              // [bool]   set to true for absolute value on touch/click instead of relative dragging
```

### knob
```js
type:'knob',
range: {"min":0,"max":1},   // [object] minimum and maximum values
unit: false,                // [string] value suffix
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
pan:false                   // [bool] true for panning knob
```

### xy
```js
type:'xy',
range:{                     // [object] minimum and maximum values for x and y axis
        x:{"min":0,"max":1},
        y:{"min":0,"max":1}
    },
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
split:false                 // [bool|object] sends separate osc messages for x and y axes
                            // if true : '/x' & '/y' will be appended to the widget's path
                            // or object : {x:'/osc_path_x', y:'/osc_path_y'}

```

### rgb
```js
type:'rgb',
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
split:false                 // [bool|object] sends separate osc messages for x and y axes
                            // if true : '/r', '/g' & '/b' will be appended to the widget's path
                            // or object : {r:'/osc_path_r', g:'/osc_path_g',b:'/osc_path_b'}
```
Variant of xy pad, it outputs rgb values between 0 and 255.


### toggle
```js
type:'toggle',
on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
```

### push
```js
type:'push',
on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
```

### $1
```js
type:'switch',
values: {                   // [object] of ("label":value) pairs
    "Value 1":1,
    "Value 2":2
}
```
