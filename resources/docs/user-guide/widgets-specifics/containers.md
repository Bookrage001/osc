# Containers

Containers can contain any widgets

## strip :

Strips can contain any number of widgets, which can't be absolutely positioned and whose size can't overflow their parent's.

```js
type:'strip',
horizontal:false,           // [bool]  set to true to display widgets horizontally
widgets: []                 // [array] of widget objects
```

## panel :

Panels can contains tabs or widgets. These can be absolutely positioned and can overflow their parent's size (which will then display scrollbars).

```js
type:'panel',
scroll:true,				// [bool] set to false to disable scrollbars
widgets: [],                // [array] of widget objects
tabs: []                    // [array] of tab objects
```
