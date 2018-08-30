var {iconify} = require('../../ui/utils'),
    Widget = require('../common/widget')

module.exports = class Text extends Widget {

    static defaults() {

        return super.defaults({

            _text: 'text',

            vertical: {type: 'boolean', value: false, help: 'Set to `true` to display the text vertically'},
            wrap: {type: 'boolean', value: false, help: [
                'Set to `true` to wrap long lines automatically.',
                'This will not break overflowing words by default, word-breaking can be enabled by adding `word-break: break-all;` to the `css` property',
            ]},
            align: {type: 'string', value: '', help: 'Set to `left` or `right` to change text alignment (otherwise center)'},

        }, ['color', 'target', 'precision', 'bypass'], {})

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }
        super({...options, html: '<div class="text"></div>'})

        if (this.getProp('vertical')) this.widget.classList.add('vertical')
        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')
        if (this.getProp('wrap')) this.widget.classList.add('wrap')

        this.defaultValue = this.getProp('default') || ( this.getProp('label')===false ?
            this.getProp('id'):
            this.getProp('label')=='auto'?
                this.getProp('id'):
                this.getProp('label') )

        this.value = this.defaultValue

        this.setValue(this.value)

    }


    setValue(v, options={}) {

        this.value = v==null ? this.defaultValue : v
        this.widget.innerHTML = iconify(String(this.value).replace(/\n/g,'<br/>'))

        if (options.sync) this.changed(options)

    }

}
