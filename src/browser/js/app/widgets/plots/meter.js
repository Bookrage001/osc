var {Fader} = require('../sliders/fader')

module.exports.options = {
    type:'fader',
    id:'auto',

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    horizontal:false,
    color:'auto',
    css:'',

    separator3:'osc',

    range:{min:0,max:1},
    logScale:false,
    origin:'auto',
    value:'',
    address:'auto',
    preArgs:[]
}


var {Fader} = require('../sliders/fader')

var Meter = module.exports.Meter = function(widgetData, container){

    var data = widgetData
    data.compact = true

    Fader.apply(this, arguments)

    this.input.hide()

    this.widget.addClass('meter')

    this.widget.off('mousewheel')
    this.canvas.off('draginit')
    this.canvas.off('drag')

}

Meter.prototype = Object.create(Fader.prototype)

Meter.prototype.constructor = Meter

Meter.prototype.sendValue = ()=>{}

module.exports.create = function(widgetData,container) {

    var meter = new Meter(widgetData, container)
    return meter
}
