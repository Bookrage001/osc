var {clip, mapToScale} = require('../utils'),
    _canvas_base = require('../common/_canvas_base'),
    osctouchstate = require('../mixins/osctouchstate')

module.exports = class _sliders_base extends _canvas_base {

    constructor(widgetData) {

        var widgetHtml = `
            <div class="slider">
                <div class="wrapper">
                    <canvas></canvas>
                </div>
                <div class="input"></div>
            </div>
        `

        super(...arguments, widgetHtml)

        this.wrapper = this.widget.find('.wrapper')
        this.input = this.widget.find('.input').fakeInput({align:'center'})
        this.value = undefined
        this.percent = 0

        this.unit = widgetData.unit ? ' ' + widgetData.unit : ''


        this.rangeKeys = []
        this.rangeVals = []
        this.rangeLabels = []

        for (var k in widgetData.range) {
            var key = k=='min'?0:k=='max'?100:parseInt(k),
                val = typeof widgetData.range[k] == 'object'?
                            widgetData.range[k][Object.keys(widgetData.range[k])[0]]:
                            widgetData.range[k],
                label = typeof widgetData.range[k] == 'object'?
                            Object.keys(widgetData.range[k])[0]:
                            val

            this.rangeKeys.push(key)
            this.rangeVals.push(val)
            this.rangeLabels.push(label)
        }
        this.rangeValsMax = Math.max(...this.rangeVals),
        this.rangeValsMin = Math.min(...this.rangeVals)

        this.originValue = widgetData.origin=='auto'?
                                this.rangeValsMin:
                                clip(widgetData.origin,[this.rangeValsMin,this.rangeValsMax])
        this.springValue = widgetData.value != '' ? widgetData.value :  this.originValue

        this.widget.on('fake-right-click',function(e){
            if (!EDITING) {
                e.stopPropagation()
                e.preventDefault()
                this.input.focus()
            }
        }.bind(this))

        if (this.widgetData.touchAddress && this.widgetData.touchAddress.length)
            osctouchstate(this, this.canvas)
            
        this.widget.on('mousewheel',this.mousewheelHandleProxy.bind(this))
        this.canvas.on('draginit',this.draginitHandleProxy.bind(this))
        this.canvas.on('drag',this.dragHandleProxy.bind(this))
        this.canvas.on('dragend',this.dragendHandleProxy.bind(this))

        this.input.change(()=>{

            this.setValue(parseFloat(this.input.val()),{sync:true,send:true})

        })

        this.setValue(this.originValue)

    }

    mousewheelHandleProxy() {

        this.mousewheelHandle(...arguments)

    }

    draginitHandleProxy() {

        this.draginitHandle(...arguments)

    }

    dragHandleProxy() {

        this.dragHandle(...arguments)

    }

    dragendHandleProxy() {

        this.dragendHandle(...arguments)

    }

    mousewheelHandle(e, data, traversing) {

        if (e.originalEvent.wheelDeltaX) return

        e.preventDefault()
        e.stopPropagation()

        var direction = e.originalEvent.wheelDelta / Math.abs(e.originalEvent.wheelDelta),
        increment = e.ctrlKey?0.25:1

        this.percent = clip(this.percent +  Math.max(increment,10/Math.pow(10,this.widgetData.precision)) * direction  ,[0,100])

        this.setValue(this.percentToValue(this.percent), {sync:true,send:true,dragged:true})

    }

    draginitHandle(e, data, traversing) {

    }

    dragHandle(e, data, traversing) {

    }

    dragendHandle(e, data, traversing) {

        if (this.widgetData.spring)
            this.setValue(this.springValue,{sync:true,send:true,fromLocal:true})

    }

    resizeHandle(e, width, height, checkColors) {

        if (!this.visible || checkColors) {
            var style =  getComputedStyle(this.widget[0])
            this.colors.track = style.getPropertyValue('--color-track')
            this.colors.gauge = style.getPropertyValue('--color-gauge')
            this.colors.knob = style.getPropertyValue('--color-knob')
        }

        super.resizeHandle(...arguments)

    }


    percentToValue(percent) {

        var h = clip(percent,[0,100])
        for (var i=0;i<this.rangeKeys.length-1;i++) {
            if (h <= this.rangeKeys[i+1] && h >= this.rangeKeys[i]) {
                return mapToScale(h,[this.rangeKeys[i],this.rangeKeys[i+1]],[this.rangeVals[i],this.rangeVals[i+1]],false,this.widgetData.logScale)
            }
        }

    }

    valueToPercent(value) {

        for (var i=0;i<this.rangeVals.length-1;i++) {
            if (value <= this.rangeVals[i+1] && value >= this.rangeVals[i]) {
                return mapToScale(value,[this.rangeVals[i],this.rangeVals[i+1]],[this.rangeKeys[i],this.rangeKeys[i+1]],false,this.widgetData.logScale,true)
            }
        }

    }

    setValue(v,options={}) {

        if (typeof v != 'number') return

        var value = clip(v,[this.rangeValsMin,this.rangeValsMax])

        if ((options.dragged || options.fromLocal) && this.value.toFixed(this.widgetData.precision) == value.toFixed(this.widgetData.precision)) options.send = false

        this.value = value

        if (!options.dragged) this.percent = this.valueToPercent(this.value)

        if (!this.noDraw) this.draw()

        this.showValue()

        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
        if (options.send) this.sendValue(v)

    }

    showValue() {

        this.input.val(this.value.toFixed(this.widgetData.precision) + this.unit)

    }

}
