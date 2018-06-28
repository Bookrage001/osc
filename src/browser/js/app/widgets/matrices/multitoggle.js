var _matrix_base = require('./_matrix_base'),
    parser = require('../../parser')

module.exports = class Multitoggle extends _matrix_base {

    static defaults() {

        return {
            type:'multitoggle',
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

            _matrix: 'Matrix',

            matrix: [2,2],
            start:0,
            spacing:0,
            traversing:true,
            led: false,
            on:1,
            off:0,

            _value: 'value',
            default: '',
            value: '',

            _osc: 'osc',

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

        this.widget.style.setProperty('--columns', this.getProp('matrix')[0])
        this.widget.style.setProperty('--rows', this.getProp('matrix')[1])
        this.widget.style.setProperty('--spacing', this.getProp('spacing') + 'rem')

        var strData = JSON.stringify(options.props)

        for (var i = this.start; i < this.getProp('matrix')[0] * this.getProp('matrix')[1] + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'toggle'
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

            var toggle = parser.parse([data], this.widget, this)
            toggle.container.classList.add('not-editable')

            this.value[i-this.start] = this.getProp('off')

        }

    }

}
