var _pads_base = require('./_pads_base'),
    Fader = require('./_fake_fader'),
    {sendOsc} = require('../utils')



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

var Xy = function(widgetData) {

    _pads_base.apply(this,arguments)

    this.value = []

    this.faders = {
        x: new Fader({
            id:0,
            compact:true,
            horizontal:true,
            height:'100%',
            width:'100%',
            snap:widgetData.snap,
            range:widgetData.rangeX,
            precision:widgetData.precision
        }),
        y: new Fader({
            id:1,
            compact:true,
            horizontal:false,
            height:'100%',
            width:'100%',
            snap:widgetData.snap,
            range:widgetData.rangeY,
            precision:widgetData.precision

        })
    }

    this.wrapper.append(this.faders.x.widget)
    this.wrapper.append(this.faders.y.widget)

    this.widget.on('sync',(e)=>{
        e.stopPropagation()

        var {id, widget} = e
        var v = widget.getValue()

        if (this.value[id] != v) {
            this.value[id] = v
            this.sendValue()
        }
    })

    this.wrapper.on('draginit',(e, data, traversing)=>{
        this.faders.x.draginitHandleProxy(e, data, traversing)
        this.faders.y.draginitHandleProxy(e, data, traversing)
    })
    this.wrapper.on('drag',(e, data, traversing)=>{
        this.faders.x.dragHandleProxy(e, data, traversing)
        this.faders.y.dragHandleProxy(e, data, traversing)
    })

}


Xy.prototype = Object.create(_pads_base.prototype)

Xy.prototype.constructor = Xy

module.exports.create = function(widgetData) {
    var xy = new Xy(widgetData)
    return xy.widget
}
