# Session file

A valid session file is a javascript file that returns an array of [tab objects](#tab-object). It can be written as a javascript `array` :

```js
[// array
    {// tab object
        label:"A tab containing widgets",
        widgets: [// array
            {// widget object
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
            {// tab object
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

It can also be a javascript self invoking function that returns an array of [tab objects](#tab-object) :

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

A tab object is a javascript object which properties are described below.

```js
{
    // tab properties
}
```

#### `label`
- type: `string`
- default: `Unnamed`

#### `id`
- type: `string`
- default: `empty`
- usage: this is only useful for [remote controlling](remote-control.md) the tabs states.

#### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a `widget` object. A tab cannot contain widgets and tabs simultaneously.

#### `tabs`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a `tab` object. A tab cannot contain widgets and tabs simultaneously.
