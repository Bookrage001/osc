var utils = require('./utils'),
    mapToScale = utils.mapToScale

module.exports.options = {
    type:'led',
    id:'auto',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'green',
    css:'',

    separator2:'osc',

    range:{min:0,max:1},
    path:'auto'
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
            <div class="led">
                <div><span></span></div>
            </div>
            `),
        led = widget.find('span'),
        range = widgetData.range || {min:0,max:1}

    if (widgetData.color) led.css('background-color',widgetData.color)

    widget.setValue = function(v){
        led.css('opacity',mapToScale(v,[range.min,range.max],[0,1],widgetData.precision))
    }
    widget.getValue = function(){return}
    return widget
}
