var _matrices_base = require('./_matrices_base')

module.exports = class Multipush extends _matrices_base {

    static options() {

        return {
            type:'multipush',
            id:'auto',

            _matrix: 'Matrix',

            matrix: [2,2],
            start:0,

            style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _behaviour:'behaviour',

            traversing:true,

            _osc:'osc',

            on:1,
            off:0,
            value:'',
            norelease:false,
            precision:2,
            address:'auto',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(widgetData) {

        super(...arguments)

        var strData = JSON.stringify(widgetData)

        var	parsers = require('../../parser'),
        parsewidgets = parsers.widgets

        for (var i=widgetData.start;i<widgetData.matrix[0]*widgetData.matrix[1]+widgetData.start;i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'push'
            data.id = widgetData.id + '/' + i
            data.label = i
            data.address = widgetData.split ? widgetData.address + '/' + i : widgetData.address
            data.preArgs = widgetData.split ? widgetData.preArgs : [i].concat(widgetData.preArgs)

            var element = parsewidgets([data],this.widget)
            element[0].setAttribute('style',`width:${100/widgetData.matrix[0]}%`)
            element[0].classList.add('not-editable')

            this.value[i-widgetData.start] = widgetData.off

        }

        if (widgetData.traversing) this.widget.enableTraversingGestures()

    }

}
