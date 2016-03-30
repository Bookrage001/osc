## Containers

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
- usage: each element of the `array` must be a widget object

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
- usage: each element of the `array` must be a widget object.A panel cannot contain widgets and tabs simultaneously.

#### `tabs`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a tab object. A panel cannot contain widgets and tabs simultaneously.
