var utils = require('./utils'),
    mapToScale = utils.mapToScale

module.exports.options = {
    type:'text',
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

    preArgs:[],
    path:'auto'
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
            <div class="text">
            </div>
            `),
		label = widgetData.label===false?widgetData.id:widgetData.label=='auto'?widgetData.id:widgetData.label=='auto'


    widget.setValue = function(v,send,sync){
		widget.text(v)
    }

    widget.setValue(label)

    return widget
}
