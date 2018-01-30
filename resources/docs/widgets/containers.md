# Containers

Containers can contain any widgets.


## Panel

Panels can contains tabs or widgets. These can be absolutely positioned and can overflow their parent's size (which will then display scrollbars). When a panel contains tabs, it can send and receive its active tab's index through osc.


```js
{
    type:'panel',
    // etc
}
```

### `scroll`
- type: `boolean`
- default: `true`
- usage: set to `false` to disable scrollbars

### `border`
- type: `boolean`
- default: `true`
- usage: by default, widgets in panels/strip have their border disabled, except for panels and strips. Set to `false` to apply this rule to the panel too.

### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a widget `object`. A panel cannot contain widgets and tabs simultaneously.

### `tabs`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a tab `object`. A panel cannot contain widgets and tabs simultaneously.


### `variables`
- type: `*`
- default: `@{parent.variables}`
- usage: defines one or more arbitrary variables that can be inherited by children widgets.
- examples:
  - `1` (`@{parent.variables}` will return `1`)
  - `{a: [1, 2], b: 2}` (`@{parent.variables.a}` will return `[1, 2]`)
  - `[1, 2]` (`@{parent.variables.0}` will return `1`)
  - `@{parent.variables}` useful when nesting containers


### `layout`
- type: `string`
- default: `''`
- usage: `layout` must be a valid [Visual Format Language](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/VisualFormatLanguage.html) expression. It accepts the [Extended Visual Format Language](https://github.com/IjzerenHein/autolayout.js#extended-visual-format-language-evfl) as well. Widgets are targeted using their `id` or their index prefixed with a `$` (`$0, $1, etc`), the latter method being incompatible with the [range spread operator](https://github.com/IjzerenHein/autolayout.js#view-ranges-spread-operator). Expressions can be tested and debugged with the online [Visual Format Editor](https://rawgit.com/IjzerenHein/visualformat-editor/master/dist/index.html).
- note: this only applies when the panel contains widgets, not tabs

### `spacing`
- type: `integer|array`
- default: `0`
- usage: spacing size used in `layout` expression, can be set as a `[vertical,horizontal]` array.
- note: this only applies when the panel contains widgets, not tabs

### `noSync`
- type: `boolean`
- default: `false`
- usage: set to `true` to prevent tab changes from synchronizing between clients that share the same session file

## Strip

Unidirectionnal panel with stretching capability. By default, children widgets that don't have an explicit `width`/`height` set will be shrinked to respect the sizes specified by others. Adding `flex:1;` to a children's `css` will give it the ability the fill the remaining space. Multiple children can have a `flex:x;` css property (`x` will ponderate their expansion).

```js
{
  type:'strip',
  // etc
}
```

### `horizontal`
- type: `boolean`
- default: `false`
- usage: set to `true` to display widgets horizontally

### `stretch`
- type: `boolean`
- default: `false`
- usage: set to `true` to stretch widgets evenly

### `spacing`
- type: `integer`
- default: `0`
- usage: adds space between widgets

### `border`
- type: `boolean`
- default: `true`
- usage: by default, widgets in panels/strip have their border disabled, except for panels and strips. Set to `false` to apply this rule to the strip too.

### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a widget `object`




## Modal

Modals are buttons that turn into a centered popup panels when enabled. They can only contain widgets. They can send and receive their state via osc (1 to enable, 0 to disable).

```js
{
    type:'modal',
    // etc
}
```

### `doubleTap`
- type: `boolean`
- default: `false`
- usage: set to `true` to make the modal require a double tap to open instead of a single tap

### `popupWidth` / `popupHeight`
- type: `number|percentage`
- default: `100%`
- usage: sets the modal's size once opened

### `popupLabel`
- type: `string`
- default: `empty`
- usage: alternative label for the popup

### `noSync`
- type: `boolean`
- default: `false`
- usage: set to `true` to prevent modal's state changes from synchronizing between clients that share the same session file

### `options`
- see panel's [`options`](#panel)


## Clone

```js
{
    type:'clone',
    // etc
}
```

### `widgetId`
- type: `string`
- default: `empty`
- usage: `id` of the widget to clone

### `props`
- type: `object`
- default: `{}`
- usage: cloned widget's properties to override
- example:
```json
{
    "variables": { "n": 2 },
    "color": "orange"    
}
```
