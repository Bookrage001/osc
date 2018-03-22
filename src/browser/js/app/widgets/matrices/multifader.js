var Matrix = require('./matrix'),
    parser = require('../../parser'),
    widgetManager = require('../../managers/widgets')

module.exports = class Multifader extends Matrix {

    static defaults() {

        return {
            type:'multifader',
            id:'auto',


            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _matrix:'Matrix',

            strips:2,
            start:0,
            traversing:true,

            _value: 'value',
            default: '',
            value: '',

            _fader: 'fader',

            range:{min:0,max:1},
            logScale:false,
            unit:'',
            origin: 'auto',
            snap:true,

            meter:false,
            alignRight:false,
            horizontal:false,
            pips:false,
            input:true,
            compact:false,
            dashed:false,


            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            split:false,
            target:[],
            bypass:false
        }

    }

    constructor(options) {

        super(options)

        this.strips = parseInt(this.getProp('strips'))

        if (this.getProp('horizontal')) {
            this.widget.classList.add('horizontal')
        }

        if (this.getProp('compact')) {
            this.widget.classList.add('compact')
        }

        var strData = JSON.stringify(options.props)

        for (var i = this.start; i < this.strips + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'fader'
            data.id = this.getProp('id') + '/' + i
            data.label = i
            data.css = ''

            if (!this.getProp('split')) {
                data.address = '@{parent.address}'
                data.preArgs = '#{concat(@{parent.preArgs},[' + i + '])}'
            } else if (typeof this.getProp('split') === 'string' && this.getProp('split')[0] === '/' && /[^\\]\$/.test(this.getProp('split'))) {
                data.address = this.getProp('split').replace(/([^\\])(\$)/g,'$1' + i).replace(/\\\$/g, '$')
                data.preArgs = '@{parent.preArgs}'
            } else if (this.getProp('split')) {
                data.address = '@{parent.address}/' + i
                data.preArgs = '@{parent.preArgs}'
            }

            var fader = parser.parse([data], this.widget, this)
            fader.container.classList.add('not-editable')

            this.value[i-this.start] = this.getProp('range').min

        }

    }

    onPropChanged(propName, options, oldPropValue) {

       if (super.onPropChanged(...arguments)) return true

       switch (propName) {

            case 'color':
                for (var h of this.childrenHashes) {
                    if (widgetManager.widgets[h]) {
                        widgetManager.widgets[h].onPropChanged('color')
                    }
                }
                return

        }

    }

}
