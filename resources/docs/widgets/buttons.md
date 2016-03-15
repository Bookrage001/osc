# Buttons

Buttons are exactly what you think they are.

## toggle
```js
type:'toggle',
on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
```

## push
```js
type:'push',
on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
```

## switch
```js
type:'switch',
values: {                   // [object] of ("label":value) pairs
    "Value 1":1,
    "Value 2":2
}
```
