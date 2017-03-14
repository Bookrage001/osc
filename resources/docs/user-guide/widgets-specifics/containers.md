# Containers

Containers can contain any widgets

----

## Strip

Strips can contain any number of widgets, which can't be absolutely positioned and whose size can't overflow their parent's.

```js
{
    type:'strip',
    // etc
}
```

#### `horizontal`
- type: `boolean`
- default: `false`
- usage: set to `true` to display widgets horizontally

#### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a widget `object`

----

## Panel

Panels can contains tabs or widgets. These can be absolutely positioned and can overflow their parent's size (which will then display scrollbars).


```js
{
    type:'panel',
    // etc
}
```

#### `scroll`
- type: `boolean`
- default: `true`
- usage: set to `false` to disable scrollbars

#### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a widget `object`. A panel cannot contain widgets and tabs simultaneously.

#### `tabs`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a tab `object`. A panel cannot contain widgets and tabs simultaneously.


#### `layout`
- type: `string`
- default: `''`
- usage: `layout` must be a valid [Visual Format Language](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/VisualFormatLanguage.html) expression. It accepts the [Extended Visual Format Language](https://github.com/IjzerenHein/autolayout.js#extended-visual-format-language-evfl) as well. Widgets are targeted using their `id` or their index prefixed with a `$` (`$0, $1, etc`), the latter method being incompatible with the [range spread operator](https://github.com/IjzerenHein/autolayout.js#view-ranges-spread-operator). Expressions can be tested and debugged with the online [Visual Format Editor](https://rawgit.com/IjzerenHein/visualformat-editor/master/dist/index.html).

#### `spacing`
- type: `integer|array`
- default: `0`
- usage: spacing size used in `layout` expression, can be set as a `[vertical,horizontal]` array.

----

## Modal

Modals are buttons that turn into a fullscreen panels when enabled. They can be enabled via osc (1 to enable, 0 to disable).

```js
{
    type:'modal',
    // etc
}
```

#### `options`
- see panel's [`options`](#panel)
