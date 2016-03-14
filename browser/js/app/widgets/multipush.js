module.exports.options = {
    type:'multipush',
    id:'auto',

    separator0: 'Matrix',

    matrix: [2,2],

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    css:'',

    separator2:'osc',

    on:1,
    off:0,
    precision:2,
    path:'auto',
    target:[]
}
module.exports.create = function(widgetData,container) {

	var parsewidgets = require('../parser').widgets

    var widget = $(`
        <div class="matrix">
        </div>\
        `),
        $document = $(document)

	for (var i=0;i<widgetData.matrix[0]*widgetData.matrix[1];i++) {
		var data = {
			type:'push',
			id: widgetData.id + '_' + i,
			label:i,
			on:widgetData.on,
			off:widgetData.off,
			precision:widgetData.precision,
			path:widgetData.path + '/' + i,
            target:widgetData.target
		}
		var element = parsewidgets([data],widget)
		element[0].setAttribute('style',`width:${100/widgetData.matrix[0]}%`)
		element[0].classList.add('not-editable')

	}

	widget.delegateDrag()

    return widget
}
