var {iconify} = require('../../utils'),
    _widgets_base = require('../common/_widgets_base')


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

var Text = module.exports.Text = function(widgetData,container) {

    _widgets_base.apply(this,arguments)


    this.widget = $(`
            <div class="text">
            </div>
            `)

	this.defaultValue = widgetData.label===false?
                            widgetData.id:
                            widgetData.label=='auto'?
                                widgetData.id:
                                widgetData.label

    this.value = this.defaultValue


    if (this.widgetData.vertical) this.widget.addClass('vertical')

    this.setValue(this.value)

}

Text.prototype = Object.create(_widgets_base.prototype)

Text.prototype.constructor = Text

Text.prototype.setValue = function(v){

    this.value = typeof v=='object' && !v.length ? this.defaultValue : v
    this.widget.html(iconify(this.value))

}

module.exports.create = function(widgetData, container) {
    var text = new Text(widgetData, container)
    return text
}
