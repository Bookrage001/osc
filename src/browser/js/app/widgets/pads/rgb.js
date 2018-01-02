var _pads_base = require('./_pads_base'),
    Xy = require('./xy'),
    Fader = require('./_fake_fader'),
    {clip, hsbToRgb, rgbToHsb} = require('../utils'),
    Input = require('../inputs/input')

var faderDefaults = Fader.defaults(),
    xyDefaults = Xy.defaults()

module.exports = class Rgb extends _pads_base {

    static defaults() {

        return {
            type:'rgb',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            css:'',

            _rgb:'rgb',

            input: true,
            snap:false,
            spring:false,
            value:'',

            _osc:'osc',

            precision:0,
            address:'auto',
            touchAddress:'',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(options) {

        options.props.pointSize = 10

        super(options)

        this.split = this.getProp('split')?
                        typeof this.getProp('split') == 'object' && this.getProp('split').length == 3 ?
                            this.getProp('split')
                            : [this.getProp('address') + '/r', this.getProp('address') + '/g', this.getProp('address') + '/b']
                        : false

        this.hueWrapper = $(`<div class="hue-wrapper"></div>`).appendTo(this.widget)

        this.hue = new Fader({props:{
            ...faderDefaults,
            id:'h',
            compact:true,
            pips:false,
            horizontal:true,
            snap:this.getProp('snap'),
            range:{min:0,max:360},
            input:false,
            precision:2
        }, cancelDraw: false})
        this.hue.margin = this.pointSize
        this.hue.sendValue = ()=>{}
        this.hueWrapper.append(this.hue.widget)

        this.pad = new Xy({props:{
            ...xyDefaults,
            snap:this.getProp('snap'),
            spring:this.getProp('spring'),
            rangeX:{min:0,max:100},
            rangeY:{min:0,max:100},
            precision:2,
            pointSize: this.getProp('pointSize'),
            pips: false,
            input:false
        }})
        this.pad.sendValue = ()=>{}
        this.wrapper.append(this.pad.widget)


        this.value = []
        this.hsb = {h:0,s:0,b:0}

        this.wrapper.on('change',(e)=>{
            e.stopPropagation()
        })

        this.hue.widget.on('change',(e)=>{
            e.stopPropagation()
            this.dragHandle(true)
        })

        this.wrapper.on('change',(e)=>{
            e.stopPropagation()
            this.dragHandle()
        })

        if (this.getProp('input')) {

            this.input = new Input({
                props:{...Input.defaults(), precision:this.getProp('precision'), unit:this.getProp('unit')},
                parent:this, parentNode:this.widget
            })
            this.widget.append(this.input.widget)
            this.input.widget.on('change', (e)=>{
                e.stopPropagation()
                this.setValue(this.input.getValue(), {sync:true, send:true})
                this.showValue()
            })

        }

        this.setValue([0,0,0])

    }

    dragHandle(hue) {
        var h = this.hue.value,
            s = this.pad.value[0],
            b = this.pad.value[1]

        if (h != this.hsb.h ||s != this.hsb.s || b != this.hsb.b) {

            this.hsb.h = this.hue.value
            this.hsb.s = this.pad.value[0]
            this.hsb.b = this.pad.value[1]

            this.update({nohue:!hue})

            var rgb = hsbToRgb(this.hsb)
            if (rgb.r != this.value[0] || rgb.g != this.value[1] || rgb.b != this.value[2]) {
                this.setValue([rgb.r, rgb.g, rgb.b],{send:true,sync:true,dragged:true,nohue:!hue})
            }
        }

    }

    setValue(v, options={}) {

        if (!v || !v.length || v.length!=3) return
        if (this.touched && !options.dragged) return this.setValueTouchedQueue = [v, options]

        for (let i in [0,1,2]) {
            v[i] = clip(v[i],[0,255])
        }

        var hsb = rgbToHsb({r:v[0],g:v[1],b:v[2]})

        if (!options.dragged) {
            this.pad.setValue([hsb.s, hsb.b], {sync: false, send:false, dragged:false})
        }

        this.hsb = hsb
        this.value = v

        if (options.send) this.sendValue()
        if (options.sync) this.widget.trigger({type:'change', id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'), options:options})

        this.update({dragged:options.dragged, nohue:options.nohue || (v[0]==v[1]&&v[1]==v[2])})

    }

    update(options={}) {

        if (!options.nohue && !options.dragged) {
            var hue = hsbToRgb({h:this.hsb.h,s:100,b:100}),
                hueStr = `rgb(${Math.round(hue.r)},${Math.round(hue.g)},${Math.round(hue.b)})`
            this.canvas[0].setAttribute('style',`background-color:${hueStr}`)
            this.hue.setValue(this.hsb.h, {sync: false, send:false, dragged:false})
        }


        this.draw()

        this.showValue()

    }

    draw() {

    }

    showValue() {

        if (this.getProp('input')) this.input.setValue(this.value)

    }

}
