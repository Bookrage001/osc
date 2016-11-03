var _pads_base = require('./_pads_base'),
    Fader = require('./_fake_fader'),
    {clip, hsbToRgb, rgbToHsb} = require('../utils')


module.exports.options = {
    type:'rgb',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    css:'',

    separator2:'behaviour',

    snap:false,

    separator3:'osc',

    precision:0,
    address:'auto',
    preArgs:[],
    split:false,
    target:[]
}

var Rgb = module.exports.Rgb = function(widgetData) {

    _pads_base.apply(this,arguments)

    this.split = this.widgetData.split?
                    typeof this.widgetData.split == 'object'?
                        this.widgetData.split
                        : {r: this.widgetData.address + '/r', g: this.widgetData.address + '/g', b: this.widgetData.address + '/b'}
                    : false

    this.widget.append(`
        <div class="hue-wrapper"></div>
        <div class="labels row">
            <span class="input">R</span>
            <span class="input">G</span>
            <span class="input">B</span>
        </div>
        <div class="row">
            <div class="input r"></div>
            <div class="input g"></div>
            <div class="input b"></div>
        </div>
    `)

    this.hueWrapper = this.widget.find('.hue-wrapper')

    this.faders = {
        h: new Fader({
            id:'h',
            compact:false,
            noPip:true,
            horizontal:true,
            snap:widgetData.snap,
            range:{min:0,max:360},
            precision:2
        }),
        s: new Fader({
            id:'s',
            compact:true,
            horizontal:true,
            snap:widgetData.snap,
            range:{min:0,max:100},
            precision:2

        },true),
        b: new Fader({
            id:'b',
            compact:true,
            horizontal:false,
            snap:widgetData.snap,
            range:{min:0,max:100},
            precision:2
        },true)
    }

    this.faders.h.margin = 0

    this.inputs = [
        this.widget.find('.r').fakeInput({align:'center'}),
        this.widget.find('.g').fakeInput({align:'center'}),
        this.widget.find('.b').fakeInput({align:'center'})
    ]

    this.value = []
    this.hsb = {h:0,s:0,b:0}

    this.wrapper.append(this.faders.s.widget)
    this.wrapper.append(this.faders.b.widget)

    this.hueWrapper.append(this.faders.h.widget)

    this.wrapper.on('sync',(e)=>{
        e.stopPropagation()
    })

    this.faders.h.widget.on('sync',(e)=>{
        e.stopPropagation()
        this.dragHandle(true)
    })

    this.wrapper.on('draginit',(e, data, traversing)=>{
        this.faders.s.draginitHandleProxy(e, data, traversing)
        this.faders.b.draginitHandleProxy(e, data, traversing)
        this.dragHandle()
    })
    this.wrapper.on('drag',(e, data, traversing)=>{
        this.faders.s.dragHandleProxy(e, data, traversing)
        this.faders.b.dragHandleProxy(e, data, traversing)
        this.dragHandle()
    })


    this.inputs.forEach(function(input,i){
        input.change(()=>{
            this.value[i] = parseFloat(clip(this.inputs[i].val(),[0,255]))
            this.setValue(this.value,{send:true,sync:true})
        })
    },this)


    this.widget.getValue = () => {
        return [this.value[0], this.value[1], this.value[2]]
    }
    this.widget.setValue = (v, options) => {
        this.setValue(v, options)
    }

    this.setValue([0,0,0])
}


Rgb.prototype = Object.create(_pads_base.prototype)

Rgb.prototype.constructor = Rgb

Rgb.prototype.dragHandle = function(hue){
    var h =this.faders.h.value,
        s = this.faders.s.value,
        b = this.faders.b.value

    if (h != this.hsb.h ||s != this.hsb.s || b != this.hsb.b) {

        this.hsb.h = this.faders.h.value
        this.hsb.s = this.faders.s.value
        this.hsb.b = this.faders.b.value

        this.update({nohue:!hue})

        var rgb = hsbToRgb(this.hsb)
        if (rgb.r != this.value[0] || rgb.g != this.value[1] || rgb.b != this.value[2]) {
            this.setValue([rgb.r, rgb.g, rgb.b],{send:true,sync:true,dragged:true,nohue:!hue})
        }
    }

}

Rgb.prototype.setValue = function(v, options={}){

    if (!v || v.length!=3) return

    for (i in [0,1,2]) {
        v[i] = clip(v[i],[0,255])
    }

    var hsb = rgbToHsb({r:v[0],g:v[1],b:v[2]})

    if (!options.dragged) {
        this.faders.s.setValue(hsb.s, {sync: false, send:false, dragged:false})
        this.faders.b.setValue(hsb.b, {sync: false, send:false, dragged:false})
    }

    this.hsb = hsb
    this.value = v

    if (options.send) this.sendValue()
    if (options.sync) this.widget.trigger({type:'sync', id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})

    this.update({dragged:options.dragged, nohue:options.nohue || (v[0]==v[1]&&v[1]==v[2])})
}

Rgb.prototype.update = function(options={}) {

    if (!options.nohue && !options.dragged) {
        var hue = hsbToRgb({h:this.hsb.h,s:100,b:100})
        this.hue = `rgb(${Math.round(hue.r)},${Math.round(hue.g)},${Math.round(hue.b)})`
        this.wrapper[0].setAttribute('style',`background:${this.hue}`)
        this.faders.h.setValue(this.hsb.h, {sync: false, send:false, dragged:false})
    }

    for (i in this.inputs) [
        this.inputs[i].val(this.value[i].toFixed(this.widgetData.precision))
    ]

    this.draw()

}

Rgb.prototype.draw = function(){

    var x = clip(this.faders.s.percent / 100 * this.width,[0,this.width]),
        y = clip((1 - this.faders.b.percent / 100) * this.height,[0,this.height]),
        color = this.hsb.b > 70 && this.hsb.s < 30 ? '#555' : 'white'

    this.ctx.clearRect(0,0,this.width,this.height)

    this.ctx.fillStyle = color
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = PXSCALE

    this.ctx.save()
    this.ctx.globalAlpha = 0.3

    this.ctx.beginPath()
    this.ctx.arc(x, y, 10 * PXSCALE, Math.PI * 2, false)
    this.ctx.fill()

    this.ctx.globalAlpha = 0.1

    this.ctx.beginPath()
    this.ctx.moveTo(0,y)
    this.ctx.lineTo(this.width,y)
    this.ctx.moveTo(x,0)
    this.ctx.lineTo(x,this.height)
    this.ctx.stroke()

    this.ctx.restore()

    this.ctx.beginPath()
    this.ctx.arc(x, y, 4 * PXSCALE, Math.PI * 2, false)
    this.ctx.fill()
}

module.exports.create = function(widgetData) {
    var rgb = new Rgb(widgetData)
    return rgb.widget
}
