var _matrices_base = require('./_matrices_base')

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
    alignRight:false,
    horizontal:false,
    noPip:true,
    compact:false,
    color:'auto',
    css:'',

    separator2:'behaviour',

    traversing:true,

    separator3:'osc',

    range:{min:0,max:1},
    value:'',
    origin: 'auto',
    logScale:false,
    precision:2,
    meter:false,
    address:'auto',
    preArgs:[],
    split:false,
    target:[]
}


var Multifader = module.exports.Multifader = function(widgetData) {

    _matrices_base.apply(this,arguments)

    if (widgetData.horizontal) {
        this.widget.addClass('horizontal')
    }

    var strData = JSON.stringify(widgetData)

    for (var i=0;i<widgetData.strips;i++) {

        var data = JSON.parse(strData)

        data.top = data.left = data.height = data.width = 'auto'
        data.type = 'fader'
        data.id = widgetData.id + '/' + i
        data.label = i
        data.address = widgetData.split ? widgetData.address + '/' + i : widgetData.address
        data.preArgs = widgetData.split ? widgetData.preArgs : [i].concat(widgetData.preArgs)

        var element = parsewidgets([data],this.widget)
        element[0].setAttribute('style',`${widgetData.horizontal?'height':'width'}:${100/widgetData.strips}%`)
        element[0].classList.add('not-editable')

        if (widgetData.traversing) element.find('.fader-wrapper').off('drag')

        this.value[i] = widgetData.range.min

    }

    if (widgetData.traversing) this.widget.enableTraversingGestures()

}

Multifader.prototype = Object.create(_matrices_base.prototype)

Multifader.prototype.constructor = Multifader

module.exports.create = function(widgetData) {
    var multifader = new Multifader(widgetData)
    return multifader.widget
}
