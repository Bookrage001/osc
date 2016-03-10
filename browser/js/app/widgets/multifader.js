module.exports.options = {
    type:'multifader',
    id:'auto',

    separator0:'Matrix',

    strips:2,

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    css:'',


    separator2:'osc',

    range:{min:0,max:1},
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

	for (var i=0;i<widgetData.strips;i++) {
		var data = {
			type:'fader',
			id: widgetData.id + '_' + i,
			label:i,
            horizontal:false,
            absolute:true,
			range:widgetData.range,
			precision:widgetData.precision,
			path:widgetData.path + '/' + i,
            target:widgetData.target
		}
		var element = parsewidgets([data],widget)
		element[0].setAttribute('style',`width:${100/widgetData.strips}%`)
		element[0].classList.add('not-editable')
        element.find('.fader-wrapper').off('drag')


	}

	widget.delegateDrag()


    widget.getValue = function() {}
    widget.setValue = function() {}

    return widget
}
