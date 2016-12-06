var _widgets_base = require('../common/_widgets_base')

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
    color:'auto',
    css:'',

    separator2:'children',

    widgets:[]
}

var Strip = module.exports.Strip = function(widgetData, container) {

	_widgets_base.apply(this,arguments)

    var parsewidgets = require('../../parser').widgets

    this.widget = $(`
            <div class="strip">
            </div>
    `)
    if (widgetData.horizontal) {
        container.addClass('horizontal')
    } else {
        container.addClass('vertical')
    }

    parsewidgets(widgetData.widgets,this.widget)


}

Strip.prototype = Object.create(_widgets_base.prototype)

Strip.prototype.constructor = Strip

module.exports.create = function(widgetData, container) {
    var strip = new Strip(widgetData, container)
    return strip
}
