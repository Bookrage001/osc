# Property maths

The following syntax allow writing mathematical formulas in widgets' properties:

```
#{ FORMULA }
```

Where FORMULA is a valid [MathJS](http://mathjs.org/docs/expressions/syntax.html) expression:

- [syntax documentation](http://mathjs.org/docs/expressions/syntax.html)
- [available functions](http://mathjs.org/docs/reference/functions.html)
- [available constants](http://mathjs.org/docs/reference/constants.html)
- property inheritance calls (`@{...}`) are always resolved before formulas
- arrays / matrices indexes are **zero-based** (ie `['a','b'][0]` returns `'a'`)
- strings can be multiline when enclosed in backticks instead of double quotes (``` ` `  ```)
- inner closing brackets (`}`) must be escaped with a backslash (`\}`)

Additionnal functions:

- `unpack`: remove an array's brackets (`unpack([1,2])` returns `'1, 2'`)
