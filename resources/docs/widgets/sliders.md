# Sliders

Sliders are unidimensional widgets that output one value at a time.

## fader
```js
type:'fader',
horizontal:false,           // [bool]   set to true to display fader horizontally
align:'center',             // [left|right] only display one scale and one meter
range: {"min":0,"max":1},   // [object] defining the breakpoints of the fader
                            //          keys can be percentages or 'min' / 'max'
                            //          custom label can be set by writing the value as an object:
                            //          range: {
                            //              min:{'-inf':0}
                            //              max:1
                            //          }
logScale: false,            // [bool] use logarithmic scale (log10)
unit: false,                // [string] value suffix
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
meter:false,                // [bool] set to true to display a vumeter which will display values send to '/widgets_path/meter'     
```

**theming vars**
```
--color-gauge:CSS_COLOR;
--color-knob:CSS_COLOR;
--color-pips:CSS_COLOR;
```


## knob
```js
type:'knob',
range: {"min":0,"max":1},   // [object] minimum and maximum values
logScale: false,            // [bool] use logarithmic scale (log10)
unit: false,                // [string] value suffix
absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
```


**theming vars**
```
--color-gauge:CSS_COLOR;
--color-knob:CSS_COLOR;
--color-pips:CSS_COLOR;
```
