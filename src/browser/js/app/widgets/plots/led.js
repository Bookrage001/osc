var {mapToScale} = require('../utils'),
    _widgets_base = require('../common/_widgets_base')

module.exports = class Led extends _widgets_base {

    static options() {

        return {
            type:'led',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _osc:'osc',

            range:{min:0,max:1},
            logScale:false,
            value:'',
            preArgs:[],
            address:'auto'

        }

    }

    constructor(widgetData) {

        var widgetHtml = `
            <div class="led">
                <div><span></span></div>
            </div>
        `

        super(...arguments, widgetHtml)

        this.led = this.widget.find('span')

        this.setValue(widgetData.range.min)

    }

    setValue(v) {

        if (typeof v != 'number') return
        this.led.css('opacity',mapToScale(v,[this.widgetData.range.min,this.widgetData.range.max],[0,1],false,this.widgetData.logScale,true))

    }

}
