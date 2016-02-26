
module.exports.options = {
    type:'strip',
    id:'auto',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    horizontal:false,
    css:'',

    separator2:'children',

    widgets:[]
}
module.exports.create = function(widgetData,container) {

    var parsewidgets = require('../parser').widgets

    var widget = $(`
            <div class="strip">
            </div>
    `)
    if (widgetData.horizontal) {
        container.addClass('horizontal')
    } else {
        container.addClass('vertical')
    }
    parsewidgets(widgetData.widgets,widget)
    widget.getValue = function(){return}
    widget.setValue = function(){return}
    return widget
}
