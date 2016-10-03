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
    color:'auto',
    compact:false,
    css:'',


    separator2:'osc',

    range:{min:0,max:1},
    logScale:false,
    precision:2,
    path:'auto',
    preArgs:[],
    target:[]
}


var Multifader = function(widgetData) {

    _matrices_base.apply(this,arguments)

    for (var i=0;i<widgetData.strips;i++) {
        var data = {
            type:'fader',
            id: widgetData.id + '/' + i,
            label:i,
            horizontal:false,
            snap:true,
            range:widgetData.range,
            logScale:widgetData.logScale,
            precision:widgetData.precision,
            path:widgetData.path + '/' + i,
            preArgs:widgetData.preArgs,
            target:widgetData.target,
            noPip:true,
            compact:widgetData.compact
        }
        var element = parsewidgets([data],this.widget)
        element[0].setAttribute('style',`width:${100/widgetData.strips}%`)
        element[0].classList.add('not-editable')
        element.find('.fader-wrapper').off('drag')

        this.value[i] = widgetData.range.min

    }
}

Multifader.prototype = Object.create(_matrices_base.prototype)

Multifader.prototype.constructor = Multifader

module.exports.create = function(widgetData) {
    var multifader = new Multifader(widgetData)
    return multifader.widget
}
