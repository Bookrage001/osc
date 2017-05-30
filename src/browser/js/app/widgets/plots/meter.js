var Fader = require('../sliders/fader'),
    {widgetManager} = require('../../managers')


module.exports = class Meter extends Fader {

    static defaults() {

        return {
            type:'fader',
            id:'auto',

            _style:'style',

            label:'auto',
            unit:'',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            horizontal:false,
            color:'auto',
            css:'',


            _plot:'plot',

            widgetId:'',

            _osc:'osc',

            range:{min:0,max:1},
            logScale:false,
            origin:'auto',
            value:'',
            address:'auto',
            preArgs:[]
        }

    }

    constructor(props) {

        props.compact = true

        super(...arguments)

        this.input.hide()

        this.widget.addClass('meter')
                   .off('mousewheel')

        this.canvas.off('draginit drag')

        if (this.getProp('widgetId').length) $('body').on(`sync.${this.hash}`,this.syncHandle.bind(this))


    }

    onRemove() {

        $('body').off(`sync.${this.hash}`)

    }

    syncHandle(e) {

        if (this.getProp('widgetId')!=e.id || !widgetManager.getWidgetById(e.id).length) return
        var widget = widgetManager.getWidgetById(e.id),
            value
        for (var i=widget.length-1; i>=0; i--) {
            if (widget[i].getValue) {
                this.setValue(widget[i].getValue())
                return
            }
        }

    }

    sendValue() {
        // disabled
    }

}
