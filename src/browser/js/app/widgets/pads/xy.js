var _pads_base = require('./_pads_base'),
    Fader = require('./_fake_fader')

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
        }),
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

        })
    }

    this.inputs = [
        this.widget.find('.x').replaceWith(this.faders.x.input),
        this.widget.find('.y').replaceWith(this.faders.y.input)
    ]

    this.value = [this.faders.x.value, this.faders.y.value]

    this.wrapper.append(this.faders.x.widget)
    this.wrapper.append(this.faders.y.widget)

    this.widget.on('sync',(e)=>{

        if (e.id == this.widgetData.id) return

        e.stopPropagation()

        var {id, widget, options} = e
        var v = widget.getValue()

        if (this.value[id] != v) {
            this.value[id] = v
            if (options.send) this.sendValue()
            this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
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

    this.widget.getValue = () => {
        return [this.value[0], this.value[1]]
    }
    this.widget.setValue = (v,o) => {
        this.setValue(v,o)
    }


}


Xy.prototype = Object.create(_pads_base.prototype)

Xy.prototype.constructor = Xy

Xy.prototype.setValue = function(v, options){
    if (!v || v.length!=2) return
    this.faders.x.setValue(v[0], {sync: true, send:options.send})
    this.faders.y.setValue(v[1], {sync: true, send:options.send})
}

module.exports.create = function(widgetData) {
    var xy = new Xy(widgetData)
    return xy.widget
}
