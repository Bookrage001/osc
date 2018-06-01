var Fader = require('../sliders/fader')

module.exports = class Meter extends Fader {

    static defaults() {

        return {
            type:'fader',
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


            _meter:'meter',

            range:{min:0,max:1},
            logScale:false,
            origin:'auto',
            unit:'',
            alignRight:false,
            horizontal:false,
            pips:false,
            dashed:false,
            gradient:[],

            _value: 'value',
            default: '',
            value: '',

            _osc:'osc',

            address:'auto',
            preArgs:[]
        }

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
