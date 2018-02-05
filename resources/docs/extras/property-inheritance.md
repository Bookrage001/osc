# Property inheritance

Widgets can use each other's property values by using the following syntaxes:

- `@{this.propertyName}`
- `@{parent.propertyName}`
- `@{widgetId.propertyName}` (where `widgetId` is the target widget's `id`)

`propertyName` can be any of the target widget's properties.

It can be used to:

- concatenate strings: `/@{parent.id}/some_suffix`
- define object value:   `["@{parent.id}"]`

If the retreived property is an object (`[] / {}`), a subset can be defined by appending a dot and a key (array index or object key) : `@{parent.variables.key}`

!!! note ""
    The root panel's `id` is `root`.

## Use dynamic value

The special property name `_value`<i class="md-icon">flash_on</i> refers to a widget's value, as opposed to its `value` property.

## Dynamic properties

Some properties, when changed, trigger a complete widget recreation that ends any ongoing user interaction. Also, updating these properties continuously (e.g. when linked to a slider's dynamic value) can be very cpu expensive.

Some properties have much cheaper update routines and can be considered as `dynamic`, as in performance safe. These properties are marked in the documentation with a ` `<i class="md-icon">flash_on</i>.


## Circular references cases

- container widgets can inherit their children's properties only to define `dynamic` properties
- widgets can inherit their own `_value`<i class="md-icon">flash_on</i> property only to define `dynamic` properties
