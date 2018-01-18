var {iconify} = require('../../ui/utils'),
    _widgets_base = require('../common/_widgets_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Text extends _widgets_base {

    static defaults() {

        return {
            type:'text',
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

            _text: 'text',

            widgetId:'',
            vertical:false,
            value:'',

            _osc:'osc',

            preArgs:[],
            address:'auto',
        }

    }

    constructor(options) {

        super({...options, html: '<div class="text"></div>'})

        if (this.getProp('vertical')) this.widget.classList.add('vertical')

        this.defaultValue = this.getProp('value') || ( this.getProp('label')===false ?
                                this.getProp('id'):
                                this.getProp('label')=='auto'?
                                    this.getProp('id'):
                                    this.getProp('label') )

        this.value = this.defaultValue

        if (this.getProp('widgetId').length) widgetManager.on(`change.${this.hash}`,this.syncHandle.bind(this))

        this.setValue(this.value)

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
                this.setValue(widget[i].getValue(true), {sync: e.options.sync})
                return
            }
        }

    }

    setValue(v, options={}) {

        this.value = v==null ? this.defaultValue : v
        this.widget.innerHTML = iconify(String(this.value).replace(/\n/g,'<br/>'))

        if (options.sync) this.changed(options)

    }

}
