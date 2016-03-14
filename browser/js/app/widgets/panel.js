module.exports.options = {
	type:'panel',
	id:'auto',

	separator1:'style',

	label:'auto',
	left:'auto',
	top:'auto',
	width:'auto',
	height:'auto',
	stretch:false,
	css:'',

	separator2:'chilren',

	widgets:[],
	tabs:[]
}
module.exports.create = function(widgetData,container) {

	var parser = require('../parser'),
		parsewidgets = parser.widgets,
		parsetabs = parser.tabs

	var widget = $(`
            <div class="panel">
            </div>
            `)

    if (widgetData.stretch) widget.addClass('stretch')

    if (widgetData.tabs.length) {
        parsetabs(widgetData.tabs,widget)
    } else {
        parsewidgets(widgetData.widgets,widget)
    }
    return widget
}
