# Property inheritance

Widgets can use each other's property values by using the following syntaxes:

- `@{this.propertyName}`
- `@{parent.propertyName}`
- `@{widgetId.propertyName}` (where `widgetId` is the target widget's `id`)

`propertyName` can be any of the target widget's properties. Additionally, the special property name `_value` refers to a widget's value, as opposed to its `value` property.

It can be used to:

- concatenate strings: `/@{parent.id}/some_suffix`
- define object value:   `["@{parent.id}"]`

If the retreived property is an object (`[] / {}`), a subset can be defined by appending a dot and a key (array index or object key) : `@{parent.variables.key}`

!!! note ""
    The root panel's `id` is `root`.


!!! warning "What about reverse inheritance ?"
    Containers cannot inherit their children's properties but to define their `value` property.
