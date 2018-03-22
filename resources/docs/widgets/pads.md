# Pads

Pads are multidimensional widgets that output multiple values.



## XY

```js
{
    type:'xy',
    // etc
}
```

### `input`
- type: `boolean`
- default: `true`
- usage: set to `false` to hide the built-in input

### `rangeX`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `x` axis. Same as fader's [`range`](sliders/#fader)

### `rangeY`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `y` axis. Same as fader's [`range`](sliders/#fader)


### `logScaleX`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `x` axis (log10)

### `logScaleY`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `y` axis (log10)

### `snap`
- type: `boolean`
- default: `false`
- usage: by default, dragging the widget will modify it's value starting from its last value. Setting this to `true` will make it snap directly to the mouse/touch position.

### `spring`
- type: `boolean`
- default: `false`
- usage: when set to `true`, the widget will go back to its `default` value when released.

### `doubleTap`
- type: `boolean|string`
- default: `false`
- usage: set to `true` to make the fader reset to its `default` value when receiving a double tap. `doubleTap` can also be an osc address, which case the widget will just send an osc message (`/<doubleTap> <preArgs>`),


### `split`
- type: `boolean|object`
- default: `false`
- usage:
    - set to `true` to send separate osc messages for `x` and `y` axis. The `address` will be the same as the widget's with `/x` or `/y` appended to it
    - can be set as an object to specify a different `address` : `['/osc_address_x', '/osc_address_y']`
- note: the widget will only respond to its original osc address, not to the splitted version



## MultiXy

```js
{
    type:'multixy',
    // etc
}
```

### `points`
- type: `integer|array`
- default: `2`
- usage: defines the number of points on the pad. Can be an `array` of `strings` that will be used as labels for the points (ex: `['A', 'B']`)

### `pointSize`
- type: `integer`
- default: `15`
- usage: defines the points's size

### `rangeX`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `x` axis. Same as fader's [`range`](sliders/#fader)

### `rangeY`
- type: `object`
- default:
    `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `y` axis. Same as fader's [`range`](sliders/#fader)


### `logScaleX`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `x` axis (log10)

### `logScaleY`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `y` axis (log10)

### `split`
- type: `boolean|object`
- default: `false`
- usage:
    - set to `true` to send separate osc messages for each point's `x` and `y` axis. The `address` will be the same as the widget's with `/N/x` or `/N/y` appended to it, where `N` is the point's id (or the point's label if `points` is an `array`).
    - can be set as an object to specify a different `address` : `['/0/x', '/0/y', '/1/x', '/2/y']`
- note: the widget will only respond to its original osc address, not to the splitted version

### `snap`
- type: `boolean`
- default: `false`
- usage: by default, the points are dragged from their initial position; if set to `true`, touching anywhere on the widget's surface will make them snap to the touching coordinates (one per touch).



## RGB

RGB is a variant of XY, it outputs rgb values between 0 and 255.


```js
{
    type:'rgb',
    // etc
}
```

### `input`
- type: `boolean`
- default: `true`
- usage: set to `false` to hide the built-in input

### `precision`
- default:`0`

### `snap`
- type: `boolean`
- default: `false`
- usage: by default, dragging the widget will modify it's value starting from its last value. Setting this to true will make it snap directly to the mouse/touch position.

### `range`
- type: `object`
- default: `{"min":0,"max":255}`
- usage: `range` defines the widget's output scale.

### `split`
- type: `boolean|object`
- default: `false`
- usage:
    - set to `true` to send separate osc messages for `r` and `g` & `b`. The `address` will be the same as the widget's with `/r`, `/g` or `/b` appended to it
    - can be set as an object to specify a different `address` : `['/r', '/b', '/b']`
- note: the widget will only respond to its original osc address, not to the splitted version
