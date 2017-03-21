var {iconify} = require('../../utils'),
    _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers')

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

            _plot:'plot',

            widgetId:'',

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

        if (widgetData.widgetId.length) $('body').on(`sync.${this.hash}`,this.syncHandle.bind(this))

        this.setValue(this.value)

    }

    onRemove() {

        $('body').off(`sync.${this.hash}`)

    }

    syncHandle(e) {

        if (this.widgetData.widgetId!=e.id || !widgetManager.getWidgetById(e.id).length) return
        var widget = widgetManager.getWidgetById(e.id),
            value
        for (var i=widget.length-1; i>=0; i--) {
            if (widget[i].getValue) {
                this.setValue(widget[i].getValue())
                return
            }
        }

    }

    setValue(v) {

        this.value = typeof v=='object' && !v.length ? this.defaultValue : v
        this.widget.html(iconify(this.value))

    }

}
