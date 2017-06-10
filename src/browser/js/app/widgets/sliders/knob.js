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
            compact:false,
            angle:270,
            css:'',

            _behaviour:'behaviour',

            snap:false,
            spring:false,

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

        if (this.getProp('compact')) {
            this.widget.addClass('compact')
            this.margin = 0
        }

        if (this.getProp('pips') && !this.getProp('compact')) {
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
        var a = this.getProp('compact') ?
                    (1 - Math.sin((Math.max(this.maxAngle,247.5) - 180) / 2 * Math.PI / 180)) / 3
                    : 1 - Math.sin((Math.max(this.maxAngle,180) - 180) / 2 * Math.PI / 180)
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
        this.gaugeWidth = this.minDimension / 8

        if (this.getProp('compact')) {
            this.canvas[0].style.top = this.input[0].style.marginTop = (this.minDimension) * this.lostHeightFactor - (this.getProp('label') === false ? 0 : this.gaugeWidth / 4) + 'px'
        } else {
            this.canvas[0].style.top  = Math.min((this.minDimension) * this.lostHeightFactor - (this.getProp('label') === false ? 0 : this.margin * PXSCALE / 2), this.input.outerHeight() * .5) + 'px'
        }

    }

    draw() {

        var o = this.percentToAngle(this.valueToPercent(this.originValue)),
            d = this.percentToAngle(this.percent),
            min = this.percentToAngle(0),
            max = this.percentToAngle(100)

        this.ctx.clearRect(0,0,this.width,this.height)

        if (this.getProp('compact')) {

            this.ctx.strokeStyle = this.colors.track
            this.ctx.globalAlpha = 0.3
            this.ctx.lineWidth = this.gaugeWidth
            this.ctx.beginPath()
            this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE, min, max)
            this.ctx.stroke()

            this.ctx.lineWidth = this.gaugeWidth
            this.ctx.globalAlpha = 0.2 + 0.2 * Math.abs(d-o) / (d<o?o-min:max-o)
            this.ctx.beginPath()
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.arc(this.width / 2, this.height / 2, this.minDimension / 2 - this.gaugeWidth - this.margin * PXSCALE, Math.min(o,d), Math.max(o,d))
            this.ctx.stroke()

            if (this.getProp('pips')) {
                this.ctx.globalAlpha = 1

                this.ctx.strokeStyle = this.colors.fg
                this.ctx.lineWidth = 2 * PXSCALE

                for (var pip of this.rangeKeys.concat(this.valueToPercent(this.originValue))) {
                    if ((pip == 0 || pip == 100) && this.maxAngle < 360) continue
                    let r1 = this.minDimension / 2 - this.gaugeWidth/2 - this.margin * PXSCALE,
                        r2 = this.minDimension / 2 - this.gaugeWidth * 1.5 - this.margin * PXSCALE,
                        a  = 2 * Math.PI - this.percentToAngle(pip)

                    this.ctx.beginPath()
                    this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
                    this.ctx.lineTo(r2 * Math.cos(a) + this.width / 2, this.height / 2 - r2 * Math.sin(a))
                    this.ctx.stroke()
                }
            }

            // knob
            this.ctx.fillStyle = this.colors.fg
            this.ctx.beginPath()
            this.ctx.globalAlpha = 1
            this.ctx.arc(this.width / 2, this.height / 2,  this.minDimension / 2 - this.gaugeWidth * 1.25, 0, Math.PI * 2)
            this.ctx.fill()

            this.ctx.fillStyle = this.colors.raised
            this.ctx.strokeStyle = this.colors.raised

            this.ctx.beginPath()
            this.ctx.globalAlpha = 1
            this.ctx.arc(this.width / 2, this.height / 2,  this.minDimension / 2 - this.gaugeWidth * 1.5, 0, Math.PI * 2)
            this.ctx.fill()

            this.ctx.globalAlpha = 1
            this.ctx.beginPath()
            this.ctx.arc(this.width / 2, this.height / 2,  this.minDimension / 2 - this.gaugeWidth * 2, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.lineWidth = 1 * PXSCALE
            this.ctx.stroke()
            this.ctx.globalAlpha = 0.3
            this.ctx.lineWidth = 1.1 * PXSCALE
            this.ctx.stroke()

            // cursor
            this.ctx.globalAlpha = 0.75
            this.ctx.strokeStyle = this.colors.knob
            this.ctx.lineWidth = 2 * PXSCALE

            let r1 = this.minDimension / 2 - this.gaugeWidth * 2 - this.margin * PXSCALE + 1.1 * PXSCALE,
                r2 = this.minDimension / 2 - this.gaugeWidth * 1.5 - this.margin * PXSCALE,
                a  = 2 * Math.PI - d

            this.ctx.beginPath()
            this.ctx.moveTo(r1 * Math.cos(a) + this.width / 2, this.height / 2 - r1 * Math.sin(a))
            this.ctx.lineTo(r2 * Math.cos(a) + this.width / 2, this.height / 2 - r2 * Math.sin(a))
            this.ctx.stroke()


        } else {


            var r = Math.max(this.minDimension / 2 - (30 + this.margin) * PXSCALE, 2 * PXSCALE)

            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.raised
            this.ctx.strokeStyle = this.colors.raised
            this.ctx.arc(this.width / 2, this.height / 2,  r, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.lineWidth = 1 * PXSCALE
            this.ctx.stroke()
            this.ctx.globalAlpha = 0.3
            this.ctx.lineWidth = 1.1 * PXSCALE
            this.ctx.stroke()
            this.ctx.globalAlpha = 1


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

}
