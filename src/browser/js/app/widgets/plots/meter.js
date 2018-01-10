var Fader = require('../sliders/fader'),
    widgetManager = require('../../managers/widgets')


module.exports = class Meter extends Fader {

    static defaults() {

        return {
            type:'fader',
            id:'auto',

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

            widgetId:'',
            range:{min:0,max:1},
            logScale:false,
            origin:'auto',
            unit:'',
            alignRight:false,
            horizontal:false,
            pips:false,
            dashed:false,
            value:'',

            _osc:'osc',

            address:'auto',
            preArgs:[]
        }

    }

    constructor(options) {

        options.props.compact = true
        options.props.input = false

        super(options)

        this.widget.addClass('meter')
                   .off('mousewheel')

        this.canvas.off('draginit drag')

        if (this.getProp('widgetId').length) widgetManager.on(`change.${this.hash}`,this.syncHandle.bind(this))


    }

    onRemove() {

        widgetManager.off(`change.${this.hash}`)
        super.onRemove()

    }

    syncHandle(e) {

        if (this.getProp('widgetId')!=e.id || !widgetManager.getWidgetById(e.id).length) return
        var widget = widgetManager.getWidgetById(e.id),
            value
        for (var i=widget.length-1; i>=0; i--) {
            if (widget[i].getValue) {
                this.setValue(widget[i].getValue(), {sync: e.options.sync})
                return
            }
        }

    }

    sendValue() {
        // disabled
    }

}
