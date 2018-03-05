# Theming

## Built-in themes

Themes can be loaded with the `--theme` option. Multiple themes can be combined. Built-in themes can be loaded using their name, custom theme files can be loaded using their path.

Available themes (full color scheme):

- `orange`: grey and orange theme
- `light`: light and blue
- `dark`: blue night theme

Available extensions (alternative visual settings)

- `alt-buttons`: colorful active buttons
- `responsive-fonts`: bigger texts for bigger screens

## Creating a custom theme

Creating a custom theme is as simple as writing a tiny css file that will override the default css variables defined in [default.scss](https://github.com/jean-emmanuel/open-stage-control/blob/master/src/browser/scss/themes/default.scss) :

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
