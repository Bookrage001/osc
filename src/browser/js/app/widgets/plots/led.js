var {mapToScale} = require('../utils'),
    Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets')

module.exports = class Led extends Widget {

    static defaults() {

        return {
            type:'led',
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

            _led:'led',

            widgetId:'',
            range:{min:0,max:1},
            logScale:false,
            value:'',

            _osc:'osc',

            preArgs:[],
            address:'auto'

        }

    }

    constructor(options) {

        var html = `
            <div class="led">
            </div>
        `

        super({...options, html: html})

        if (this.getProp('widgetId').length) widgetManager.on(`change.${this.hash}`, this.syncHandle.bind(this))

        this.setValue(this.getProp('range').min)

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
    setValue(v, options={}) {

        if (typeof v != 'number') return
        this.value = v
        this.widget.style.setProperty('--opacity', mapToScale(v,[this.getProp('range').min,this.getProp('range').max],[0,1],false,this.getProp('logScale'),true))

        if (options.sync) this.changed(options)

    }

}
