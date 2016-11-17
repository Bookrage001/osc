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


#### `rangeX`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `x` axis. Same as fader's [`range`](sliders/#fader)

#### `rangeY`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `y` axis. Same as fader's [`range`](sliders/#fader)


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
    - set to `true` to send separate osc messages for `x` and `y` axis. The `address` will be the same as the widget's with `/x` or `/y` appended to it
    - can be set as an object to specify a different `address` : `{x:'/osc_address_x', y:'/osc_address_y'}`
- note: the widget will only respond to its original osc address, not to the splitted version

----

## MultiXy

```js
{
    type:'multixy',
    // etc
}
```

#### `points`
- type: `integer`
- default: `2`
- usage: defines the number of points on the pad

#### `pointSize`
- type: `integer`
- default: `15`
- usage: defines the points's size

#### `rangeX`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `x` axis. Same as fader's [`range`](sliders/#fader)

#### `rangeY`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `y` axis. Same as fader's [`range`](sliders/#fader)


#### `logScaleX`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `x` axis (log10)

#### `logScaleY`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `y` axis (log10)

#### `split`
- type: `boolean|object`
- default: `false`
- usage:
    - set to `true` to send separate osc messages for each point's `x` and `y` axis. The `address` will be the same as the widget's with `/N/x` or `/N/y` appended to it, where `N` is the point's id.
    - can be set as an object to specify a different `address` : `{0:'/osc_address/0', 1:'/osc_address_/1'}` (each address will be appended `/x` or `y`)
- note: the widget will only respond to its original osc address, not to the splitted version

#### `snap`
- type: `boolean`
- default: `false`
- usage: by default, the points must be touched directy to be dragged; if set to `true`, touching anywhere on the widget's surface will assign the points to the touching fingers one by one.

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
    - set to `true` to send separate osc messages for `r` and `g` & `b`. The `address` will be the same as the widget's with `/r`, `/g` or `/b` appended to it
    - can be set as an object to specify a different `address` : `{r:'/osc_address_r', g:'/osc_address_g',b:'/osc_address_b'}`
