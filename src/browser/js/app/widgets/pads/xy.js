var _pads_base = require('./_pads_base'),
    Fader = require('./_fake_fader'),
    {clip} = require('../utils')

module.exports.options = {
    type:'xy',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    css:'',

    separator2:'behaviour',

    snap:false,

    separator3:'osc',

    rangeX:{min:0,max:1},
    rangeY:{min:0,max:1},
    logScaleX:false,
    logScaleY:false,
    precision:2,
    path:'auto',
    preArgs:[],
    split:false,
    target:[]
}

var Xy = module.exports.Xy = function(widgetData) {

    _pads_base.apply(this,arguments)

    this.split = this.widgetData.split?
                    typeof this.widgetData.split == 'object'?
                        this.widgetData.split
                        : {x: this.widgetData.path + '/x', y: this.widgetData.path + '/y'}
                    : false

    this.widget.append(`
        <div class="labels row">
            <span class="input">X</span>
            <span class="input">Y</span>
        </div>
        <div class="row">
            <div class="input x"></div>
            <div class="input y"></div>
        </div>
    `)

    this.faders = {
        x: new Fader({
            id:0,
            compact:true,
            horizontal:true,
            height:'100%',
            width:'100%',
            snap:widgetData.snap,
            range:widgetData.rangeX,
            precision:widgetData.precision,
            logScale:widgetData.logScaleX
        }, true),
        y: new Fader({
            id:1,
            compact:true,
            horizontal:false,
            height:'100%',
            width:'100%',
            snap:widgetData.snap,
            range:widgetData.rangeY,
            precision:widgetData.precision,
            logScale:widgetData.logScaleY

        }, true)
    }

    this.inputs = [
        this.widget.find('.x').replaceWith(this.faders.x.input),
        this.widget.find('.y').replaceWith(this.faders.y.input)
    ]

    this.value = [this.faders.x.value, this.faders.y.value]

    this.wrapper.append(this.faders.x.widget)
    this.wrapper.append(this.faders.y.widget)

    this.wrapper.on('sync',(e)=>{
        e.stopPropagation()
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


    this.faders.x.input.change(()=>{
        var v = [this.faders.x.value, this.faders.y.value]
        this.setValue(v,{send:true,sync:true})
    })
    this.faders.y.input.change(()=>{
        var v = [this.faders.x.value, this.faders.y.value]
        this.setValue(v,{send:true,sync:true})
    })


    this.widget.getValue = () => {
        return [this.value[0], this.value[1]]
    }
    this.widget.setValue = (v, options) => {
        this.setValue(v, options)
    }


}


Xy.prototype = Object.create(_pads_base.prototype)

Xy.prototype.constructor = Xy

Xy.prototype.dragHandle = function(){
    var x = this.faders.x.value,
        y = this.faders.y.value


    if (x != this.value[0] || y != this.value[1]) {
        this.setValue([x, y],{send:true,sync:true,dragged:true})
    }
}

Xy.prototype.setValue = function(v, options={}){

    if (!v || v.length!=2) return

    if (!options.dragged) {
        this.faders.x.setValue(v[0], {sync: false, send:false, dragged:false})
        this.faders.y.setValue(v[1], {sync: false, send:false, dragged:false})
    }

    this.value = [
        this.faders.x.value,
        this.faders.y.value
    ]

    if (options.send) this.sendValue()
    if (options.sync) this.widget.trigger({type:'sync', id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})

    this.draw()
}

Xy.prototype.draw = function(){

    var x = clip(this.faders.x.percent / 100 * this.width,[0,this.width]),
        y = clip((1 - this.faders.y.percent / 100) * this.height,[0,this.height])

    this.ctx.clearRect(0,0,this.width,this.height)

    this.ctx.fillStyle = this.faders.x.colors.custom
    this.ctx.lineWidth = PXSCALE
    this.ctx.strokeStyle = this.faders.x.colors.custom

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
    var xy = new Xy(widgetData)
    return xy.widget
}
