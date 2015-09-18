## Open Stage Control

Open Stage Control (*temporary name*) is a libre desktop OSC bi-directionnal control surface application. It's built with HTML, JavaScript & CSS on top of [Electron](http://electron.atom.io/) framework.

It's under active development; hence, current features are subject to change without notice.

### Run from sources

**Requirements:**
- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
  - installed locally via `npm install electron-prebuilt`
  - or installed system-wide via `npm install -g electron-prebuilt`

**How to run:**
 ```
$ git clone https://github.com/jean-emmanuel/Open-Stage-Control
$ cd Open-Stage-Control/app
$ npm install
$ /path/to/electron ./ [options]
 ```

**Command line switches:**
- `-l` : open last session at startup
- `-c` : recompile scss stylesheets at startup

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


### Widget generics
```
{
    id:"my_widget_id",      // [string] optional, default to unique 'widget_n'
    label:"My widget",      // [string] default to id
    target:false,           // [string] List of target hosts (ip:port pairs), separated by spaces
    path:false              // [string] osc path, default to '/widget_id'
}
```

### Widget specifics

-   **strip**
    ```  
    type:'strip',
    horizontal:false,           // [bool]  set to true to display widgets horizontally
    widgets: []                 // [array] of widget objects
    ```

-   **fader**
    ```  
    type:'fader',
    horizontal:false,           // [bool]   set to true to display fader horizontally
    range: {min:0,max:1},       // [object] defining the breakpoints of the fader
                                //          keys can be percentages or 'min' / 'max'
    unit: false,                // [string] value suffix
    ```

-   **knob**
    ```
    type:'knob',
    range: {min:0,max:1},       // [object] minimum and maximum values
    unit: false,                // [string] value suffix
    ```

-   **xy**
    ```  
    type:'xy',
    range:{                     // [object] minimum and maximum values for x and y axis
            x:{min:0,max:1},
            y:{min:0,max:1}
        }
    ```

-   **rgb**
    ```
    type:'rgb'
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

Copyleft © Jean-Emmanuel @ AMMD
This program is released under the GNU/GPLv3 license.

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
