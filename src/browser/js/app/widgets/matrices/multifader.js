var _matrices_base = require('./_matrices_base')

module.exports = class Multifader extends _matrices_base {

    static defaults() {

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

    constructor(options) {

        super(options)

        this.strips = parseInt(this.getProp('strips'))

        if (this.getProp('horizontal')) {
            this.widget.addClass('horizontal')
        }

        var strData = JSON.stringify(options.props)

        var parsers = require('../../parser'),
            parsewidgets = parsers.widgets

        for (var i = this.start; i < this.strips + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'fader'
            data.id = this.getProp('id') + '/' + i
            data.label = i
            data.address = this.getProp('split') ? this.getProp('address') + '/' + i : this.getProp('address')
            data.preArgs = this.getProp('split') ? this.getProp('preArgs') : [].concat(this.getProp('preArgs'), i)
            data.color = typeof this.getProp('color') == 'object' ? '' + this.getProp('color')[i % this.getProp('color').length] : this.getProp('color')
            data.css = ''

            var element = parsewidgets([data],this.widget)
            element[0].style.setProperty(this.getProp('horizontal')?'height':'width', 100/this.strips + '%')
            element[0].classList.add('not-editable')

            if (this.getProp('traversing')) element.find('canvas').off('drag')

            this.value[i-this.start] = this.getProp('range').min

        }

        if (this.getProp('traversing')) this.widget.enableTraversingGestures()

    }

}
