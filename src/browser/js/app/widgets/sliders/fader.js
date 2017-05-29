var {clip, mapToScale} = require('../utils'),
    _sliders_base = require('./_sliders_base')


module.exports = class Fader extends _sliders_base {

    static options() {

        return {
            type:'fader',
            id:'auto',
            linkId:'',

            _style:'style',

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

            _behaviour:'behaviour',

            snap:false,
            spring:false,

            _osc:'osc',

            range:{min:0,max:1},
            origin: 'auto',
            value:'',
            logScale:false,
            precision:2,
            meter:false,
            address:'auto',
            touchAddress:'',
            meterAddress:'',
            preArgs:[],
            target:[]
        }

    }

    constructor(widgetData, widgetContainer) {

        super(...arguments)

        this.widget.addClass('fader')
        this.margin = 15


        if (this.getOption('horizontal')) {
            this.widget.add(widgetContainer).addClass('horizontal')
            if (this.getOption('width') == 'auto' && this.getOption('left') != 'auto') {
                this.container.css({'width':'auto', 'right':'0'})
            }
        } else {
            if (this.getOption('height') == 'auto' && this.getOption('top') != 'auto') {
                this.container.css({'height':'auto', 'bottom':'0'})
            }
        }

        if (this.getOption('compact')) {
            this.widget.addClass('compact')
            this.margin = 0
        }

        if (this.getOption('alignRight') && !this.getOption('horizontal')) {
            this.widget.addClass('align-right')
        }

        if (!this.getOption('noPip') && !this.getOption('compact')) {

            this.widget.addClass('has-pips')

            var pips = $('<div class="pips"></div>').appendTo(this.widget.find('.wrapper'))
            var pipTexts = {}
            for (var k in this.rangeKeys) {
                pipTexts[this.rangeKeys[k]]=this.rangeLabels[k]
            }

            var pipsInner = ''
            for (var i=0;i<=100;i++) {
                if (pipTexts[i]==undefined) continue

                var pos = this.getOption('horizontal')?'left':'bottom';

                var piptext = `<span>${Math.abs(pipTexts[i])>=1000?pipTexts[i]/1000+'k':pipTexts[i]}</span>`

                var add = `
                <div class="pip val" style="${pos}:${i}%">${piptext}</div>
                `
                pipsInner = pipsInner + add
            }
            pips[0].innerHTML = pipsInner
        }


        if (this.getOption('meter')) {
            var parsewidgets = require('../../parser').widgets
            var data = {
                type:'meter',
                id: this.getOption('id') + '/meter',
                label:false,
                horizontal:this.getOption('horizontal'),
                range:this.getOption('range'),
                logScale:this.getOption('logScale'),
                address:this.getOption('meterAddress') || this.getOption('address') + '/meter',
                preArgs:this.getOption('preArgs'),
                color:this.getOption('color')
            }
            var element = parsewidgets([data],this.widget.find('.wrapper'))
            element[0].classList.add('not-editable')
            this.widget[0].classList.add('has-meter')
        }

    }

    draginitHandle(e, data, traversing) {

        super.draginitHandle(...arguments)

        this.percent = clip(this.percent,[0,100])

        if (!(traversing || this.getOption('snap'))) return

        this.percent = this.getOption('horizontal')?
        (data.offsetX - this.margin * PXSCALE) / (this.width - (this.margin * PXSCALE * 2)) * 100:
        (this.height - data.offsetY - this.margin * PXSCALE) / (this.height - (this.margin * PXSCALE * 2)) * 100

        // this.percent = clip(this.percent,[0,100])

        this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

    }

    dragHandle(e, data) {

        super.dragHandle(...arguments)

        this.percent = this.getOption('horizontal')?
        this.percent + ( data.speedX/(this.width - this.margin * PXSCALE * 2)) * 100:
        this.percent + (-data.speedY/(this.height - this.margin * PXSCALE * 2)) * 100

        this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true})

    }

    percentToCoord(percent) {

        if (this.getOption('horizontal')) {
            return clip(percent / 100,[0,1]) * (this.width - 2 * PXSCALE * this.margin)
        } else {
            return (this.height - this.margin * PXSCALE) - clip(percent / 100, [0,1]) * (this.height - 2 * PXSCALE * this.margin)
        }

    }

    resizeHandle(){
            super.resizeHandle(...arguments)

            if (this.getOption('compact')) {
                if (this.getOption('horizontal')) {
                    this.canvas[0].setAttribute('height', 1)
                } else {
                    this.canvas[0].setAttribute('width', 1)
                }
            }

            if (CANVAS_SCALING != 1) this.ctx.scale(CANVAS_SCALING, CANVAS_SCALING)

    }


    draw() {

        var d = Math.round(this.percentToCoord(this.percent)),
        o = Math.round(this.percentToCoord(this.valueToPercent(this.originValue))),
        m = Math.round(this.getOption('horizontal') ? this.height / 2 : this.width / 2)

        this.clear()

        if (this.getOption('horizontal')) {
            if (this.getOption('compact')) {

                if (!this.getOption('noPip')) {
                    this.ctx.lineWidth = PXSCALE
                    this.ctx.globalAlpha = 1

                    var x,
                        min = Math.min(d,o),
                        max = Math.max(d,o)

                    for (var i = 1;i < this.rangeKeys.length - 1;i++) {
                        x = Math.round(this.percentToCoord(this.rangeKeys[i])) + 0.5
                        this.ctx.strokeStyle = this.colors.bg
                        this.ctx.beginPath()
                        this.ctx.moveTo(x, 0)
                        this.ctx.lineTo(x, this.height)
                        this.ctx.stroke()
                    }
                }

                this.ctx.globalAlpha = 0.2 + 0.2 * Math.abs(d-o) / (d<o?o:this.width-o)
                this.ctx.strokeStyle = this.colors.gauge
                this.ctx.beginPath()
                this.ctx.moveTo(d, m)
                this.ctx.lineTo(o, m)
                this.ctx.lineWidth = this.height + 1
                this.ctx.stroke()

                this.ctx.globalAlpha = 1
                this.ctx.beginPath()
                this.ctx.fillStyle = this.colors.knob
                this.ctx.rect(Math.min(d,this.width-PXSCALE), 0, PXSCALE, this.height)
                this.ctx.fill()

            } else {

                this.ctx.lineWidth = Math.round(2 * PXSCALE)

                this.ctx.beginPath()
                this.ctx.strokeStyle = this.colors.track
                this.ctx.moveTo(this.margin * PXSCALE, m)
                this.ctx.lineTo(this.width - this.margin * PXSCALE, m )
                this.ctx.stroke()

                this.ctx.beginPath()
                this.ctx.strokeStyle = this.colors.gauge
                this.ctx.moveTo(d + this.margin * PXSCALE, m)
                this.ctx.lineTo(o + this.margin * PXSCALE, m)
                this.ctx.stroke()

                this.ctx.fillStyle = this.colors.knob

                this.ctx.globalAlpha = 0.3
                this.ctx.arc(d + this.margin * PXSCALE, m, 10 * PXSCALE, Math.PI * 2, false)
                this.ctx.fill()
                this.ctx.globalAlpha = 1

                this.ctx.beginPath()
                this.ctx.arc(d + this.margin * PXSCALE, m, 4 * PXSCALE, Math.PI * 2, false)
                this.ctx.fill()

                this.clearRect = [0, this.height / 2 - 11 * PXSCALE, this.width, 22 * PXSCALE]

            }


        } else {

            if (this.getOption('compact')) {

                if (!this.getOption('noPip')) {
                    this.ctx.lineWidth = PXSCALE
                    this.ctx.globalAlpha = 0.75

                    var y,
                        min = Math.min(d,o),
                        max = Math.max(d,o)

                    this.ctx.beginPath()
                    for (var i = 1;i < this.rangeKeys.length - 1;i++) {
                        y = Math.round(this.percentToCoord(this.rangeKeys[i])) + 0.5
                        this.ctx.strokeStyle = this.colors.bg
                        this.ctx.moveTo(0, y)
                        this.ctx.lineTo(this.width, y)
                    }
                    this.ctx.stroke()
                }

                this.ctx.globalAlpha = 0.2 + 0.2 * Math.abs(d-o) / (d<o?o:this.height-o)
                this.ctx.strokeStyle = this.colors.gauge
                this.ctx.beginPath()
                this.ctx.moveTo(m, d)
                this.ctx.lineTo(m, o)
                this.ctx.lineWidth = this.width + 1
                this.ctx.stroke()

                this.ctx.globalAlpha = 1
                this.ctx.beginPath()
                this.ctx.fillStyle = this.colors.knob
                this.ctx.rect(0, Math.min(d, this.height - PXSCALE), this.width, PXSCALE)
                this.ctx.fill()


            } else {

                this.ctx.lineWidth = Math.round(2 * PXSCALE)

                this.ctx.beginPath()
                this.ctx.strokeStyle = this.colors.track
                this.ctx.moveTo(m, this.margin * PXSCALE)
                this.ctx.lineTo(m, this.height - this.margin * PXSCALE)
                this.ctx.stroke()

                this.ctx.beginPath()
                this.ctx.strokeStyle = this.colors.gauge
                this.ctx.moveTo(m, d)
                this.ctx.lineTo(m, o)
                this.ctx.stroke()


                this.ctx.beginPath()
                this.ctx.fillStyle = this.colors.knob
                this.ctx.globalAlpha = 0.3
                this.ctx.arc(m, d, 10 * PXSCALE, Math.PI * 2,false)
                this.ctx.fill()
                this.ctx.globalAlpha = 1

                this.ctx.beginPath()
                this.ctx.arc(m, d, 4 * PXSCALE, Math.PI * 2,false)
                this.ctx.fill()

                this.clearRect = [this.width / 2 - 11 * PXSCALE, 0, 22 * PXSCALE, this.height]

            }
        }

    }

}
