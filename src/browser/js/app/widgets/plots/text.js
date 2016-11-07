module.exports.options = {
    type:'text',
    id:'auto',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    vertical:false,
    color:'auto',
    css:'',

    separator2:'osc',

    value:'',
    preArgs:[],
    address:'auto',
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
            <div class="text">
            </div>
            `),
		label = widgetData.label===false?
                        widgetData.id:
                        widgetData.label=='auto'?
                            widgetData.id:
                            widgetData.label,
        text = label


    if (widgetData.vertical) widget.addClass('vertical')

    widget.setValue = function(v){
        text = typeof v=='object' && !v.length?label:v
		widget.text(text)
    }

    widget.getValue = function(){
        return text
    }

    widget.setValue(label)

    return widget
}
