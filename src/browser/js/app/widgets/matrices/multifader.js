var _matrix_base = require('./_matrix_base'),
    parser = require('../../parser'),
    widgetManager = require('../../managers/widgets')

module.exports = class Multifader extends _matrix_base {

    static defaults() {


        return super.defaults({

            _matrix:'matrix',

            strips: {type: 'integer', value: 2, help: [
                'Number of faders in the row, each fader will inherit its parent\'s properties and the following ones (where i is the fader\'s index in the row)',
                '- `id`: same as the widget\'s with /i appended to it',
                '- `label`: i',
                '- `address`: see split',
            ]},
            start: {type: 'integer', value: 0, help: 'First widget\'s index'},
            traversing: {type: 'boolean', value: true, help: 'Set to `false` to disable traversing gestures'},

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

        }, [], {

            split: {type: 'boolean|string', value: false, help: [
                '- `true`: the widget\'s index will be appended to the matrice\'s osc address',
                '- `false`: it will be prepended to the widget\'s preArgs',
                '- `string`: will be used to define the widgets\' addresses, replacing dollar signs (`$`) with their respective index (to insert the actual dollar sign, it must be escaped with a backslash (`\\$`))'
            ]}

        })

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
