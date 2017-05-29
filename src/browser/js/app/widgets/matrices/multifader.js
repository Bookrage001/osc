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
            snap:true,

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

        this.strips = parseInt(this.getOption('strips'))

        if (this.getOption('horizontal')) {
            this.widget.addClass('horizontal')
        }

        var strData = JSON.stringify(widgetData)

        var parsers = require('../../parser'),
            parsewidgets = parsers.widgets

        for (var i = this.start; i < this.strips + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'fader'
            data.id = this.getOption('id') + '/' + i
            data.label = i
            data.address = this.getOption('split') ? this.getOption('address') + '/' + i : this.getOption('address')
            data.preArgs = this.getOption('split') ? this.getOption('preArgs') : [].concat(this.getOption('preArgs'), i)
            data.color = typeof this.getOption('color') == 'object' ? '' + this.getOption('color')[i % this.getOption('color').length] : this.getOption('color')
            data.css = ''

            var element = parsewidgets([data],this.widget)
            element[0].style.setProperty(this.getOption('horizontal')?'height':'width', 100/this.strips + '%')
            element[0].classList.add('not-editable')

            if (this.getOption('traversing')) element.find('canvas').off('drag')

            this.value[i-this.start] = this.getOption('range').min

        }

        if (this.getOption('traversing')) this.widget.enableTraversingGestures()

    }

}
