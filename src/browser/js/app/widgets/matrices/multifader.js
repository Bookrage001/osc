var _matrices_base = require('./_matrices_base')

module.exports = class Multifader extends _matrices_base {

    static options() {

        return {
            type:'multifader',
            id:'auto',

            _matrix:'Matrix',

            strips:2,
            start:0,

            _style:'style',

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

            _behaviour:'behaviour',

            traversing:true,

            _osc:'osc',

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

    }

    constructor(widgetData) {

        super(...arguments)

        widgetData.strips = parseInt(widgetData.strips)

        if (widgetData.horizontal) {
            this.widget.addClass('horizontal')
        }

        var strData = JSON.stringify(widgetData)

        var	parsers = require('../../parser'),
            parsewidgets = parsers.widgets

        for (var i=widgetData.start; i<widgetData.strips+widgetData.start;i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'fader'
            data.id = widgetData.id + '/' + i
            data.label = i
            data.address = widgetData.split ? widgetData.address + '/' + i : widgetData.address
            data.preArgs = widgetData.split ? widgetData.preArgs : [i].concat(widgetData.preArgs)
            data.color = typeof widgetData.color == 'object' ? '' + widgetData.color[i % widgetData.color.length] : widgetData.color

            var element = parsewidgets([data],this.widget)
            element[0].style.setProperty(widgetData.horizontal?'height':'width', 100/widgetData.strips + '%')
            element[0].classList.add('not-editable')

            if (widgetData.traversing) element.find('.fader-wrapper').off('drag')

            this.value[i-widgetData.start] = widgetData.range.min

        }

        if (widgetData.traversing) this.widget.enableTraversingGestures()

    }

}
