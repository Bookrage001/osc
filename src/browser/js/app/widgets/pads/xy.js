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

var Xy = function(widgetData) {

    _pads_base.apply(this,arguments)

    this.xFader = new Fader({
        compact:true,
        horizontal:true,
        height:'100%',
        width:'100%',
        snap:widgetData.snap,
        range:widgetData.rangeX,
        precision:widgetData.precision
    })
    this.yFader = new Fader({
        compact:true,
        horizontal:false,
        height:'100%',
        width:'100%',
        snap:widgetData.snap,
        range:widgetData.rangeY,
        precision:widgetData.precision

    })

    this.wrapper.append(this.xFader.widget)
    this.wrapper.append(this.yFader.widget)

    this.widget.on('sync',(data)=>{
        // console.log('sync:',data.widget.getValue())
    })

    this.wrapper.on('draginit',(e, data, traversing)=>{
        this.xFader.draginitHandleProxy(e, data, traversing)
        this.yFader.draginitHandleProxy(e, data, traversing)
    })
    this.wrapper.on('drag',(e, data, traversing)=>{
        this.xFader.dragHandleProxy(e, data, traversing)
        this.yFader.dragHandleProxy(e, data, traversing)
    })

}


Xy.prototype = Object.create(_pads_base.prototype)

Xy.prototype.constructor = Xy

module.exports.create = function(widgetData) {
    var xy = new Xy(widgetData)
    return xy.widget
}
