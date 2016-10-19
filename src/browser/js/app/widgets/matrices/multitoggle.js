var _matrices_base = require('./_matrices_base')

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

    separator2:'behaviour',

    traversing:true,

    separator3:'osc',

    on:1,
    off:0,
    precision:2,
    path:'auto',
    preArgs:[],
    target:[]
}

var Multitoggle = module.exports.Multitoggle = function(widgetData) {

    _matrices_base.apply(this,arguments)


    var strData = JSON.stringify(widgetData)

    for (var i=0;i<widgetData.matrix[0]*widgetData.matrix[1];i++) {

        var data = JSON.parse(strData)

        data.top = data.left = data.height = data.width = 'auto'
        data.type = 'toggle'
        data.id = widgetData.id + '/' + i
        data.label = i
        data.path = widgetData.path + '/' + i

		var element = parsewidgets([data],this.widget)
		element[0].setAttribute('style',`width:${100/widgetData.matrix[0]}%`)
		element[0].classList.add('not-editable')

        this.value[i] = widgetData.off

	}

    if (widgetData.traversing) this.widget.enableTraversingGestures()

}

Multitoggle.prototype = Object.create(_matrices_base.prototype)

Multitoggle.prototype.constructor = Multitoggle

module.exports.create = function(widgetData) {
    var multitoggle = new Multitoggle(widgetData)
    return multitoggle.widget
}
