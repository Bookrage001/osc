# Property maths

The following syntax allow writing mathematical formulas in widgets' properties:

```
#{ FORMULA }
```

Where FORMULA is a valid [MathJS](http://mathjs.org/docs/expressions/syntax.html) expression:

- [syntax documentation](http://mathjs.org/docs/expressions/syntax.html)
- [available functions](http://mathjs.org/docs/reference/functions.html)
- [available constants](http://mathjs.org/docs/reference/constants.html)
- formulas can be [multiline](http://mathjs.org/docs/expressions/syntax.html#multiline-expressions)
- property inheritance calls (`@{...}`) are always resolved before formulas
- arrays / matrices indexes are **zero-based** (ie `["a","b"][0]` returns `"a"`)
- strings can be multiline when enclosed in backticks (``` ` `  ```)
- inner closing brackets (`}`) must be escaped with a backslash (`\}`)

Additionnal functions:

- `unpack(x)`: remove an array's brackets (`unpack([1,2])` returns `"1, 2"`)
- `pad(x, padding)`: add leading zeros if the length the integer part of `x` is smaller than `padding` (`pad(1,2)` returns `"01"`)
- `length(x)`: returns the length of an array or string
- `values(x)`: returns an array of a given object's own property values
- `keys(x)`: returns an array of a given object's own property names
- `timestamp()`: returns the number of milliseconds elapsed since January 1, 1970

!!! tip ""
    A single widget property can contain multiple formulas. Variables and functions declared in a formula are available to subsequent formulas in the same property definition.
