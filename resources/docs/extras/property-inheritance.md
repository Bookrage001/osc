# Property inheritance

Widgets can use each other's property values by using the following syntaxes:

- `@{this.propertyName}`
- `@{parent.propertyName}`
- `@{widgetId.propertyName}` (where `widgetId` is the target widget's `id`)

It can be used to:

- concatenate strings: `/@{parent.id}/some_suffix`
- define object value:   `["@{parent.id}"]`

If the retreived property is an object (`[] / {}`), it can be used as is or one can retreive a specfic item from it: `@{parent.variables.0}` will try to return the first item of the parent's `variables` property.

!!! note ""
    The root panel's `id` is `root`.
