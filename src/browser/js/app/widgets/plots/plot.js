var _plots_base = require('./_plots_base')

module.exports = class Plot extends _plots_base {

    static defaults() {


        return super.defaults({

            _plot:'plot',

            rangeX: {min:0,max:1},
            rangeY: {min:0,max:1},
            origin: 'auto',
            dots: true,
            bars: false,
            logScaleX: false,
            logScaleY: false,
            smooth: false,
            pips:true,

        }, ['target', 'precision', 'bypass'], {})

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
