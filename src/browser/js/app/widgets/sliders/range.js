var {clip} = require('../utils'),
    _widgets_base = require('../common/_widgets_base'),
    Fader = require('./fader'),
    Input = require('../inputs/input')

var faderDefaults = Fader.defaults()

var RangeFader = class RangeFader extends Fader {

    constructor(options) {

        super(options)
        this.cancelDraw = options.cancelDraw

    }

    sendValue() {}

    draginitHandle() {

        this.percent = clip(this.percent,[
            this.valueToPercent(this.rangeValsMin),
            this.valueToPercent(this.rangeValsMax)
        ])

        super.draginitHandle(...arguments)
    }

    draw() {

        if (this.cancelDraw || !this.parent.faders) return

        var width = this.getProp('horizontal') ? this.height : this.width,
            height = !this.getProp('horizontal') ? this.height : this.width

        var d = Math.round(this.percentToCoord(this.valueToPercent(this.parent.faders[this.getProp('horizontal')?0:1].value))),
            d2 = Math.round(this.percentToCoord(this.valueToPercent(this.parent.faders[this.getProp('horizontal')?1:0].value))),
            m = Math.round(this.getProp('horizontal') ? this.height / 2 : this.width / 2)

        var dashed = this.getProp('dashed')

        this.clear()

        if (this.getProp('compact')) {

            this.ctx.globalAlpha = (dashed ? .3 : .2)  + 0.2 * Math.abs(d-d2) / height
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.beginPath()
            this.ctx.moveTo(m, d2)
            this.ctx.lineTo(m, d)
            this.ctx.lineWidth = width + 2 * PXSCALE
            if (dashed) this.ctx.setLineDash([PXSCALE, PXSCALE])
            this.ctx.stroke()
            if (dashed) this.ctx.setLineDash([])

            this.ctx.globalAlpha = 1
            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.knob
            this.ctx.rect(0, Math.min(d, height - PXSCALE), width, PXSCALE)
            this.ctx.rect(0, Math.min(d2, height - PXSCALE), width, PXSCALE)
            this.ctx.fill()

            this.clearRect = [0, 0, width, height]

        } else {

            this.ctx.lineWidth = 6 * PXSCALE

            this.ctx.beginPath()
            this.ctx.globalAlpha = 1
            this.ctx.strokeStyle = this.colors.light
            this.ctx.moveTo(m, this.margin * PXSCALE - 2 * PXSCALE)
            this.ctx.lineTo(m, height - this.margin * PXSCALE + 2 * PXSCALE)
            this.ctx.stroke()

            this.ctx.lineWidth = 4 * PXSCALE

            this.ctx.beginPath()
            this.ctx.globalAlpha = 1
            this.ctx.strokeStyle = this.colors.bg
            this.ctx.moveTo(m, this.margin * PXSCALE - 1 * PXSCALE)
            this.ctx.lineTo(m, height - this.margin * PXSCALE + 1 * PXSCALE)
            this.ctx.stroke()

            this.ctx.lineWidth = 2 * PXSCALE

            this.ctx.beginPath()
            this.ctx.strokeStyle = this.colors.track
            this.ctx.moveTo(m, this.margin * PXSCALE)
            this.ctx.lineTo(m, height - this.margin * PXSCALE)
            this.ctx.stroke()

            this.ctx.beginPath()
            this.ctx.globalAlpha = 0.7
            this.ctx.strokeStyle = this.colors.gauge
            this.ctx.moveTo(m, d2)
            this.ctx.lineTo(m, d)
            if (dashed) this.ctx.setLineDash([PXSCALE, PXSCALE])
            this.ctx.stroke()
            if (dashed) this.ctx.setLineDash([])

            this.ctx.globalAlpha = 1

            // high knob bg

            this.ctx.beginPath()
            this.ctx.rect(m - 9 * PXSCALE, d - 14 * PXSCALE, 18 * PXSCALE, 16 * PXSCALE)
            this.ctx.lineWidth = PXSCALE
            this.ctx.fillStyle = this.colors.bg
            this.ctx.fill()

            // low knob bg

            this.ctx.beginPath()
            this.ctx.rect(m - 9 * PXSCALE, d2 - PXSCALE, 18 * PXSCALE, 16 * PXSCALE)
            this.ctx.lineWidth = PXSCALE
            this.ctx.fillStyle = this.colors.bg
            this.ctx.fill()

            // high knob

            this.ctx.beginPath()
            this.ctx.rect(m - 8 * PXSCALE, d - 13 * PXSCALE, 16 * PXSCALE, 14 * PXSCALE)
            this.ctx.fillStyle = this.colors.raised
            this.ctx.fill()
            this.ctx.lineWidth = PXSCALE

            this.ctx.beginPath()
            this.ctx.rect(m - 7.5 * PXSCALE, d - 12.5 * PXSCALE, 15 * PXSCALE, 13.5 * PXSCALE)
            this.ctx.lineWidth = PXSCALE
            this.ctx.strokeStyle = this.colors.light
            this.ctx.stroke()

            this.ctx.beginPath()
            this.ctx.rect(m - 8 * PXSCALE, d - 13 * PXSCALE, 16 * PXSCALE, PXSCALE)
            this.ctx.lineWidth = PXSCALE
            this.ctx.fillStyle = this.colors.light
            this.ctx.fill()

            this.ctx.beginPath()
            this.ctx.rect(m - 4 * PXSCALE, d, 8 * PXSCALE, PXSCALE)
            this.ctx.fillStyle = this.colors.knob
            this.ctx.fill()

            // low knob

            this.ctx.beginPath()
            this.ctx.rect(m - 8 * PXSCALE, d2, 16 * PXSCALE, 14 * PXSCALE)
            this.ctx.fillStyle = this.colors.raised
            this.ctx.fill()
            this.ctx.lineWidth = PXSCALE

            this.ctx.beginPath()
            this.ctx.rect(m - 7.5 * PXSCALE, d2, 15 * PXSCALE, 13.5 * PXSCALE)
            this.ctx.lineWidth = PXSCALE
            this.ctx.strokeStyle = this.colors.light
            this.ctx.stroke()

            this.ctx.beginPath()
            this.ctx.rect(m - 4 * PXSCALE, d2, 8 * PXSCALE, PXSCALE)
            this.ctx.fillStyle = this.colors.knob
            this.ctx.fill()



            this.clearRect = [width / 2 - 11 * PXSCALE, 0, 22 * PXSCALE, height]
        }
    }

}


module.exports = class Range extends _widgets_base {

    static defaults() {

        return {
            type:'range',
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

            _fader:'fader',

            horizontal:false,
            alignRight:false,
            input: true,
            compact:false,
            pips:true,
            snap:false,
            spring:false,
            range:{min:0,max:1},
            logScale:false,
            value:'',

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(options) {

        var html = `
            <div class="range">
                <div class="wrapper"></div>
            </div>
        `

        super({...options, html: html})

        this.split = this.getProp('split')?
            typeof this.getProp('split') == 'object' && this.getProp('split').length == 2 ?
                this.getProp('split')
                : [this.getProp('address') + '/low', this.getProp('address') + '/high']
            : false

        this.wrapper = this.widget.find('.wrapper')

        this.faders = [
            new RangeFader({props:{
                ...faderDefaults,
                compact:this.getProp('compact'),
                pips:false,
                alignRight:false,
                horizontal:this.getProp('horizontal'),
                height:'100%',
                width:'100%',
                value:this.getProp('value').length==2?this.getProp('value')[0]:'',
                snap:this.getProp('snap'),
                spring:this.getProp('spring'),
                range:this.getProp('range'),
                origin:'auto',
                precision:this.precision,
                logScale:this.getProp('logScale'),
                input:false
            }, cancelDraw: true, parent: this}),
            new RangeFader({props:{
                ...faderDefaults,
                compact:this.getProp('compact'),
                pips:this.getProp('pips'),
                alignRight:this.getProp('alignRight'),
                horizontal:this.getProp('horizontal'),
                height:'100%',
                width:'100%',
                value:this.getProp('value').length==2?this.getProp('value')[1]:'',
                snap:this.getProp('snap'),
                spring:this.getProp('spring'),
                range:this.getProp('range'),
                origin:'auto',
                precision:this.precision,
                logScale:this.getProp('logScale'),
                input:false
            }, cancelDraw: false, parent: this})
        ]

        this.wrapper.append(this.faders[0].widget)
        this.wrapper.append(this.faders[1].widget)

        this.on('change',(e)=>{

            if (e.widget == this) return

            e.stopPropagation = true

            var v = [
                this.faders[0].getValue(),
                this.faders[1].getValue()
            ]

            this.setValue(v, e.options)

        })

        this.touchMap = {}

        this.on('draginit',(e)=>{

            var id

            if (!this.touchMap[e.pointerId]) {

                var ndiff, diff = -1

                for (var i in this.faders) {

                    if (Object.values(this.touchMap).indexOf(i) != -1) continue

                    var coord = this.faders[i].percentToCoord(this.faders[i].valueToPercent(this.faders[i].value)) - (this.getProp('horizontal') ? -1 : 1) * (i == 0 ? -20 : 20)

                    ndiff = this.getProp('horizontal')?
                                Math.abs(e.offsetX - coord) :
                                Math.abs(e.offsetY - coord)

                    if (diff == -1 || ndiff < diff) {
                        id = i
                        diff = ndiff
                    }

                }

                this.touchMap[e.pointerId] = id


            } else if (e.traversing) {

                id = this.touchMap[e.pointerId]

            }

            if (!id) return

            this.faders[id].trigger('draginit', [e])

        }, {element: this.wrapper[0], multitouch: true})

        this.on('drag',(e)=>{

            var i = this.touchMap[e.pointerId]
            this.faders[i].trigger('drag', [e])

        }, {element: this.wrapper[0], multitouch: true})

        this.on('dragend',(e)=>{

            var i = this.touchMap[e.pointerId]
            this.faders[i].trigger('dragend', [e])
            delete this.touchMap[e.pointerId]

        }, {element: this.wrapper[0], multitouch: true})


        if (this.getProp('input')) {

            this.input = new Input({
                props:{...Input.defaults(),
                    precision:this.getProp('precision'),
                    unit:this.getProp('unit'),
                    vertical: this.getProp('compact') && !this.getProp('horizontal')
                },
                parent:this, parentNode:this.widget,
            })
            this.widget.append(this.input.widget)
            this.input.on('change', (e)=>{
                e.stopPropagation = true
                this.setValue(this.input.getValue(), {sync:true, send:true})
                this.showValue()
            })

            this.widget.on('fake-right-click',function(e){
                if (!EDITING) {
                    e.stopPropagation()
                    e.preventDefault()
                    this.input.canvas.focus()
                }
            }.bind(this))

        }


        if (this.getProp('horizontal')) {
            this.widget.add(this.container).addClass('horizontal')
        }
        if (this.getProp('alignRight') && !this.getProp('horizontal')) {
            this.widget.addClass('align-right')
        }
        if (this.getProp('compact')) {
            this.widget.addClass('compact')
        }
        if (this.getProp('pips')) {
            this.widget.addClass('has-pips')
        }

        this.setValue([
            this.faders[0].rangeValsMin,
            this.faders[1].rangeValsMax
        ])

    }

    setValue(v, options={}) {
        if (!v || !v.length || v.length!=2) return


        this.faders[0].rangeValsMax = v[1]
        this.faders[1].rangeValsMin = v[0]

        if (!options.dragged) {
            this.faders[0].setValue(v[0])
            this.faders[1].setValue(v[1])
        }

        this.value = [
            this.faders[0].getValue(),
            this.faders[1].getValue()
        ]


        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

        this.faders[1].batchDraw()

        this.showValue()


    }

    showValue() {

        if (this.getProp('input')) this.input.setValue(this.value)

    }

}
