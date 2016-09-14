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

    preArgs:[],
    path:'auto',
    defaultText:''
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
            <div class="text">
            </div>
            `),
		label = widgetData.defaultText!==''?
                    widgetData.defaultText:
                    widgetData.label===false?
                        widgetData.id:
                        widgetData.label=='auto'?
                            widgetData.id:
                            widgetData.label,
        text = label


    if (widgetData.vertical) widget.addClass('vertical')

    widget.setValue = function(v,send,sync){
        text = typeof v=='object' && !v.length?label:v
		widget.text(text)
    }

    widget.getValue = function(){
        return text
    }

    widget.setValue(label)

    return widget
}
