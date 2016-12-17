var Fader = require('../sliders/fader')

module.exports = class Meter extends Fader {

    static options() {

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

            _osc:'osc',

            range:{min:0,max:1},
            logScale:false,
            origin:'auto',
            value:'',
            address:'auto',
            preArgs:[]
        }

    }

    constructor(widgetData) {

        widgetData.compact = true

        super(...arguments)

        this.input.hide()

        this.widget.addClass('meter')
                   .off('mousewheel')

        this.canvas.off('draginit drag')

    }

    sendValue() {
        // disabled
    }

}
