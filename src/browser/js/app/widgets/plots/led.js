var {mapToScale} = require('../utils')

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
    preArgs:[],
    path:'auto'
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
            <div class="led">
                <div><span></span></div>
            </div>
            `),
        led = widget.find('span'),
        range = widgetData.range

    widget.setValue = function(v){
        if (typeof v != 'number') return
        led.css('opacity',mapToScale(v,[range.min,range.max],[0,1],widgetData.precision,widgetData.logScale,true))
    }

    widget.setValue(range.min)

    return widget
}
