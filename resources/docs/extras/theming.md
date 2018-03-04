# Theming

Theming is as simple as writing a tiny css file that will override the default style variables defined in [default.scss](https://github.com/jean-emmanuel/open-stage-control/blob/master/src/browser/scss/themes/default.scss) :

```css
:root {
	--color-accent:red;
}
```

This will change the default accent color to red. Variables can also be overridden for a specific subset of elements, for example :

```css
.panel-container {
	--color-text:blue;
}
```

This will change the default text color to blue for all elements in panel widgets.
