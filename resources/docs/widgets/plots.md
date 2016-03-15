# Plots

Plots are tools that display other widgets' state or incomming osc messages.

## plot
```js
type:'plot',
points:[],                  // [string|array]
                            // string : a single widget id, whose multiple values will be displayed,
                            //          evenly spaced on the x-axis
                            // array : an array of [x,y] coordinates, which can be numbers
                            //         or widget id strings, for example :
                            // [[0,0],[0.5,"some_widget_id"],["some_other_id","another_id"]]
range:{                     // [object] minimum and maximum values for X and Y axis
        x:{"min":0,"max":1},
        y:{"min":0,"max":1}
    },
logScaleX: false,           // [bool] use logarithmic scale for X axis (log10)
logScaleY: false            // [bool] use logarithmic scale for y axis (log10)
```

## visualizer
```js
type:'visualizer',
curve:'',                   // [string] widget id (its value will be displayed)
duration:1,                 // [number] window size in seconds
range:{"min":0,"max":1},    // [object] minimum and maximum values the Y axis
logScale: false,            // [bool] use logarithmic scale for Y axis (log10)
```
