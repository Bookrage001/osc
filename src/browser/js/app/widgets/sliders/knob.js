var {clip, mapToScale} = require('../utils'),
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
    noPip:true,
    compact:false,
    angle:270,
    css:'',

    separator2:'behaviour',

    snap:false,

    separator3:'osc',

    range:{min:0,max:1},
    origin: 'auto',
    value:'',
    logScale:false,
    precision:2,
    address:'auto',
    preArgs:[],
    target:[]
}



var Knob = module.exports.Knob = function(widgetData) {

    _sliders_base.apply(this,arguments)

    this.widget.addClass('knob')

    this.margin = 5

    if (widgetData.compact) {
        this.widget.addClass('compact')
        this.margin = 0
    }

    if (!widgetData.noPip) {
        this.wrapper.append(`
            <div class="pips">
                <div>${this.rangeLabels[0]}</div><div>${this.rangeLabels[this.rangeLabels.length-1]}</div>
            </div>
        `)
    }

    this.lastOffsetX = 0
    this.lastOffsetY = 0
    this.minDimension = 0

    this.maxAngle = widgetData.angle

    // calculate lost height factor
    var a = this.maxAngle <= 180 ?
                1 : 1 - Math.sin((this.maxAngle - 180) / 2 * Math.PI / 180)
    this.lostHeightFactor = a / 4

}


Knob.prototype = Object.create(_sliders_base.prototype)

Knob.prototype.constructor = Knob

Knob.prototype.draginitHandle = function(e, data, traversing){

    this.percent = clip(this.percent,[0,100])

    this.lastOffsetX = data.offsetX
    this.lastOffsetY = data.offsetY

    if (!(traversing || this.widgetData.snap)) return

    this.percent = this.angleToPercent(this.coordsToAngle(data.offsetX, data.offsetY))

    this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

}

Knob.prototype.dragHandle = function(e, data, traversing) {


    if (!(traversing || this.widgetData.snap)) {

        this.percent = -100*data.speedY/this.height + this.percent

    } else {

        this.lastOffsetX = this.lastOffsetX + data.speedX
        this.lastOffsetY = this.lastOffsetY + data.speedY
        this.percent = this.angleToPercent(this.coordsToAngle(this.lastOffsetX, this.lastOffsetY))
    }

    this.percent = this.percent,[0,100]

    this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

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
    this.gaugeWidth = this.minDimension / 8
    if (this.widgetData.compact) {
        this.canvas[0].style.top = this.input[0].style.marginTop = (this.minDimension) * this.lostHeightFactor - this.gaugeWidth / 4 + 'px'
    } else {
        this.canvas[0].style.top  = Math.min((this.minDimension) * this.lostHeightFactor - this.margin * PXSCALE / 2, this.input.outerHeight() * .5) + 'px'
    }
}


Knob.prototype.draw = function(){

    var o = this.percentToAngle(this.valueToPercent(this.originValue)),
        d = this.percentToAngle(this.percent),
        min = this.percentToAngle(0),
        max = this.percentToAngle(100)

    this.ctx.clearRect(0,0,this.width,this.height)

    if (this.widgetData.compact) {

        this.ctx.lineWidth = this.gaugeWidth * PXSCALE
        this.ctx.globalAlpha = 0.3
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.track
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - (this.gaugeWidth + this.margin) * PXSCALE, min, max)
        this.ctx.stroke()

        this.ctx.globalAlpha = 0.3
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.gauge
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - (this.gaugeWidth + this.margin) * PXSCALE, Math.min(o,d), Math.max(o,d))
        this.ctx.stroke()

        this.ctx.lineWidth = 1 * PXSCALE
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.track
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - (this.gaugeWidth/2 + this.margin) * PXSCALE, min, max)
        this.ctx.stroke()

        this.ctx.globalAlpha = 1

        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.gauge
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - (this.gaugeWidth/2 + this.margin) * PXSCALE, Math.min(o,d), Math.max(o,d))
        this.ctx.stroke()


        this.ctx.save()

        this.ctx.translate(this.width / 2, this.height / 2)
        this.ctx.rotate(d)
        this.ctx.translate(-this.width / 2, -this.height / 2)

        this.ctx.beginPath()

        this.ctx.strokeStyle = this.colors.knob
        this.ctx.lineWidth = 1 * PXSCALE
        this.ctx.moveTo(this.width / 2 + this.minDimension / 2 - (this.gaugeWidth/2 + this.margin) * PXSCALE, this.height / 2)
        this.ctx.lineTo(this.width / 2 + this.minDimension / 2 - (this.gaugeWidth * 1.5 + this.margin) * PXSCALE, this.height / 2)
        this.ctx.stroke()

        this.ctx.restore()


    } else {

        this.ctx.beginPath()
        this.ctx.fillStyle = this.colors.raised
        this.ctx.arc(this.width / 2, this.height / 2,  Math.max(this.minDimension / 2 - (30 + this.margin) * PXSCALE, 2 * PXSCALE), 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.track
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - (10 + this.margin) * PXSCALE, min, max)
        this.ctx.stroke()


        this.ctx.beginPath()
        this.ctx.strokeStyle = this.colors.gauge
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - (10 + this.margin) * PXSCALE, Math.min(o,d), Math.max(o,d))
        this.ctx.stroke()

        this.ctx.save()

        this.ctx.translate(this.width / 2, this.height / 2)
        this.ctx.rotate(d)
        this.ctx.translate(-this.width / 2, -this.height / 2)

        this.ctx.beginPath()

        this.ctx.fillStyle = this.colors.knob
        this.ctx.arc(this.width / 2 + this.minDimension / 2 - (10 + this.margin) * PXSCALE, this.height / 2, 4 * PXSCALE, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.globalAlpha = 0.3
        this.ctx.fillStyle = this.colors.knob
        this.ctx.arc(this.width / 2 + this.minDimension / 2 - (10 + this.margin) * PXSCALE, this.height / 2, 10 * PXSCALE, 0, Math.PI * 2)
        this.ctx.fill()

        this.ctx.restore()
    }

}


module.exports.create = function(widgetData) {
    var knob = new Knob(widgetData)
    return knob.widget
}
