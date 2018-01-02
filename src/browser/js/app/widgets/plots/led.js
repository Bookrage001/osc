var {mapToScale} = require('../utils'),
    _widgets_base = require('../common/_widgets_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Led extends _widgets_base {

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

        if (this.getProp('widgetId').length) $('body').on(`change.${this.hash}`,this.syncHandle.bind(this))

        this.setValue(this.getProp('range').min)

    }

    onRemove() {

        $('body').off(`change.${this.hash}`)
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
    setValue(v, options={}) {

        if (typeof v != 'number') return
        this.value = v
        this.widget[0].style.setProperty('--opacity', mapToScale(v,[this.getProp('range').min,this.getProp('range').max],[0,1],false,this.getProp('logScale'),true))

        if (options.sync) this.widget.trigger({type:'change',id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'), options:options})

    }

}
