var {mapToScale} = require('../utils'),
    _plots_base = require('./_plots_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Plot extends _plots_base {

    static defaults() {

        return {
            type:'plot',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

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
            value: '',

            _osc:'osc',

            address:'auto',
            preArgs:[],

        }

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
