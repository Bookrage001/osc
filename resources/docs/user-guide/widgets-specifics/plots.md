# Plots

Plots are tools that display other widgets' state or incomming osc messages. They are not sensitive to mouse and touch interactions.

## led
```js
type:'led',
range:x:{"min":0,"max":1}   // [object] minimum and maximum values for X and Y axis        
logScale: false,           // [bool] use logarithmic scale
```


## plot

The plot receives an array of [x,y] coordinates and draws them on a chart with linear or logarithmic interpolation.

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

The visualizer displays the evolution in time of a received value (through osc) *or* another widget's value.

```js
type:'visualizer',
widgetId:'',                // [string] widget id (its value will be displayed instead of the incoming osc)
duration:1,                 // [number] window size in seconds
range:{"min":0,"max":1},    // [object] minimum and maximum values the Y axis
logScale: false,            // [bool] use logarithmic scale for Y axis (log10)
```

## text
```js
type:'text',
vertical:false,             // [bool]
```
