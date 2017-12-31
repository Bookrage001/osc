var _widgets_base = require('../common/_widgets_base'),
    widgetManager = require('../../managers/widgets'),
    {math} = require('../utils'),
    {iconify} = require('../../utils'),
    keyboardJS = require('keyboardjs')

module.exports = class Keys extends _widgets_base {

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

            _keys:'keys',

            binding:'',
            widgetId:'',
            keydown:'',
            keyup:'',
            repeat:false,

        }

    }

    constructor(options) {

        var html = `
            <div class="keys">
                ${iconify('^keyboard')}
            </div>
        `

        super({...options, html: html})

        this.keydownString = String(this.getProp('keydown'))
        this.keyupString = String(this.getProp('keyup'))

        if (this.getProp('binding') && (this.keydownString || this.keyupString)) {

            this.widget.append(`<span>${this.getProp('binding')}</span>`)

            this.keydownHandler = this.keydownString ? this.keydown.bind(this) : this.showKeydown.bind(this)
            this.keyupHandler = this.keyupString ? this.keyup.bind(this) : this.showKeyup.bind(this)

            this.keydownMath = math.compile(this.keydownString)
            this.keyupMath = math.compile(this.keyupString)

            keyboardJS.bind(this.getProp('binding'), this.keydownHandler, this.keyupHandler)

        }

        this.linkedWidget = null
    }

    onRemove() {

        super.onRemove()

        if (this.getProp('binding') && (this.getProp('keydown') || this.getProp('keyup'))) {

            keyboardJS.unbind(this.getProp('binding'), this.keydownHandler, this.keyupHandler)

        }

    }

    keydown(e) {

        if (e.target.classList.contains('input')) return

        if (!this.getProp('repeat') && e) e.preventRepeat()

        var widget = this.getLinkedWidget()

        if (widget) {

            var v = this.keydownMath.eval({
                value: widget.getValue(),
                key: e.key,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                meta: e.metaKey
            }).valueOf()

            if (Array.isArray(v) && v.length == 1) v = v[0]

            widget.setValue(v, {send:true, sync:true, fromExternal:false})

        }

        this.showKeydown()

    }

    showKeydown(){

        this.widget[0].style.setProperty('--opacity', 1)

    }

    keyup(e) {

        if (e.target.classList.contains('input')) return

        var widget = this.getLinkedWidget()

        if (widget) {

            var v = this.keyupMath.eval({
                value: widget.getValue(),
                key: e.key,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                meta: e.metaKey
            }).valueOf()

            if (Array.isArray(v) && v.length == 1) v = v[0]

            widget.setValue(v, {send:true, sync:true, fromExternal:false})

        }

        this.showKeyup()

    }

    showKeyup(){

        this.widget[0].style.setProperty('--opacity', 0.75)

    }

    getLinkedWidget() {

        if (this.getProp('widgetId')) {

            return widgetManager.getWidgetById(this.getProp('widgetId')).pop() || null

        }

    }

    setValue() {}

}
