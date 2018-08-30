var _plots_base = require('./_plots_base')

module.exports = class Plot extends _plots_base {

    static defaults() {


        return super.defaults({

            _plot:'plot',

            rangeX: {type: 'object', value: {min:0,max:1}, help: 'Defines the min and max values for the x axis'},
            rangeY: {type: 'object', value: {min:0,max:1}, help: 'Defines the min and max values for the y axis'},
            logScaleX: {type: 'boolean', value: false, help: 'Set to `true` to use logarithmic scale for the x axis (log10)'},
            logScaleY: {type: 'boolean', value: false, help: 'Set to `true` to use logarithmic scale for the y axis (log10)'},
            origin: {type: 'number', value: 'auto', help: 'Defines the y axis origin. Set to `false` to disable it.'},
            dots: {type: 'boolean', value: true, help: ''},
            bars: {type: 'boolean', value: false, help: 'Set to `true` to use draw bars instead (disables `logScaleX` and forces `x axis` even spacing)'},
            smooth: {type: 'boolean|number', value: false, help: 'Set to `true` to make the line smooth. Float values are also acceptable (works fine between `0` and `0.5`)'},
            pips:{type: 'boolean', value: true, help: 'Set to `false` to hide the scale'},

        }, ['target', 'precision', 'bypass'], {

            value: {type: 'array|string', help: [
                '- `Array` of `y` values',
                '- `Array` of `[x, y]` `array` values',
                '- `String` `array`',
                '- `String` `object` to update specific coordinates only: `{0:1, 4:0}` will change the 1st and 5th points\' coordinates',
            ]}

        })

    }

    constructor(options) {

        // backward compat
        if (options.props.points && options.props.points.length) {
            options.props.value = options.props.points
            delete options.props.points
        }

        super(options)

    }

}
