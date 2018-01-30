# Switchers

Switcher can store and recall the state of other widgets.



## Switcher

The switcher looks like the [`switch`](buttons/#switch). Each of its possible values represent a bank that stores the values from the widgets listed in its `linkedWidgets` attribute.  


```js
{
    type:'switcher',
    // etc
}
```

### `linkedWidgets`
- type: `array|string`
- default:
    `empty`
- usage:
    - as a `string`: a widget's `id` whose state changes will be stored
    - as an `array`: a list of widget `id` `strings`


### `values`
- type: `array|object`
- default: `["A", "B"]`
- usage:
    - `array` of possible values to switch between : `[1,2,3]`
    - `object` of `"label":value` pairs


## Crossfader

The crossfader is a 2-states-only switcher that comes with a slider allowing to fade from one state to the other by interpolating the values.  
