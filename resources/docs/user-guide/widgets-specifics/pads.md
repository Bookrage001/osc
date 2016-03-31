# Pads

Pads are multidimensional widgets that output multiple values.

----

## XY

```js
{
    type:'xy',
    // etc
}
```


#### `range`
- type: `object`
- default:
    `{
        x:{"min":0,"max":1},
        y:{"min":0,"max":1}
    }`
- usage: defines the `min` and `max` values for the `x` and `y` axis

#### `logScaleX`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `x` axis (log10)

#### `logScaleY`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `y` axis (log10)

#### `snap`
- type: `boolean`
- default: `false`
- usage: by default, dragging the widget will modify it's value starting from its last value. Setting this to `true` will make it snap directly to the mouse/touch position.

#### `split`
- type: `boolean|object`
- default: `false`
- usage:
    - set to `true` to send separate osc messages for `x` and `y` axis. The `path` will be the same as the widget's with `/x` or `/y` appended to it
    - can be set as an object to specify a different `path` : `{x:'/osc_path_x', y:'/osc_path_y'}`

----

## RGB

RGB is a variant of XY, it outputs rgb values between 0 and 255.


```js
{
    type:'rgb',
    // etc
}
```


#### `precision`
- default:`0`
#### `snap`
- type: `boolean`
- default: `false`
- usage: by default, dragging the widget will modify it's value starting from its last value. Setting this to true will make it snap directly to the mouse/touch position.

#### `split`
- type: `boolean|object`
- default: `false`
- usage:
    - set to `true` to send separate osc messages for `r` and `g` & `b`. The `path` will be the same as the widget's with `/r`, `/g` or `/b` appended to it
    - can be set as an object to specify a different `path` : `{r:'/osc_path_r', g:'/osc_path_g',b:'/osc_path_b'}`
