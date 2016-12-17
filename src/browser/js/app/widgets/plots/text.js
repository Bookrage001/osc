var {iconify} = require('../../utils'),
    _widgets_base = require('../common/_widgets_base')

module.exports = class Text extends _widgets_base {

    static options() {

        return {
            type:'text',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            vertical:false,
            color:'auto',
            css:'',

            _osc:'osc',

            value:'',
            preArgs:[],
            address:'auto',
        }

    }

    constructor(widgetData) {

        var widgetHtml = `
            <div class="text ${widgetData.vertical?'vertical':''}">
            </div>
        `

        super(...arguments, widgetHtml)

    	this.defaultValue = widgetData.label===false?
                                widgetData.id:
                                widgetData.label=='auto'?
                                    widgetData.id:
                                    widgetData.label

        this.value = this.defaultValue

        this.setValue(this.value)

    }

    setValue(v) {

        this.value = typeof v=='object' && !v.length ? this.defaultValue : v
        this.widget.html(iconify(this.value))

    }

}
