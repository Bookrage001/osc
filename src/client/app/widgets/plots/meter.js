var Fader = require('../sliders/fader'),
    Widget = require('../common/widget')

module.exports = class Meter extends Fader {

    static defaults() {

        return Widget.defaults({

            _meter:'meter',

            range: {type: 'object', value: {min:0,max:1}, help: 'See fader\'s `range`'},
            logScale: {type: 'boolean', value: false, help: 'See fader\'s `logScale`'},
            origin: {type: 'number', value: 'auto', help: 'See fader\'s `origin`'},
            unit: {type: 'string', value: 'auto', help: 'See fader\'s `unit`'},
            alignRight: {type: 'boolean', value: false, help: 'See fader\'s `alignRight`'},
            horizontal: {type: 'boolean', value: false, help: 'See fader\'s `horizontal`'},
            pips: {type: 'boolean', value: false, help: 'See fader\'s `pips`'},
            dashed: {type: 'boolean', value: false, help: 'See fader\'s `dashed`'},
            gradient: {type: 'array|object', value: [], help: [
                'When set, the meter\'s gauge will be filled with a linear color gradient',
                '- each item must be a CSS color string.',
                '- as an `object`: each key must be a number between 0 and 1',
                '- each item must be a CSS color string.',
                'Examples: `[\'blue\', \'red\']`, {\'0\': \'blue\', \'0.9\': \'blue\', \'1\': \'red\'} '
            ]},

        }, ['target', 'precision', 'bypass'], {

            css: {type: 'string', value: '', help: [
                'Available CSS variables:',
                '- `--color-gauge: color;`',
                '- `--color-knob: color;`',
                '- `--color-pips: color;`',
                '- `--gauge-opacity: number;`'
            ]},

        })

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }
        options.props.compact = true
        options.props.input = false

        super(options)

        this.widget.classList.add('meter')

        this.off(/drag(.*)?/)

    }

    sendValue() {
        // disabled
    }

}
