module.exports.options = {
    type:'multitoggle',
    id:'auto',

	separator0: 'Matrix',

	matrix: [2,2],

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    css:'',

    separator2:'osc',

    on:1,
    off:0,
    precision:2,
    path:'auto',
    preArgs:[],
    target:[]
}
module.exports.create = function(widgetData,container) {

	var parsewidgets = require('../parser').widgets

    var widget = $(`
        <div class="matrix">
        </div>\
        `),
        $document = $(document)

    widget.value = []

	for (var i=0;i<widgetData.matrix[0]*widgetData.matrix[1];i++) {
		var data = {
			type:'toggle',
			id: widgetData.id + '/' + i,
			label:i,
			on:widgetData.on,
			off:widgetData.off,
			precision:widgetData.precision,
			path:widgetData.path + '/' + i,
            preArgs:widgetData.preArgs,
            target:widgetData.target
		}
		var element = parsewidgets([data],widget)
		element[0].setAttribute('style',`width:${100/widgetData.matrix[0]}%`)
		element[0].classList.add('not-editable')

        widget.value[i] = widgetData.off

	}



    widget.on('sync',function(e,id,w){
        if (id==widgetData.id) return
        widget.value[w.parent().index()] = w.getValue()
        widget.trigger('sync',{id:widgetData.id,widget:widget})
    })


    widget.getValue = function(){
        return widget.value
    }

    widget.enableTraversingGestures()

    return widget
}
