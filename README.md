## Open Stage Control

Open Stage Control is a libre desktop OSC bi-directionnal control surface application. It's built with HTML, JavaScript & CSS on top of [Electron](http://electron.atom.io/) framework.

The project is under active development; hence, current features are subject to change without notice.

### Demo

You can try the app here http://openstagecontrol.herokuapp.com/

Please note that :
- Chrome 47 at least is required
- Since there is only one instance running, all connected guests are synchronized (widgets using the same osc paths update each other's states) : you might experience some unwanted synchronization with other users unless you specify custom parameters for your widgets.
- You might want to download the examples sessions files under *sessions/* and load them from the app to get started.


### Features
- mouse & multi-touch sensitive widgets
- modular & responsive layout
- built-in live editor
- bi-directionnal osc bindings
- headless server mode with any number of clients using chromium
- app state store / recall & import / export
- light & dark themes !

### Run from sources

**Requirements**
- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
  - installed locally via `npm install electron-prebuilt`
  - or installed system-wide via `npm install -g electron-prebuilt`

**Download**
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
  -h, --help     display help
  -s, --sync     synchronized hosts (ip:port pairs)
  -c, --compile  recompile stylesheets (increases startup time), if 'light' is specified, the light theme will be compiled, otherwise, the default dark theme will be compiled.
  -l, --load     session file to load
  -p, --port     osc input port (for synchronization)
  -n, --nogui    disable default gui and makes the app availabe through http on specified port

Exemples :

$ electron /path/to/app/ -s 127.0.0.1:5555 127.0.0.1:6666 -p 7777

This will create an app listening on port 7777 for synchronization messages, and sending its widgets state changes to ports 5555 and 6666.

$ electron /path/to/app/ -n 8080 -l path/to/session.js

This will create a headless app available through http on port 8080. Multiple clients can use the app (with chrome only) simultaneously, their widgets will be synchronized.


```

**Run without electron**

Running the app with the `-n / --nogui` switch can also be done without electron since it works like any node web app :

```
node /path/to/app/ -n 8000
```


### Session file structure

A valid session file is a javascript file that returns, when eval'd, an array of tab objects. It can be written as a standard json file :

```
[
    {
        id:"my_tab_id",     // [string] optional, default to unique 'tab_n'
        label:"My tab",     // [string] default to id
        stretch:false,      // [bool] set to true to stretch widgets width (don't put horizontal strips in it)
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
    top:"auto",             // [string|integer] if set, the widget will have an absolute position (percentages allowed)
    left:"auto",            // [string|integer] if set, the widget will have an absolute position (percentages allowed)
    width:"auto",           // [string|integer] widget's width in px (percentages allowed)
    height:"auto",          // [string|integer] widget's height in px (percentages allowed)
    css:"",                 // [string] css styles, yeah

    precision:2,            // [integer] number of decimals : 0 to send integers
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

-   **Panel** :  *widget/tabs containers*
    ```  
    type:'panel',
    stretch:false,              // [bool] set to true to stretch widgets width (don't put horizontal strips in it)
    widgets: [],                // [array] of widget objects
    tabs: []                    // [array] of tab objects
    ```

-   **fader**
    ```  
    type:'fader',
    horizontal:false,           // [bool]   set to true to display fader horizontally
    range: {"min":0,"max":1},   // [object] defining the breakpoints of the fader
                                //          keys can be percentages or 'min' / 'max'
    unit: false,                // [string] value suffix
    absolute:false              // [bool]   set to true for absolute value on touch/click instead of relative dragging
    ```

-   **knob**
    ```
    type:'knob',
    range: {"min":0,"max":1},   // [object] minimum and maximum values
    unit: false,                // [string] value suffix
    absolute:false,             // [bool]   set to true for absolute value on touch/click instead of relative dragging
    pan:false                   // [bool] true for panning knob
    ```

-   **xy**
    ```  
    type:'xy',
    range:{                     // [object] minimum and maximum values for x and y axis
            x:{"min":0,"max":1},
            y:{"min":0,"max":1}
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
    on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
    off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
    ```

-   **push**
    ```  
    type:'pus',
    on: 1,                      // [string|number|false] value sent when toggle is on (false to prevent sending )
    off:0,                      // [string|number|false] value sent when toggle is off (false to prevent sending )
    ```

-   **switch**
    ```  
    type:'switch',
    values:[]                   // [array] of values (string or number)
    ```

### License & credits

Copyleft © Jean-Emmanuel @ [AMMD](http://ammd.net). This program is released under the GNU/GPL3 license.

It relies on the use of several libraries :
- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
- [node-osc](https://github.com/TheAlphaNerd/node-osc)
- [socket.io]()
- [browserify]()
- [express]()
- [Sass.js](https://github.com/medialize/sass.js/)
- [jQuery](http://jquery.com/)
- [jQuery-UI](http://jqueryui.com/) (draggable, resizable & [resizable snap ext](https://github.com/polomoshnov/jQuery-UI-Resizable-Snap-extension))
- [Font Awesome](http://fontawesome.io/)

Design was heavily inspired by [Atom](https://atom.io/)'s theme 'One Dark'
