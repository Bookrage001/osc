## Open Stage Control

Open Stage Control (*temporary name*) is a libre desktop OSC bi-directionnal control surface application. It's built with HTML, JavaScript & CSS on top of [Electron](http://electron.atom.io/) framework.

It's under active development; hence, current features are subject to change without notice.

<img src="https://cloud.githubusercontent.com/assets/5261671/10710767/1a37ac4c-7a68-11e5-9435-0f5499771125.png" width="49%" style="display:inline-block;margin-right:1%"/>
<img src="https://cloud.githubusercontent.com/assets/5261671/10710766/1a366846-7a68-11e5-9afd-2b700ff1ebbb.png" width="49%" style="display:inline-block"/>

### Run from sources

**Requirements**
- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
  - installed locally via `npm install electron-prebuilt`
  - or installed system-wide via `npm install -g electron-prebuilt`

**Build** *(Download the app and fetch its dependencies)*
 ```
$ git clone https://github.com/jean-emmanuel/Open-Stage-Control
$ cd Open-Stage-Control/app
$ npm install
 ```

 **Run**
  ```
 $ /path/to/electron /path/to/Open-Stage-Control/app [options]
  ```

**Command line switches**
```
Options:
  --help         display help
  -h, --host     synchronized hosts (ip:port pairs)
  -c, --compile  recompile stylesheets (increases startup time)
  -l, --load     session file to load
  -p, --port     osc input port (for synchronization)

Exemples :

$ electron /path/to/app/ -h 127.0.0.1:5555 127.0.0.1:6666 -p 7777

This will create an app listening on port 7777 for synchronization messages, and sending its widgets state changes to ports 5555 and 6666.

```



### Features
- modular, tab-based, responsive layout
- cross-widgets and cross-apps synchronization
  - widgets that share the same id will update each other's values within the app
  - widgets will update according to incoming osc message matching their own osc output pattern
- app state saving & loading


### Session file structure

A valid session file is a javascript file that returns, when eval'd, an array of tab objects. It can be written as a standard json file (except for double quotes around names which are not required) :

```
[
    {
        id:"my_tab_id",     // [string] optional, default to unique 'tab_n'
        label:"My tab",     // [string] default to id
        stretch:false,       // [bool] set to true to stretch widgets width (don't put horizontal strips in it)
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
    return tabs
}()

```


### Widget generics
```
{
    id:"my_widget_id",      // [string] optional, default to unique 'widget_n'
    label:"My widget",      // [string] default to id
    width:false,            // [integer] widget's width in px
    target:false,           // [array/string] List of target hosts ("ip:port" pairs), separated by spaces
    path:false              // [string] osc path, default to '/widget_id'
}
```

### Widget specifics

-   **Strip** : *simple widget container*
    ```  
    type:'strip',
    horizontal:false,           // [bool]  set to true to display widgets horizontally
    widgets: []                 // [array] of widget objects
    ```

-   **Panel** :  *widget containers with arbitrary position and size*
    ```  
    type:'panel',
    x:'auto',                   // [integer] absolute position in px
    y:'auto',                   // [integer] absolute position in px
    height:'auto',              // [integer] absolute position in px
    width:'auto',               // [integer] width in px
    stretch:false,              // [bool] set to true to stretch widgets width (don't put horizontal strips in it)
    widgets: []                 // [array] of widget objects
    ```

-   **fader**
    ```  
    type:'fader',
    horizontal:false,           // [bool]   set to true to display fader horizontally
    range: {min:0,max:1},       // [object] defining the breakpoints of the fader
                                //          keys can be percentages or 'min' / 'max'
    unit: false,                // [string] value suffix
    absolute:false              // [bool]   set to true for absolute value on touch/click instead of relative dragging
    ```

-   **knob**
    ```
    type:'knob',
    range: {min:0,max:1},       // [object] minimum and maximum values
    unit: false,                // [string] value suffix
    absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
    gauge:true                  // [bool]   set to false to replace the gauge with a simple dot
    ```

-   **xy**
    ```  
    type:'xy',
    range:{                     // [object] minimum and maximum values for x and y axis
            x:{min:0,max:1},
            y:{min:0,max:1}
        },
    absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
    split:false                 // [bool|object] sends separate osc messages for x and y axes
                                // if true : '/x' & '/y' will be appended to the widget's path
                                // or object : {x:'/osc_path_x', y:'/osc_path_y'}

    ```

-   **rgb**
    ```
    type:'rgb',
    absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
    split:false                 // [bool|object] sends separate osc messages for x and y axes
                                // if true : '/r', '/g' & '/b' will be appended to the widget's path
                                // or object : {r:'/osc_path_r', g:'/osc_path_g',b:'/osc_path_b'}
    ```
    Variant of xy pad, it outputs rgb values between 0 and 255.


-   **toggle**
    ```  
    type:'toggle',
    on: 1,                      // [string|number] value sent when toggle is on
    off:0,                      // [string|number] value sent when toggle is off
    color:false                 // [string] (css) color of the active state indicator
    ```

-   **switch**
    ```  
    type:'switch',
    values:[]                   // [array] of values (string or number)
    ```

### License & credits

Copyleft © Jean-Emmanuel @ AMMD. This program is released under the GNU/GPL3 license.

It relies on the use of several libraries :
- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
- [node-osc](https://github.com/TheAlphaNerd/node-osc)
- [Sass.js](https://github.com/medialize/sass.js/)
- [jQuery](http://jquery.com/)
  - [jQuery.resize.event](http://benalman.com/projects/jquery-resize-plugin/)
  - [jQuery.event.drag](http://threedubmedia.com)
- [Font Awesome](http://fontawesome.io/)

Design was heavily inspired by [Atom](https://atom.io/)'s theme 'One Dark'
