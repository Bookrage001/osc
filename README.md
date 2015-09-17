## Open Stage Control

### Session file structure

A valid session file is just a javascript file that defines the global variable `TABS` as an array of tab objects :

```
TABS = [
    {
        id:"my_tab_id",     // [string] optional, default unique tab id
        label:"My tab",     // [string] default to id
        stack:false,        // [bool] set to true to stack widgets vertically
        widgets: [],        // [array] of widget objects
        tabs: []            // [array] of tab objects
                            // A tab cannot contain widgets and tabs simultaneously
    },
    {
        etc...
    }
]
```

### Widgets
```
{
    id:"my_widget_id",      // [string] widgets with same id will be synchronized
    label:"My widget",      // [string] default to id
    widget_option:value     // each widget type has specific options
}
```

#### Strip
```  
horizontal:false,     // [bool]  set to true to display widgets horizontally
widgets: []           // [array] of widget objects
```

#### Fader
```  
horizontal:false,     // [bool]   set to true to display fader horizontally
range: {min:0,max:1}, // [object] defining the breakpoints of the fader
                      //          keys can be percentages or 'min' / 'max'
unit: false,          // [string] value suffix
```
#### Knob
```  
range: {min:0,max:1}, // [object] minimum and maximum values
unit: false,          // [string] value suffix
```
#### Toggle
```  
on: 1,
off:0
```
#### Switch
```  
values:[]             // [array] of values (string or number)
```
#### XY pad
```  
range:{               // [object] minimum and maximum values for x and y axis
        x:{min:0,max:1},
        y:{min:0,max:1}
    }
```
#### RGB pad
```
no option
```
