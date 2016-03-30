## Session file

A valid session file is a javascript file that returns, when eval'd, an array of tab objects. It can be written as a javascript object :

```js
[
    {
        label:"A tab containing widgets",
        widgets: [
            {
                // widget properties
            },
            {
                // etc
            }
        ]
    },
    {
        label:"A tab containing tabs",
        tabs: [
            {
                // tab properties
            },
            {
                // etc
            }
        ]
    },
    {
        // tab properties
    }
]
```

It can also be a self invoking function that returns an array of tab objects :

```js
(function(){
    var tabs = []
    for (for i in [0,1,2,3]) {
        tabs.push({
            id:'tab'+i,
            widgets: [
                {
                    id:'tab'+i+'fader',
                    type:'fader'
                }
                // etc
            ]
        })
    }
    return tabs
}()

```

----

## Tab object


### `label`
- type: `string`
- default: `Unnamed`

### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a `widget` object. A tab cannot contain widgets and tabs simultaneously.

### `tabs`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a `tab` object. A tab cannot contain widgets and tabs simultaneously.
