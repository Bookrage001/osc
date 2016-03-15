# Pads

Pads are multidimensional widgets that output multiple values.

## xy
```js
type:'xy',
range:{                     // [object] minimum and maximum values for x and y axis
        x:{"min":0,"max":1},
        y:{"min":0,"max":1}
    },
logScaleX: false,           // [bool] use logarithmic scale for X axis (log10)
logScaleY: false,           // [bool] use logarithmic scale for y axis (log10)
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
split:false                 // [bool|object] sends separate osc messages for x and y axes
                            // if true : '/x' & '/y' will be appended to the widget's path
                            // or object : {x:'/osc_path_x', y:'/osc_path_y'}

```

## rgb
```js
type:'rgb',
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
split:false                 // [bool|object] sends separate osc messages for x and y axes
                            // if true : '/r', '/g' & '/b' will be appended to the widget's path
                            // or object : {r:'/osc_path_r', g:'/osc_path_g',b:'/osc_path_b'}
```
Variant of xy pad, it outputs rgb values between 0 and 255.
