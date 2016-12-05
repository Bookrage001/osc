var _widgets_base = require('../common/_widgets_base')

module.exports.options = {
	type:'panel',
	id:'auto',

	separator1:'style',

	label:'auto',
	left:'auto',
	top:'auto',
	width:'auto',
	height:'auto',
	scroll:true,
	color:'auto',
	css:'',

	separator2:'chilren',

	widgets:[],
	tabs:[]
}

var Panel = module.exports.Panel = function(widgetData) {

	_widgets_base.apply(this,arguments)

	var	parsers = require('../../parser'),
		parsewidgets = parsers.widgets,
		parsetabs = parsers.tabs


	this.widget = $(`
            <div class="panel">
            </div>
            `)

    if (!widgetData.scroll) this.widget.addClass('noscroll')

    if (widgetData.tabs.length) {
        parsetabs(widgetData.tabs,this.widget)
		this.widget.addClass('has-tabs')
    } else {
        parsewidgets(widgetData.widgets,this.widget)
    }

}

_widgets_base.apply(this,arguments)

Panel.prototype = Object.create(_widgets_base.prototype)

Panel.prototype.constructor = Panel

module.exports.create = function(widgetData) {
    var panel = new Panel(widgetData)
    return panel.widget
}
