## Session file reference

A valid session file is a javascript file that returns, when eval'd, an array of tab objects. It can be written as a javascript object :

```js
[
    {
        id:"my_tab_id",     // [string] optional, default to unique 'tab_n'
        label:"My tab",     // [string] default to id
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
