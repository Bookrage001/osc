# Plots

Plots are tools that display other widgets' state or incomming osc messages. They are not sensitive to mouse and touch interactions.

## Led
```js
{
    type:'led',
    // etc
}
```

### `range`
- type: `object`
- default: `{"min":0,"max":1}`
- usage: defines the `min` and `max` value the led's intensity will be mapped to

### `logScale`
- type: `boolean`
- default: `false`
- usage: set to true to use logarithmic scaling

## RgbLed

```js
{
    type:'rgbled',
    // etc
}
```

This one is like the `led` except it takes either three arguments (red, green and blue values between 0 and 255) with an optionnal forth argument (alpha, between 0 and 1), or one argument (a valid css color name).

## Plot

The plot receives an array of coordinates and draws them on a chart. Coordinates can be :
- `y` values evenly spaced on the `x` axis
- `[x, y]` coordinates arrays

!!! info
    Coordinates also can be sent as a stringified array (`[]`). A stringified object can also be sent to change specific points' coordinates (e.g. `{0:1, 4:0}` will change the 1st and 5th points' coordinates) .

```js
{
    type:'plot',
    // etc
}
```

### `value`
- type: `array|string`
- default: `['']`
- usage:
    - as an `array`: where items can be
        - `number`
        - `string` (widget's `id`)
        - `[x, y]`: array of `number` or `string`

### `range`
- type: `object`
- default:
    `{
        x:{"min":0,"max":1},
        y:{"min":0,"max":1}
    }`
- usage: defines the `min` and `max` values for the `x` and `y` axis

### `bars`
- type: `boolean`
- default: `false`
- usage: set to `true` to use draw bars instead (disables `logScaleX` and forces `x-axis` even spacing)

### `logScaleX`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `x` axis (log10)

### `logScaleY`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `y` axis (log10)

### `smooth`
- type: `boolean`
- default: `false`
- usage: set to `true` to make the line smooth. Float values are also acceptable (works fine between 0 and 0.5)

### `origin`
- type: `number`
- default: `auto`
- usage: defines the y-axis origin. Set to `false` to disable it.

## Eq

The Eq receives an array of filter objects and draws their frequency response between 20Hz and 22050Hz.

```js
{
    type:'eq',
    // etc
}
```

### `value`
- type: `array`
- default: `[]`
- usage:
    - each item must be an object of the form below
    - all filters parameters can be filled with widget ids, whose value will be used

```
{
    type:[string],   // "highpass", "highshelf", "lowpass", "lowshelf", "peak", "notch"
    freq:[number],   //
    q:[number],      //
    gain:[number],   //
    on:[bool]        // 1 or true = active, 0 or false = bypassed
}
```

### `resolution`
- type: `number`
- default: `128`
- usage: defines the number of points used to compute the frequency response

### `rangeY`
- type: `object`
- default:
    `{"min":-20,"max":20}`
- usage: defines the `min` and `max` values for the `y` axis (dB level)

### `logScaleX`
- type: `boolean`
- default: `false`
- usage: set to `true` to use logarithmic scale for the `x` axis (log10)

### `smooth`
- type: `boolean`
- default: `false`
- usage: set to true to make the line smooth. Float values are also acceptable (works fine between 0 and 0.5)

### `origin`
- type: `number`
- default: `auto`
- usage: defines the y-axis origin. Set to `false` to disable it.

## Visualizer

The visualizer displays the evolution in time of a received value (through osc) *or* another widget's value.

```js
{
    type:'visualizer',
    // etc
}
```

### `duration`
- type: `number`
- default: `1`
- usage: window size in seconds

### `range`
- type: `object`
- default: `{"min":0,"max":1}`
- usage: defines the `min` and `max` values for the `y` axis

### `logScale`
- type: `boolean`
- default: `false`
- usage: set to `true` use logarithmic scaling (log10)

### `smooth`
- type: `boolean`
- default: `false`
- usage: set to true to make the line smooth. Float values are also acceptable (works fine between 0 and 0.5)

### `origin`
- type: `number`
- default: `auto`
- usage: defines the y-axis origin. Set to `false` to disable it.

## Text

Text displays incoming values (via osc) as text. Sending a message with no argument to the widget will reset it to its default text.

```js
{
    type:'text',
    // etc
}
```

### `vertical`
- type: `boolean`
- default: `false`
- usage: set to `true` display vertically

### `wrap`
- type: `boolean`
- default: `false`
- usage: set to `true` to wrap long lines automatically. This will not break overflowing words by default, word-breaking can be enabled by adding `word-break: break-all;` to the `css` property.

### `align`
- type: `string`
- default: `''`
- usage: set to `left` or `right` to change text alignment (otherwise `center`)

## Meter

Meter displays incoming numerical values (via osc) as a gauge level

```js
{
    type:'meter',
    // etc
}
```


### `horizontal`
- type: `boolean`
- default: `false`
- usage: set to `true` to display the meter horizontally

### `range`
- see fader's [`range`](sliders/#fader)

### `logScale`
- see fader's [`logScale`](sliders/#fader)

### `gradient`
- type: `array`
- default: `[]`
- usage: when set, the meter's gauge will be filled with a linear color gradient : each item must be a color string. Example: `["blue", "red"]`

### `css`
```css
--color-gauge:color;
--color-knob:color; /* transparent by default */
--color-pips:color;
--gauge-opacity:number;
```

## Image

Image displays an image from a file path/url or from a base64 encoded image string. Sending an empty message resets the widget to its initial `value`.

```js
{
    type:'image',
    // etc
}
```

### `size`
- type: `string`
- default: `cover`
- usage: css [background-size](https://www.w3schools.com/CSSref/css3_pr_background-size.asp)


### `position`
- type: `string`
- default: `cover`
- usage: css [background-position](https://www.w3schools.com/CSSref/pr_background-position.asp)


### `repeat`
- type: `string`
- default: `no-repeat`
- usage: css [background-repeat](https://www.w3schools.com/CSSref/pr_background-repeat.asp)


### `border`
- type: `boolean`
- default: `false`
- usage: set to `true` to disable the image's borders and background-color.

### `cache`
- type: `boolean`
- default: `true`
- usage: set to `false` to disable image caching (forces file reload when updating or editing the widget). When `true`, sending `'reload'` to the widget reloads its image without changing its value.

### `value`
- type: `string`
- default: `''`
- usage : initial image
  - file url or absolute path
  - [base64 encoded image](https://duckduckgo.com/?q=base64+encode+image&ia=web) : `data:image/...`


## Svg

```js
{
    type:'svg',
    // etc
}
```

### `svg`
- type: `string`
- default: `''`
- usage : svg xml definition
  - will be wrapped in a `<svg></svg>` element
  - `<path>` commands support a special percent notation (`%x` and `%y`)


!!! tip ""
    An exemple session called `svg.json` is shipped with the app.


## Frame

Frame loads and diplays an external web page, using its own value as URL. Only local URLs are allowed (starting with `http://127.0.0.1/`, `http://10.x.x.x/`, `http://192.168.x.x/`, etc).

```js
{
    type:'frame',
    // etc
}
```

### `border`
- type: `boolean`
- default: `false`
- usage: set to `true` to disable the frame's borders and background-color.

!!! note ""
    If `label` is set to `false`, all pointer-events will be disabled on the frame as long as the editor is enabled to ensure it can be selected.
