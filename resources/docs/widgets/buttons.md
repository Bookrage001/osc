# Buttons

Buttons are exactly what you think they are.

## toggle
```js
type:'toggle',
on: 1,                      // [string|number|false|null] value sent when toggle is on (false to prevent sending, null to send no arg)
off:0,                      // [string|number|false|null] value sent when toggle is off (false to prevent sending, null to send no arg)
```

## push
```js
type:'push',
on: 1,                      // [string|number|false|null] value sent when toggle is on (false to prevent sending, null to send no arg)
off:0,                      // [string|number|false|null] value sent when toggle is off (false to prevent sending, null to send no arg)
```

## switch
```js
type:'switch',
values: {                   // [object] of ("label":value) pairs
    "Value 1":1,
    "Value 2":2
}
```
