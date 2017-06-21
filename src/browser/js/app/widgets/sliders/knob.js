var {clip, mapToScale} = require('../utils'),
    _sliders_base = require('./_sliders_base')

module.exports = class Knob extends _sliders_base {

    static defaults() {

        return {
            type:'knob',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            unit:'',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            pips:true,
            dashed:false,
            angle:270,
            css:'',

            _behaviour:'behaviour',

            snap:false,
            spring:false,
            doubleTap:false,

            _osc:'osc',

            range:{min:0,max:1},
            origin: 'auto',
            value:'',
            logScale:false,
            precision:2,
            address:'auto',
            touchAddress:'',
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        super(options)

        this.widget.addClass('knob')

        this.margin = 5

        this.widget.addClass('compact')

        if (this.getProp('pips')) {
            this.wrapper.append(`
                <div class="pips">
                    <div>${this.rangeLabels[0]}</div><div>${this.rangeLabels[this.rangeLabels.length-1]}</div>
                </div>
            `)
        }

        this.lastOffsetX = 0
        this.lastOffsetY = 0
        this.minDimension = 0

        this.maxAngle = this.getProp('angle')

        // calculate lost height factor
        var a = (1 - Math.sin((Math.max(this.maxAngle,247.5) - 180) / 2 * Math.PI / 180)) / 3
        this.lostHeightFactor = a / 4

    }

    draginitHandle(e, data, traversing) {

        this.percent = clip(this.percent,[0,100])

        this.lastOffsetX = data.offsetX
        this.lastOffsetY = data.offsetY

        if (!(traversing || this.getProp('snap'))) return

        this.percent = this.angleToPercent(this.coordsToAngle(data.offsetX, data.offsetY))

        this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

    }

    dragHandle(e, data, traversing) {

        if (!(traversing || this.getProp('snap'))) {

            this.percent = -100*data.speedY/this.height + this.percent

        } else {

            this.lastOffsetX = this.lastOffsetX + data.speedX
            this.lastOffsetY = this.lastOffsetY + data.speedY
            this.percent = this.angleToPercent(this.coordsToAngle(this.lastOffsetX, this.lastOffsetY))
        }

        this.percent = this.percent,[0,100]

        this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

    }

    coordsToAngle(x,y) {

        var xToCenter = x - this.width /2,
        yToCenter = y - this.height / 2,
        angle =  Math.atan2(-yToCenter, -xToCenter) * 180 / Math.PI + 90

        return angle<0?360+angle:angle

    }

    angleToPercent(angle) {

        return clip(angle - (360 - this.maxAngle) / 2, [0, this.maxAngle]) / this.maxAngle * 100

    }

    percentToAngle(percent) {

        var percent = clip(percent, [0, 100])
        return  2 * Math.PI * percent / 100 * (this.maxAngle / 360) // angle relative to maxAngle
        + Math.PI / 2                                       // quarter circle offset
        + Math.PI * (1 - this.maxAngle / 360)               // centering offset depending on maxAngle

    }

    resizeHandle() {

        super.resizeHandle(...arguments)

        this.minDimension = Math.min(this.width, this.height)
        this.gaugeWidth = this.minDimension / 12

        this.canvas[0].style.top = (this.minDimension) * this.lostHeightFactor - (this.getProp('label') === false ? 0 : this.gaugeWidth / 4) + 'px'

    }

    draw() {

        var o = this.percentToAngle(this.valueToPercent(this.originValue)),
            d = this.percentToAngle(this.percent),
            min = this.percentToAngle(0),
            max = this.percentToAngle(100),
            dashed = this.getProp('dashed'),
            angle1px = PXSCALE / (this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE)


        this.ctx.clearRect(0,0,this.width,this.height)

        this.ctx.globalAlpha = 1

        if (this.minDimension >= 50) {

            this.ctx.strokeStyle = this.colors.light
            this.ctx.lineWidth = 7 * PXSCALE
            this.ctx.beginPath()
            this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE, min - 2 * angle1px, max + 2 * angle1px)
            this.ctx.stroke()

            this.ctx.strokeStyle = this.colors.bg
            this.ctx.lineWidth = 5 * PXSCALE
            this.ctx.beginPath()
            this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE, min - angle1px, max + angle1px)
            this.ctx.stroke()

        }

        if (dashed) this.ctx.setLineDash([1.5, 1.5])

        this.ctx.strokeStyle = this.colors.track
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.beginPath()
        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE, min, max)
        this.ctx.stroke()

        this.ctx.strokeStyle = this.colors.gauge
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.beginPath()

        this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE, o, d, o > d)
        this.ctx.stroke()

        if (dashed) this.ctx.setLineDash([])

        // knob

        this.ctx.lineWidth = PXSCALE

        this.ctx.fillStyle = this.colors.raised
        this.ctx.beginPath()
        this.ctx.globalAlpha = 1
        this.ctx.arc(this.width / 2, this.height / 2,  this.minDimension / 2 - this.gaugeWidth * 2 - this.margin * PXSCALE, 0, Math.PI * 2)
        this.ctx.fill()
        this.ctx.strokeStyle = this.colors.track
        this.ctx.stroke()

        this.ctx.beginPath()
        this.ctx.globalAlpha = 1
        this.ctx.arc(this.width / 2, this.height / 2,  this.minDimension / 2 - this.gaugeWidth * 2 - this.margin * PXSCALE - PXSCALE, 0, Math.PI * 2)
        this.ctx.strokeStyle = this.colors.light
        this.ctx.stroke()

        // cursor
        this.ctx.globalAlpha = 1

        let r1 = this.minDimension / 2 - this.gaugeWidth * 2 - this.margin * PXSCALE,
            r2 = this.minDimension / 2 - this.gaugeWidth * 3 - this.margin * PXSCALE,
            a  = 2 * Math.PI - d

        this.ctx.beginPath()
        this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
        this.ctx.lineTo((r1/2) * Math.cos(a) + this.width / 2, this.height / 2 - (r1/2) * Math.sin(a))

        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.strokeStyle = this.colors.knob
        this.ctx.stroke()



    }

}
