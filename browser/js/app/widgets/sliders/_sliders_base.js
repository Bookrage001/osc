var {clip, mapToScale, sendOsc} = require('../utils')
var _canvas_base = require('../common/_canvas_base')

var _sliders_base = module.exports = function(){

    this.widget = $(`
        <div class="slider">
            <div class="wrapper">
                <canvas></canvas>
            </div>
            <div class="input"></div>
        </div>
    `)

    _canvas_base.apply(this, arguments)

    this.input = this.widget.find('.input').fakeInput({align:'center'})
    this.roundFactor = Math.pow(10,this.widgetData.precision)
    this.value = undefined
    this.percent = 0


    this.rangeKeys = []
    this.rangeVals = []
    this.rangeLabels = []

    for (k in this.widgetData.range) {
        var key = k=='min'?0:k=='max'?100:parseInt(k),
            val = typeof this.widgetData.range[k] == 'object'?
                        this.widgetData.range[k][Object.keys(this.widgetData.range[k])[0]]:
                        this.widgetData.range[k],
            label = typeof this.widgetData.range[k] == 'object'?
                        Object.keys(this.widgetData.range[k])[0]:
                        val

        this.rangeKeys.push(key)
        this.rangeVals.push(val)
        this.rangeLabels.push(label)
    }
    this.rangeValsMax = Math.max.apply(Math, this.rangeVals),
    this.rangeValsMin = Math.min.apply(Math, this.rangeVals)

    this.originValue = this.widgetData.origin=='auto'?
                            this.rangeValsMin:
                            clip(this.widgetData.origin,[this.rangeValsMin,this.rangeValsMax])



    this.widget.on('fake-right-click',function(e){
        if (!EDITING) {
            e.stopPropagation()
            e.preventDefault()
            this.input.focus()
        }
    }.bind(this))

    this.widget.on('mousewheel',this.mousewheelHandleProxy.bind(this))
    this.canvas.on('draginit',this.draginitHandleProxy.bind(this))
    this.canvas.on('drag',this.dragHandleProxy.bind(this))

    this.input.change(function(){
        this.widget.setValue(parseFloat(this.input.val()),true,true)
    }.bind(this))

    this.widget.getValue = function(){
        return this.value
    }.bind(this)

    this.widget.setValue = this.setValue.bind(this)

    this.setValue(this.originValue)

}

_sliders_base.prototype = Object.create(_canvas_base.prototype)

_sliders_base.prototype.constructor = _sliders_base


_sliders_base.prototype.mousewheelHandleProxy = function() {
    this.mousewheelHandle.apply(this,arguments)
}

_sliders_base.prototype.draginitHandleProxy = function() {
    this.draginitHandle.apply(this,arguments)
}

_sliders_base.prototype.dragHandleProxy = function() {
    this.dragHandle.apply(this,arguments)
}


_sliders_base.prototype.mousewheelHandle = function(e, data, traversing) {
    if (e.originalEvent.wheelDeltaX) return

    e.preventDefault()
    e.stopPropagation()

    var direction = e.originalEvent.wheelDelta / Math.abs(e.originalEvent.wheelDelta),
        increment = e.ctrlKey?0.25:1

    this.percent = clip(this.percent + Math.max(increment,100/Math.pow(10,this.widgetData.precision)) * direction  ,[0,100])

    this.setValue(this.percentToValue(this.percent), true, true)


}

_sliders_base.prototype.draginitHandle = function(e, data, traversing) {

}

_sliders_base.prototype.dragHandle = function(e, data, traversing) {

}


_sliders_base.prototype.resizeHandle = function() {
    if (!self.visible) {
        this.colors.track = getComputedStyle(this.widget[0]).getPropertyValue('--color-track')
        this.colors.gauge = getComputedStyle(this.widget[0]).getPropertyValue('--color-gauge')
        this.colors.knob = getComputedStyle(this.widget[0]).getPropertyValue('--color-knob')
    }
    _canvas_base.prototype.resizeHandle.call(this)
}


_sliders_base.prototype.percentToValue = function(percent) {
    var h = clip(percent,[0,100])
    for (var i=0;i<this.rangeKeys.length-1;i++) {
        if (h <= this.rangeKeys[i+1] && h >= this.rangeKeys[i]) {
            return mapToScale(h,[this.rangeKeys[i],this.rangeKeys[i+1]],[this.rangeVals[i],this.rangeVals[i+1]],this.widgetData.precision,this.widgetData.logScale)
        }
    }
}
_sliders_base.prototype.valueToPercent = function(value) {
    for (var i=0;i<this.rangeVals.length-1;i++) {
        if (value <= this.rangeVals[i+1] && value >= this.rangeVals[i]) {
            return mapToScale(value,[this.rangeVals[i],this.rangeVals[i+1]],[this.rangeKeys[i],this.rangeKeys[i+1]],false,this.widgetData.logScale,true)
        }
    }
}

_sliders_base.prototype.setValue = function(v,send,sync, dragged) {
    if (typeof v != 'number') return

    this.value = clip(Math.round(v*this.roundFactor)/this.roundFactor,[this.rangeValsMin,this.rangeValsMax])

    if (!dragged) this.percent = this.valueToPercent(this.value)

    this.draw()

    this.showValue()

    if (sync) this.widget.trigger('sync',[this.widgetData.id,this.widget,this.widgetData.linkId])
    if (send) this.sendValue(v)
}

_sliders_base.prototype.sendValue = function(value) {
    var args = this.widgetData.preArgs.concat(value)

    sendOsc({
        target:this.widgetData.target,
        path:this.widgetData.path,
        precision:this.widgetData.precision,
        args:args
    })

}

_sliders_base.prototype.showValue = function() {
    this.input.val(this.value + ' ' + this.widgetData.unit)
}
