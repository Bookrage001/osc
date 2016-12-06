var {mapToScale} = require('../utils'),
    _widgets_base = require('../common/_widgets_base')


module.exports.options = {
    type:'led',
    id:'auto',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    css:'',

    separator2:'osc',

    range:{min:0,max:1},
    logScale:false,
    value:'',
    preArgs:[],
    address:'auto'
}

var Led = module.exports.Led = function(widgetData,container) {

    _widgets_base.apply(this,arguments)

    this.widget = $(`
            <div class="led">
                <div><span></span></div>
            </div>
            `),
    this.led = this.widget.find('span')


    this.setValue(this.widgetData.range.min)

}


Led.prototype = Object.create(_widgets_base.prototype)

Led.prototype.constructor = Led

Led.prototype.setValue = function(v){

    if (typeof v != 'number') return
    this.led.css('opacity',mapToScale(v,[this.widgetData.range.min,this.widgetData.range.max],[0,1],false,this.widgetData.logScale,true))

}

module.exports.create = function(widgetData, container) {
    var led = new Led(widgetData, container)
    return led
}
