# Matrices

Matrices are special containers that only contain one type of widget. All contained widgets will be traversed by single dragging gestures.

## multifader
```js
type:'multifader',
strips:2,                   // [integer] number of faders
range: {"min":0,"max":1},   // [object] defining the breakpoints of the fader
                            //          keys can be percentages or 'min' / 'max'
logScale: false,            // [bool] use logarithmic scale (log10)
unit: false,                // [string] value suffix
absolute:false              // [bool]   set to true for absolute value on touch/click instead of relative dragging
```
*This creates a row of vertical faders that respond to the same gesture. Each of these faders will receive its parent's properties and the following (where X is the fader's index in the row) :*
```js
id:PARENT_ID_X,
label: X,
path: PARENT_PATH/X
```


## multitoggle
```js
type:'multitoggle',
matrix:[2,2],               // [array] [number of columns, number of rows]
on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
```
*This creates a matrix of toggles that respond to the same gesture. Each of these toggles will receive its parent's properties and the following (where X is the toggle's index in the row) :*
```js
id:PARENT_ID_X,
label: X,
path: PARENT_PATH/X
```


## multipush
```js
type:'multipush',
matrix:[2,2],               // [array] [number of columns, number of rows]
on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
```
*This creates a matrix of push buttons that respond to the same gesture. Each of these buttons will receive its parent's properties and the following (where X is the button's index in the row) :*
```js
id:PARENT_ID_X,
label: X,
path: PARENT_PATH/X
```
