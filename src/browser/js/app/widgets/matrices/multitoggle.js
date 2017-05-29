var _matrices_base = require('./_matrices_base')

module.exports = class Multitoggle extends _matrices_base {

    static options() {

        return {
            type:'multitoggle',
            id:'auto',

            _matrix: 'Matrix',

            matrix: [2,2],
            start:0,

            _style:'style',

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

        var parsers = require('../../parser'),
            parsewidgets = parsers.widgets

        for (var i = this.start; i < this.getOption('matrix')[0] * this.getOption('matrix')[1] + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'toggle'
            data.id = this.getOption('id') + '/' + i
            data.label = i
            data.address = this.getOption('split') ? this.getOption('address') + '/' + i : this.getOption('address')
            data.preArgs = this.getOption('split') ? this.getOption('preArgs') : [].concat(this.getOption('preArgs'), i)
            data.color = typeof this.getOption('color') == 'object' ? '' + this.getOption('color')[i % this.getOption('color').length] : this.getOption('color')
            data.css = ''

            var element = parsewidgets([data],this.widget)
            element[0].style.setProperty('width', 100/this.getOption('matrix')[0] + '%')
            element[0].classList.add('not-editable')

            this.value[i-this.start] = this.getOption('off')

        }

        if (this.getOption('traversing')) this.widget.enableTraversingGestures()

    }

}
