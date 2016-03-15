# Sliders

Sliders are unidimensional widgets that output one value at a time.

## fader
```js
type:'fader',
horizontal:false,           // [bool]   set to true to display fader horizontally
range: {"min":0,"max":1},   // [object] defining the breakpoints of the fader
                            //          keys can be percentages or 'min' / 'max'
logScale: false,            // [bool] use logarithmic scale (log10)
unit: false,                // [string] value suffix
absolute:false              // [bool]   set to true for absolute value on touch/click instead of relative dragging
```

## knob
```js
type:'knob',
range: {"min":0,"max":1},   // [object] minimum and maximum values
logScale: false,            // [bool] use logarithmic scale (log10)
unit: false,                // [string] value suffix
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
pan:false                   // [bool] true for panning knob
```
