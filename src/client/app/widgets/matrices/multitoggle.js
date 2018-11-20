var _matrix_base = require('./_matrix_base'),
    ipc = require('../../ipc'),
    parser = require('../../parser')

module.exports = class Multitoggle extends _matrix_base {

    static defaults() {

        return super.defaults({

            _matrix:'matrix',

            matrix: {type: 'array', value: [2,2], help: [
                'Defines the number of columns and and rows in the matrix. Each cell will contain a toggle button that will inherit its parent\'s properties and the following ones (where i is the toggle\'s index)',
                '- `id`: same as the widget\'s with /i appended to it',
                '- `label`: i',
                '- `address`: see split'
            ]},
            start: {type: 'integer', value: 0, help: 'First widget\'s index'},
            spacing: {type: 'integer', value: 0, help: 'Adds space between widgets'},
            traversing: {type: 'boolean', value: true, help: 'Set to `false` to disable traversing gestures'},

            _toggle: 'toggle',

            led: {type: 'boolean', value: false, help: 'Set to `true` to display the toggle\'s state with a led'},
            on: {type: '*', value: 1, help: [
                'Set to `null` to send send no argument in the osc message',
                'Can be an `object` if the type needs to be specified (see preArgs)'
            ]},
            off: {type: '*', value: 0, help: [
                'Set to `null` to send send no argument in the osc message',
                'Can be an `object` if the type needs to be specified (see `preArgs`)'
            ]},

        }, [], {

            split: {type: 'boolean|string', value: false, help: [
                '`true`: the widget\'s index will be appended to the matrice\'s osc address',
                '`false`: it will be prepended to the widget\'s `preArgs`',
                '`string`: will be used to define the widgets\' addresses, replacing dollar signs (`$`) with their respective index (to insert the actual dollar sign, it must be escaped with a backslash (`\\$`))'
            ]}

        })

    }

    constructor(options) {

        super(options)

        ipc.send('errorLog', `[Warning]\n"${this.getProp('type')}" is deprecated and will be removed in the future, please use "matrix" instead.`)

        this.widget.style.setProperty('--columns', this.getProp('matrix')[0])
        this.widget.style.setProperty('--rows', this.getProp('matrix')[1])
        this.widget.style.setProperty('--spacing', this.getProp('spacing') + 'rem')

        var strData = JSON.stringify(options.props)
        var start = parseInt(this.getProp('start'))

        for (var i = start; i < this.getProp('matrix')[0] * this.getProp('matrix')[1] + start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'toggle'
            data.id = this.getProp('id') + '/' + i
            data.label = i
            data.css = ''

            data.target = '@{parent.target}'
            data.precision = '@{parent.precision}'

            if (!this.getProp('split')) {
                data.address = '@{parent.address}'
                data.preArgs = `#{
                    a = @{parent.preArgs};
                    b = typeof(a) == 'string' and a == '' ? [] : typeof(a) == 'Array' ? a : [a];
                    concat(b, [${i}])
                }`
            } else if (typeof this.getProp('split') === 'string' && this.getProp('split')[0] === '/' && /[^\\]\$/.test(this.getProp('split'))) {
                data.address = this.getProp('split').replace(/([^\\])(\$)/g,'$1' + i).replace(/\\\$/g, '$')
                data.preArgs = '@{parent.preArgs}'
            } else if (this.getProp('split')) {
                data.address = '@{parent.address}/' + i
                data.preArgs = '@{parent.preArgs}'
            }

            var toggle = parser.parse({
                data: data,
                parentNode: this.widget,
                parent: this
            })
            toggle._index = i - start
            toggle.container.classList.add('not-editable')

            this.value[i-start] = this.getProp('off')

        }

    }

}
