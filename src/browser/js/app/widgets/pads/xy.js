var _pads_base = require('./_pads_base'),
    Fader = require('./_fake_fader'),
    {clip} = require('../utils'),
    doubletab = require('../mixins/double_tap'),
    Input = require('../inputs/input')

var faderDefaults = Fader.defaults()

module.exports = class Xy extends _pads_base {

    static defaults() {

        return {
            type:'xy',
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

            _xy:'xy',

            input: true,
            pips: true,
            pointSize: 20,
            snap:false,
            spring:false,
            doubleTap:false,
            rangeX:{min:0,max:1},
            rangeY:{min:0,max:1},
            logScaleX:false,
            logScaleY:false,
            value:'',

            _osc:'osc',

            precision:2,
            address:'auto',
            touchAddress:'',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(options) {

        super(options)

        this.split = this.getProp('split')?
            typeof this.getProp('split') == 'object' && this.getProp('split').length == 2 ?
                this.getProp('split')
                : [this.getProp('address') + '/x', this.getProp('address') + '/y']
            : false

        this.faders = {
            x: new Fader({props:{
                ...faderDefaults,
                id:0,
                compact:true,
                pips:false,
                horizontal:true,
                height:'100%',
                width:'100%',
                value:this.getProp('value').length==2?this.getProp('value')[0]:'',
                snap:this.getProp('snap'),
                range:this.getProp('rangeX'),
                origin:'auto',
                precision:this.precision,
                logScale:this.getProp('logScaleX'),
                input:false
            }, cancelDraw: true}),
            y: new Fader({props:{
                ...faderDefaults,
                id:1,
                compact:true,
                pips:false,
                horizontal:false,
                height:'100%',
                width:'100%',
                value:this.getProp('value').length==2?this.getProp('value')[1]:'',
                snap:this.getProp('snap'),
                range:this.getProp('rangeY'),
                origin:'auto',
                precision:this.precision,
                logScale:this.getProp('logScaleY'),
                input:false
            }, cancelDraw: true}),
        }

        this.faders.x.margin = this.faders.y.margin = this.pointSize + 1

        this.value = [this.faders.x.value, this.faders.y.value]

        this.wrapper.append(this.faders.x.widget)
        this.wrapper.append(this.faders.y.widget)

        this.faders.x.on('change',(e)=>{
            e.stopPropagation = true
        })

        this.faders.y.on('change',(e)=>{
            e.stopPropagation = true
        })

        this.wrapper.on('draginit',(e, data, traversing)=>{
            this.faders.x.draginitHandleProxy(e, data, traversing)
            this.faders.y.draginitHandleProxy(e, data, traversing)
            this.dragHandle()
        })
        this.wrapper.on('drag',(e, data, traversing)=>{
            this.faders.x.dragHandleProxy(e, data, traversing)
            this.faders.y.dragHandleProxy(e, data, traversing)
            this.dragHandle()
        })

        if (this.getProp('spring')) {
            this.wrapper.on('dragend', ()=>{
                this.setValue([this.faders.x.springValue,this.faders.y.springValue],{sync:true,send:true,fromLocal:true})
            })
        }

        if (this.getProp('doubleTap')) {
            doubletab(this.wrapper, ()=>{
                this.setValue([this.faders.x.springValue,this.faders.y.springValue],{sync:true, send:true, fromLocal:true})
            })
        }

        if (this.getProp('input')) {

            this.input = new Input({
                props:{...Input.defaults(), precision:this.getProp('precision'), unit:this.getProp('unit')},
                parent:this, parentNode:this.widget
            })
            this.widget.append(this.input.widget)
            this.input.on('change', (e)=>{
                e.stopPropagation = true
                this.setValue(this.input.getValue(), {sync:true, send:true})
                this.showValue()
            })

        }

        this.setValue([0,0])

    }

    dragHandle(){

        var x = this.faders.x.value,
            y = this.faders.y.value


        if (x != this.value[0] || y != this.value[1]) {
            this.setValue([x, y],{send:true,sync:true,dragged:true})
        }

    }


    setValue(v, options={}) {

        if (!v || !v.length || v.length!=2) return
        if (this.touched && !options.dragged) return this.setValueTouchedQueue = [v, options]

        if (!options.dragged) {
            this.faders.x.setValue(v[0], {sync: false, send:false, dragged:false})
            this.faders.y.setValue(v[1], {sync: false, send:false, dragged:false})
        }

        this.value = [
            this.faders.x.value,
            this.faders.y.value
        ]

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

        this.batchDraw()

        this.showValue()

    }

    draw() {

        var pointSize = this.pointSize * PXSCALE,
            margin = (this.pointSize + 1) * PXSCALE,
            x = this.faders.x.percentToCoord(this.faders.x.percent),
            y = this.faders.y.percentToCoord(this.faders.y.percent)

        this.clear()

        this.ctx.lineWidth = PXSCALE
        this.ctx.fillStyle = this.colors.custom
        this.ctx.strokeStyle = this.colors.custom


        if (this.getProp('pips')) {
            this.ctx.globalAlpha = 0.1
            this.ctx.beginPath()
            this.ctx.rect(margin + 0.5, margin + 0.5, this.width - margin * 2 - 1, this.height - margin * 2 - 1)
            this.ctx.stroke()

            this.ctx.beginPath()
            for (var pip of this.faders.x.rangeKeys.concat(this.faders.x.valueToPercent(this.faders.x.originValue))) {
                if (pip == 0 || pip == 100) continue
                var xpip = Math.round(2 * this.faders.x.percentToCoord(pip)) / 2
                this.ctx.moveTo(xpip, margin + 0.5)
                this.ctx.lineTo(xpip, this.height - margin - 0.5)
            }
            for (pip of this.faders.y.rangeKeys.concat(this.faders.y.valueToPercent(this.faders.y.originValue))) {
                if (pip == 0 || pip == 100) continue
                var ypip = Math.round(2 * this.faders.y.percentToCoord(pip)) / 2
                this.ctx.moveTo(margin + 0.5, ypip)
                this.ctx.lineTo(this.width - margin - 0.5, ypip)
            }
            this.ctx.stroke()

        } else {

            this.clearRect = [x - margin, y - margin, margin * 2, margin * 2]

        }


        this.ctx.globalAlpha = 0.7

        this.ctx.beginPath()
        this.ctx.arc(x, y, pointSize, Math.PI * 2, false)
        this.ctx.stroke()

        this.ctx.globalAlpha = 1
        this.ctx.lineWidth = 1.5 * PXSCALE

        this.ctx.beginPath()
        this.ctx.arc(x, y, pointSize / 2, Math.PI * 2, false)
        this.ctx.stroke()

    }

    showValue() {

        if (this.getProp('input')) this.input.setValue(this.value)

    }

}
