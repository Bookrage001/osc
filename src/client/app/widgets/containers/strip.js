var Panel = require('./panel'),
    Widget = require('../common/widget')

module.exports = class Strip extends Panel {

    static defaults() {

        return Widget.defaults({

            _strip: 'strip',

            scroll: {type: 'boolean', value: true, help: 'Set to `false` to disable scrollbars'},
            horizontal: {type: 'boolean', value: false, help: 'Set to `true` to display widgets horizontally'},
            stretch: {type: 'boolean', value: false, help: 'Set to `true` to stretch widgets evenly'},
            border: {type: 'boolean', value: true, help: 'By default, widgets in panels/strip have their border disabled, except for panels and strips. Set to `false` to apply this rule to the panel too'},
            spacing: {type: 'integer|percentage', value: 0, help: 'Adds space between widgets. Percents are always relative to the strips width'}

        }, [], {

            _children:'children',

            variables: {type: '*', value: '@{parent.variables}', help: 'Defines one or more arbitrary variables that can be inherited by children widgets'},
            widgets: {type: 'array', value: [], help: [
                'Each element of the array must be a widget object',
                '- By default, children widgets that don\'t have an explicit `width`/`height` set will be shrinked to respect the sizes specified by others',
                '- Adding `flex:1;` to a children\'s `css` will give it the ability the fill the remaining space',
                '- Multiple children can have a `flex:x;` css property (`x` will ponderate their expansion)'
            ]}

        })

    }

    constructor(options) {

        var defaults = Panel.defaults()._props()
        for (var k in defaults) {
            if (!options.props.hasOwnProperty(k))
                options.props[k] = defaults[k]
        }

        super(options)

        this.disabledProps = []

        if (this.getProp('spacing')) {
            var spacing = this.getProp('spacing')
            if (!isNaN(spacing)) spacing += 'rem'
            this.widget.style.setProperty('--spacing', spacing)
        }

        this.container.classList.add(this.getProp('horizontal') ? 'horizontal' : 'vertical')
        if (this.getProp('stretch')) this.container.classList.add('stretch')

    }

    setValue(){}
    getValue(){}

}
