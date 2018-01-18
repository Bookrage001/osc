var {iconify} = require('../../ui/utils'),
    _widgets_base = require('../common/_widgets_base'),
    _canvas_base = require('../common/_canvas_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Input extends _canvas_base {

    static defaults() {

        return {
            type:'input',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _input:'input',

            vertical:false,
            unit: '',
            widgetId:'',
            editable:true,
            value:'',

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        var html = `
            <div class="input">
                <canvas></canvas>
            </div>
        `

        super({...options, html: html})

        this.value = ''
        this.stringValue = ''

        if (this.getProp('vertical')) {
            this.widget.classList.add('vertical')
        }

        if (this.getProp('editable')) {
            this.canvas.setAttribute('tabindex', 0)
            this.canvas.addEventListener('focus', this.focus.bind(this))
            this.input = DOM.create('<input></input>')
            this.input.addEventListener('blur', (e)=>{
                this.blur(false)
            })
            this.input.addEventListener('keydown', (e)=>{
                if (e.keyCode==13) this.blur()
                if (e.keyCode==27) this.blur(false)
            })
        }

        if (this.getProp('widgetId').length) {

            widgetManager.on(`change.${this.hash}`, this.syncHandle.bind(this))

        }

    }

    focus() {

        this.canvas.setAttribute('tabindex','-1')
        this.input.value = this.stringValue
        this.widget.insertBefore(this.input, this.canvas)
        this.input.focus()

    }

    blur(change=true) {

        if (change) this.inputChange()

        this.canvas.setAttribute('tabindex','0')
        if (this.input.parentNode == this.widget) this.widget.removeChild(input)

    }

    inputChange() {

        this.setValue(this.input.value, {sync:true, send:true})

    }

    onRemove() {

        widgetManager.off(`change.${this.hash}`)
        super.onRemove()

    }

    syncHandle(e) {

        if (this.getProp('widgetId')!=e.id || !widgetManager.getWidgetById(e.id).length || !e.widget) return

        this.setValue(e.widget.getValue(), {...e.options, internal:true})

    }

    resizeHandle(event){

            super.resizeHandle(event)

            if (this.getProp('vertical')){
                this.ctx.setTransform(1, 0, 0, 1, 0, 0)
                this.ctx.rotate(-Math.PI/2)
                this.ctx.translate(-this.height, 0)

                var ratio = CANVAS_SCALING * this.scaling

                if (ratio != 1) this.ctx.scale(ratio, ratio)
            }


    }

    setValue(v, options={} ) {

        try {
            this.value = JSON.parse(v)
        } catch (err) {
            this.value = v
        }

        if (!options.internal && this.getProp('widgetId').length) {
            var widget = widgetManager.getWidgetById(this.getProp('widgetId'))
            for (var i=widget.length-1; i>=0; i--) {
                if (widget[i].setValue) {
                    widget[i].setValue(this.value, options)
                    this.setValue(widget[i].getValue(), {...options, internal:true, sentOnce:options.send})
                    return
                }
            }
        }

        if (options.sentOnce) options.send = false

        this.stringValue = this.getStringValue()
        this.batchDraw()

        if (options.send && !options.fromSync) this.sendValue()
        if (options.sync) this.changed(options)

    }

    draw() {

        var v = this.stringValue,
            width = this.getProp('vertical') ? this.height : this.width,
            height = !this.getProp('vertical') ? this.height : this.width

        if (this.getProp('unit') && v.length) v += ' ' + this.getProp('unit')

        this.clear()

        this.ctx.fillStyle = this.colors.text

        if (this.textAlign == 'center') {
            this.ctx.fillText(v, Math.round(width/2), Math.round(height/2))
        } else if (this.textAlign == 'right') {
            this.ctx.fillText(v, width, Math.round(height/2))
        } else {
            this.ctx.fillText(v, 0, Math.round(height/2))
        }

        this.clearRect = [0, 0, width, height]

    }

    getStringValue() {
        if (this.value === undefined) return ''
        return typeof this.value != 'string' ?
            JSON.stringify(_widgets_base.deepCopy(this.value, this.precision)).replace(/,/g, ', ') :
            this.value
    }

}
