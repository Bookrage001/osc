var {mapToScale} = require('../utils'),
    _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers'),
    {clip} = require('../utils')

module.exports = class Led extends _widgets_base {

    static defaults() {

        return {
            type:'rgbled',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            css:'',

            _plot:'plot',

            widgetId:'',

            _osc:'osc',

            value:'',
            preArgs:[],
            address:'auto'

        }

    }

    constructor(options) {

        var html = `
            <div class="led">
                <div><span></span></div>
            </div>
        `

        super({...options, html: html})

        this.led = this.widget.find('span')

        if (this.getProp('widgetId').length) $('body').on(`sync.${this.hash}`,this.syncHandle.bind(this))

        this.setValue([0,0,0])

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
    setValue(v) {

        if (!v || !v.length || v.length<3) return

        for (let i in [0,1,2]) {
            v[i] = parseInt(clip(v[i],[0,255]))
        }

        v[3] = clip(v[3]||1,[0,1])

        this.led[0].style.setProperty('--color-custom',`rgba(${v[0]}, ${v[1]}, ${v[2]}, ${v[3]})`)

    }

}
