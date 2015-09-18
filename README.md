## Open Stage control Surface

### Session file structure

A valid session file is a javascript file that returns, when eval'd, an array of tab objects. It can be written as a standard json file (except for double quotes around names which are not required) :

```
[
    {
        id:"my_tab_id",     // [string] optional, default to unique 'tab_n'
        label:"My tab",     // [string] default to id
        stack:false,        // [bool] set to true to stack widgets vertically
        widgets: [],        // [array] of widget objects
        tabs: []            // [array] of tab objects
                            // A tab cannot contain widgets and tabs simultaneously
    },
    {
        // etc
    }
]
```

It can also be a self invoking function that returns an array of objects :

```
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
}()

```


### Widgets
```
{
    id:"my_widget_id",      // [string] widgets with same id will be synchronized
    label:"My widget",      // [string] default to id
    target:false,           // [string] List of target hosts (ip:port pairs), separated by spaces
    path:false,             // [string] osc path, default to '/widget_id'
    widget_option:value     // each widget type has specific options
}
```

#### Strip
```  
horizontal:false,           // [bool]  set to true to display widgets horizontally
widgets: []                 // [array] of widget objects
```

#### Fader
```  
horizontal:false,           // [bool]   set to true to display fader horizontally
range: {min:0,max:1},       // [object] defining the breakpoints of the fader
                            //          keys can be percentages or 'min' / 'max'
unit: false,                // [string] value suffix
```

#### Knob
```  
range: {min:0,max:1},       // [object] minimum and maximum values
unit: false,                // [string] value suffix
```

#### XY pad
```  
range:{                     // [object] minimum and maximum values for x and y axis
        x:{min:0,max:1},
        y:{min:0,max:1}
    }
```

#### RGB pad
```
no option
```

#### Toggle
```  
on: 1,                      // [string|number] value sent when toggle is on
off:0                       // [string|number] value sent when toggle is off
```

#### Switch
```  
values:[]                   // [array] of values (string or number)
```
