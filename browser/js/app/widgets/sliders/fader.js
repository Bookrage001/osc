var {clip, mapToScale, sendOsc} = require('../utils'),
    _sliders_base = require('./_sliders_base')

var Fader = function(widgetData){

    _sliders_base.apply(this,arguments)
    this.widget.addClass('fader')
    this.margin = 20


    if (widgetData.horizontal) {
        this.widget.addClass('horizontal')
    }

    if (widgetData.compact) {
        this.widget.addClass('compact')
        this.margin = 0
    }

    if (widgetData.alignRight && !widgetData.horizontal) {
        this.widget.addClass('align-right')
    }

    if (!widgetData.noPip&&!widgetData.compact) {

        this.widget.addClass('has-pips')

        var pips = $('<div class="pips"></div>').appendTo(this.widget.find('.wrapper'))
        var pipTexts = {}
        for (k in this.rangeKeys) {
            pipTexts[this.rangeKeys[k]]=this.rangeLabels[k]
        }

        var pipsInner = ''
        for (var i=0;i<=100;i++) {
            if (pipTexts[i]==undefined) continue

            var pos = widgetData.horizontal?'left':'bottom';

            var piptext = `<span>${Math.abs(pipTexts[i])>=1000?pipTexts[i]/1000+'k':pipTexts[i]}</span>`

            var add = `
                    <div class="pip val" style="${pos}:${i}%">${piptext}</div>
                `
            pipsInner = pipsInner + add
        }
        pips[0].innerHTML = pipsInner
    }


    if (widgetData.meter) {
        var parsewidgets = require('../../parser').widgets
        var data = {
            type:'meter',
            id: widgetData.id + '/meter',
            label:false,
            horizontal:widgetData.horizontal,
            range:widgetData.range,
            logScale:widgetData.logScale,
            path:widgetData.path + '/meter',
            preArgs:widgetData.preArgs,
            color:widgetData.color
        }
        var element = parsewidgets([data],this.widget.find('.wrapper'))
		element[0].classList.add('not-editable')
        this.widget[0].classList.add('has-meter')
    }



}

Fader.prototype = Object.create(_sliders_base.prototype)

Fader.prototype.constructor = Fader

Fader.prototype.draginitHandle = function(e, data, traversing){

    this.percent = clip(this.percent,[0,100])

    if (!(traversing || this.widgetData.snap)) return

    this.percent = this.widgetData.horizontal?
        (data.offsetX - this.margin * PXSCALE) / (this.width - (this.margin * PXSCALE * 2)) * 100:
        (this.height - data.offsetY - this.margin * PXSCALE) / (this.height - (this.margin * PXSCALE * 2)) * 100

        // this.percent = clip(this.percent,[0,100])

    this.setValue(this.percentToValue(this.percent), true, true, true)

}

Fader.prototype.dragHandle = function(e, data) {

    this.percent = this.widgetData.horizontal?
        this.percent + ( data.speedX/(this.width - this.margin * PXSCALE * 2)) * 100:
        this.percent + (-data.speedY/(this.height - this.margin * PXSCALE * 2)) * 100

    this.percent = this.percent,[0,100]

    this.setValue(this.percentToValue(this.percent), true, true, true)

}

Fader.prototype.percentToCoord = function(percent) {
    if (this.widgetData.horizontal) {
        return clip(percent / 100,[0,1]) * (this.width - 2 * PXSCALE * this.margin)
    } else {
        return (this.height - this.margin * PXSCALE) - clip(percent / 100, [0,1]) * (this.height - 2 * PXSCALE * this.margin)

    }
}


Fader.prototype.draw = function(){

    var d = this.percentToCoord(this.percent),
        o = this.percentToCoord(this.valueToPercent(this.originValue))

    this.ctx.clearRect(0,0,this.width,this.height)

    if (this.widgetData.horizontal) {
        if (this.widgetData.compact) {


            this.ctx.save()
            this.ctx.globalAlpha = 0.3
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.beginPath()
            this.ctx.moveTo(d, this.height / 2)
            this.ctx.lineTo(o, this.height / 2)
            this.ctx.lineWidth = this.height
            this.ctx.stroke()
            this.ctx.restore()

            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.knob
            this.ctx.rect(Math.min(d,this.width-PXSCALE), 0, PXSCALE, this.height)
            this.ctx.fill()


        } else {

            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.track
            this.ctx.rect(this.margin * PXSCALE, this.height / 2 - 1 * PXSCALE, this.width - this.margin  * 2 * PXSCALE, 2 * PXSCALE)
            this.ctx.fill()

            this.ctx.beginPath()
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.moveTo(d + this.margin * PXSCALE, this.height / 2)
            this.ctx.lineTo(o + this.margin * PXSCALE, this.height / 2)
            this.ctx.lineWidth = 2 * PXSCALE
            this.ctx.stroke()

            this.ctx.fillStyle = this.colors.knob

            this.ctx.save()
            this.ctx.globalAlpha = 0.3
            this.ctx.arc(d + this.margin * PXSCALE, this.height / 2, 10 *PXSCALE, Math.PI * 2,false)
            this.ctx.fill()
            this.ctx.restore()

            this.ctx.beginPath()
            this.ctx.arc(d + this.margin * PXSCALE, this.height / 2, 4 * PXSCALE, Math.PI * 2,false)
            this.ctx.fill()
        }


    } else {

        if (this.widgetData.compact) {


            this.ctx.save()
            this.ctx.globalAlpha = 0.3
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.beginPath()
            this.ctx.moveTo(this.width / 2, d)
            this.ctx.lineTo(this.width / 2, o)
            this.ctx.lineWidth = this.width
            this.ctx.stroke()
            this.ctx.restore()

            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.knob
            this.ctx.rect(0, Math.min(d,this.height-PXSCALE), this.width, PXSCALE)
            this.ctx.fill()


        } else {

            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.track
            this.ctx.rect(this.width / 2 - 1 * PXSCALE, this.margin * PXSCALE, 2 * PXSCALE, this.height - this.margin *2 * PXSCALE)
            this.ctx.fill()

            this.ctx.beginPath()
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.moveTo(this.width / 2, d)
            this.ctx.lineTo(this.width / 2, o)
            this.ctx.lineWidth = 2 * PXSCALE
            this.ctx.stroke()


            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.knob
            this.ctx.save()
            this.ctx.globalAlpha = 0.3
            this.ctx.arc(this.width / 2, d, 10 *PXSCALE, Math.PI * 2,false)
            this.ctx.fill()
            this.ctx.restore()

            this.ctx.beginPath()
            this.ctx.arc(this.width / 2, d, 4 *PXSCALE, Math.PI * 2,false)
            this.ctx.fill()
        }
    }
}


module.exports.options = {
    type:'fader',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    alignRight:false,
    horizontal:false,
    noPip:false,
    compact:false,
    color:'auto',
    css:'',

    separator2:'behaviour',

    snap:false,

    separator3:'osc',

    range:{min:0,max:1},
    origin: 'auto',
    logScale:false,
    precision:2,
    meter:false,
    path:'auto',
    preArgs:[],
    target:[]
}

module.exports.create = function(widgetData,container) {

    var fader = new Fader(widgetData, container)
    return fader.widget
}
