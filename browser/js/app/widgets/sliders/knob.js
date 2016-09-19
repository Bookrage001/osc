var {clip, mapToScale, sendOsc} = require('../utils'),
    _sliders_base = require('./_sliders_base')


module.exports.options = {
    type:'knob',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    noPip:false,
    compact:false,
    angle:270,
    css:'',

    separator2:'behaviour',

    snap:false,

    separator3:'osc',

    range:{min:0,max:1},
    origin: 'auto',
    logScale:false,
    precision:2,
    path:'auto',
    preArgs:[],
    target:[]
}



Knob = function(widgetData) {

    _sliders_base.apply(this,arguments)

    this.widget.addClass('knob')

    this.lastOffsetX = 0
    this.lastOffsetY = 0
    this.minDimension = 0

    this.maxAngle = widgetData.angle

    // calculate lost height factor
    var a = Math.sin((360 - this.maxAngle)),
        h = a < 0 ? 1 - a : a

    this.lostHeightFactor = h / 4

}


Knob.prototype = Object.create(_sliders_base.prototype)

Knob.prototype.constructor = Knob

Knob.prototype.draginitHandle = function(e, data, traversing){

    this.percent = clip(this.percent,[0,100])

    this.lastOffsetX = data.offsetX
    this.lastOffsetY = data.offsetY

    if (!(traversing || this.widgetData.snap)) return

    this.percent = this.angleToPercent(this.coordsToAngle(data.offsetX, data.offsetY))

    this.setValue(this.percentToValue(this.percent), true, true, true)

}

Knob.prototype.dragHandle = function(e, data, traversing) {


    if (!(traversing || this.widgetData.snap)) {

        this.percent = -data.speedY + this.percent

    } else {

        this.lastOffsetX = this.lastOffsetX + data.speedX
        this.lastOffsetY = this.lastOffsetY + data.speedY
        this.percent = this.angleToPercent(this.coordsToAngle(this.lastOffsetX, this.lastOffsetY))
    }

    this.percent = this.percent,[0,100]

    this.setValue(this.percentToValue(this.percent), true, true, true)

}

Knob.prototype.coordsToAngle = function(x,y) {
    var xToCenter = x - this.width /2,
        yToCenter = y - this.height / 2,
        angle =  Math.atan2(-yToCenter, -xToCenter) * 180 / Math.PI + 90

    return angle<0?360+angle:angle
}

Knob.prototype.angleToPercent = function(angle) {
    return clip(angle - (360 - this.maxAngle) / 2, [0, this.maxAngle]) / this.maxAngle * 100
}

Knob.prototype.percentToAngle = function(percent) {
    var percent = clip(percent, [0, 100])
    return  2 * Math.PI * percent / 100 * (this.maxAngle / 360) // angle relative to maxAngle
            + Math.PI / 2                                       // quarter circle offset
            + Math.PI * (1 - this.maxAngle / 360)               // centering offset depending on maxAngle
}

Knob.prototype.resizeHandle = function() {
    _sliders_base.prototype.resizeHandle.call(this)
    this.minDimension = Math.min(this.width, this.height)
    this.canvas[0].style.top = (this.minDimension / 2 - 15) * this.lostHeightFactor + 'px'
}


Knob.prototype.draw = function(){

    var o = this.percentToAngle(this.valueToPercent(this.originValue)),
        d = this.percentToAngle(this.percent),
        min = this.percentToAngle(0),
        max = this.percentToAngle(100)

    this.ctx.clearRect(0,0,this.width,this.height)

    this.ctx.lineWidth = 2 * PXSCALE
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.colors.track
    this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - 15 * PXSCALE, min, max)
    this.ctx.stroke()


    this.ctx.beginPath()
    this.ctx.strokeStyle = this.colors.custom
    this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - 15 * PXSCALE, Math.min(o,d), Math.max(o,d))
    this.ctx.stroke()


    this.ctx.save()

    this.ctx.translate(this.width / 2, this.height / 2)
    this.ctx.rotate(d)
    this.ctx.translate(-this.width / 2, -this.height / 2)

    this.ctx.beginPath()

    this.ctx.fillStyle = this.colors.gauge
    this.ctx.arc(this.width / 2 + this.minDimension / 2 - 15 * PXSCALE, this.height / 2, 4 * PXSCALE, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.globalAlpha = 0.3
    this.ctx.fillStyle = this.colors.knob
    this.ctx.arc(this.width / 2 + this.minDimension / 2 - 15 * PXSCALE, this.height / 2, 10 * PXSCALE, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.restore()
}


module.exports.create = function(widgetData) {
    var knob = new Knob(widgetData)
    return knob.widget
}



var oldstuf = function(widgetData,container) {
    var widget = $(`
        <div class="knob-wrapper-outer">
            <div class="knob-wrapper">
                <div class="knob-mask">
                    <div class="knob"><span></span></div>
                    <div class="handle"></div>
                </div>
                <div class="pips">
                    <div class="pip min"></div>
                    <div class="pip max"></div>
                </div>
            </div>
            <div class="input"></div>
        </div>
        `),
        wrapper = widget.find('.knob-wrapper'),
        mask = widget.find('.knob-mask'),
        knob = widget.find('.knob'),
        handle = widget.find('.handle'),
        input = widget.find('.input').fakeInput({align:'center'}),
        range = widgetData.range,
        unit = widgetData.unit?' '+widgetData.unit.trim(): '',
        snap = widgetData.snap,
        logScale = widgetData.logScale,
        roundFactor = Math.pow(10,widgetData.precision)

        if (widgetData.noPip) wrapper.addClass('no-pip')
        if (widgetData.compact) container.addClass('compact')


    var rangeKeys = [],
        rangeVals = [],
        rangeLabels = []

    for (k in widgetData.range) {
        var key = k=='min'?0:k=='max'?100:parseInt(k),
            val = typeof widgetData.range[k] == 'object'?
                        widgetData.range[k][Object.keys(widgetData.range[k])[0]]:
                        widgetData.range[k],
            label = typeof widgetData.range[k] == 'object'?
                        Object.keys(widgetData.range[k])[0]:
                        val

        rangeKeys.push(key)
        rangeVals.push(val)
        rangeLabels.push(label)
    }

    var rangeValsMax = Math.max.apply(Math, rangeVals),
        rangeValsMin = Math.min.apply(Math, rangeVals)


    var pipmin = Math.abs(rangeLabels[0])>=1000?rangeLabels[0]/1000+'k':rangeLabels[0],
        pipmax = Math.abs(rangeLabels[rangeLabels.length-1])>=1000?rangeLabels[rangeLabels.length-1]/1000+'k':rangeLabels[rangeLabels.length-1]



    widget.find('.pip.min').text(pipmin)
    widget.find('.pip.max').text(pipmax)

    mask.size = 0
    widget.value = undefined

    wrapper.resize(function(e,width,height){

        var w = Math.floor(Math.min(height,width)*.58)

        if (!w || mask.size==w) return
        mask.size=w
        mask[0].setAttribute('style',`height:${w}px;width:${w}px;padding-bottom:0`)
        wrapper.size = {width:wrapper[0].clientWidth,height:wrapper[0].clientHeight}
    })

    wrapper.on('fake-right-click',function(e){
        if (!EDITING) {
            e.stopPropagation()
            e.preventDefault()
            input.focus()
        }
    })

    wrapper.on('mousewheel',function(e){
        if (e.originalEvent.wheelDeltaX) return

        e.preventDefault()
        e.stopPropagation()

        var divider = e.ctrlKey?48:8
        knob.rotation = clip(knob.rotation+e.originalEvent.wheelDeltaY/divider,[0,270])

        widget.updateUi(knob.rotation)

        var v = widget.getValue()

        if (v!=widget.value) {
            widget.value = v

            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        }
    })


    knob.rotation = 0

    var offR = 0,
        offX = 0,
        offY = 0
    wrapper.on('draginit',function(e,data,traversing){

        if (snap || traversing) {

            var w = wrapper.size.width,
                h = wrapper.size.height,
                x = data.offsetX-w/2,
                y = data.offsetY-h/2,
                angle =  Math.atan2(-y, -x) * 180 / Math.PI +45,
                r = angle<-90?angle+360:angle
                r = (angle>=-90 && angle<-45)?270:r
                r = clip(r,[0,270])

            offX = x
            offY = y

            widget.updateUi(r)

            knob.rotation = r

            var v = widget.getValue()

            if (v!=widget.value) {
                widget.value = v

                widget.sendValue(v)
                widget.showValue(v)

                widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
            }

        }

        offR = knob.rotation
    })

    wrapper.on('drag',function(e,data){

        var r = clip(-data.deltaY*2+offR,[0,270])

        if (snap || data.ctrlKey || data.shiftKey) {
            var w   =  data.target.clientWidth,
                h   =  data.target.clientHeight,
                x   =  data.deltaX + offX,
                y   =  data.deltaY + offY,
                angle =  Math.atan2(-y, -x) * 180 / Math.PI +45,
                r = angle<-90?angle+360:angle
                r = (angle>=-90 && angle<-45)?270:r
                r = clip(r,[0,270])
        }

        widget.updateUi(r)

        knob.rotation = r

        var v = widget.getValue()

        if (v!=widget.value) {
            widget.value = v

            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        }
    })

    widget.updateUi = function(r) {
        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        handle[0].setAttribute('style','transform:rotateZ('+(r-45)+'deg)')

        if      (r>180) {knob.addClass('d3')}
        else if (r>90)  {knob.removeClass('d3').addClass('d2')}
        else            {knob.removeClass('d3 d2')}
    }

    widget.getValue = function() {
        var h = knob.rotation
        for (var i=0;i<rangeKeys.length-1;i++) {
            if (h <= rangeKeys[i+1]*2.7 && h >= rangeKeys[i]*2.7) {
                return mapToScale(h,[rangeKeys[i]*2.7,rangeKeys[i+1]*2.7],[rangeVals[i],rangeVals[i+1]],widgetData.precision,logScale)
            }
        }
    }
    widget.showValue = function(v) {
        input.val(v+unit)
    }
    widget.sendValue = function(v) {
        var args = widgetData.preArgs.concat(v)

        sendOsc({
            target:widgetData.target,
            path:widgetData.path,
            precision:widgetData.precision,
            args:args
        })
    }
    widget.setValue = function(v,send,sync) {
        if (typeof v != 'number') return

        var v = clip(Math.round(v*roundFactor)/roundFactor,[rangeValsMin,rangeValsMax]),
            r

        for (var i=0;i<rangeVals.length-1;i++) {
            if (v <= rangeVals[i+1] && v >= rangeVals[i]) {
                r = mapToScale(v,[rangeVals[i],rangeVals[i+1]],[rangeKeys[i]*2.7,rangeKeys[i+1]*2.7],false,logScale,true)
                break
            }
        }

        knob.rotation = r

        widget.updateUi(r)

        var v = widget.getValue()
        widget.value = v

        widget.showValue(v)

        if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        if (send) widget.sendValue(v)
    }
    input.change(function(){
        widget.setValue(parseFloat(input.val()),true,true)
    })

    widget.setValue(rangeVals[0])
    return widget
}
