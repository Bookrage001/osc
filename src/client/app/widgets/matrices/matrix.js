var _matrix_base = require('./_matrix_base'),
    parser = require('../../parser'),
    {deepCopy} = require('../../utils')



class Matrix extends _matrix_base {

    static defaults() {

        return super.defaults({

            _matrix: 'matrix',

            widgetType: {type: 'string', value: 'toggle', help: 'Defines the type of the widgets in the matrix'},
            matrix: {type: 'array', value: [2,2], help: 'Defines the number of columns and and rows in the matrix'},
            start: {type: 'integer', value: 0, help: 'First widget\'s index'},
            spacing: {type: 'integer', value: 0, help: 'Adds space between widgets'},
            traversing: {type: 'boolean', value: true, help: 'Set to `false` to disable traversing gestures'},
            border: {type: 'boolean', value: true, help: 'Set to `false` to disables the widgets\' borders'},
            props: {type: 'object', value: {}, help: [
                'Defines a set of property to override the widgets\' defaults.',
                'Formulas in this field are resolved with an extra variable representing each widget\'s index: `$`',
                'Note: by default, the widgets inherit from the matrix\' `id` and osc properties (`id` and `address` are appended with `/$`)'
            ]}

        }, [], {})

    }

    constructor(options) {

        super(options)

        this.widget.style.setProperty('--columns', this.getProp('matrix')[0])
        this.widget.style.setProperty('--rows', this.getProp('matrix')[1])
        this.widget.style.setProperty('--spacing', this.getProp('spacing') + 'rem')

        if (this.getProp('borders') === false) this.widget.classList.add('noborders')

        this.start = parseInt(this.getProp('start'))

        if (parser.widgets[this.getProp('widgetType')]) {

            for (let i = 0; i < this.getProp('matrix')[0] * this.getProp('matrix')[1]; i++) {

                var props = this.resolveProp('props', undefined, false, false, false, {'$':i + this.start})
                var data = this.defaultProps(i + this.start)

                if (typeof props === 'object' && props !== null) {
                    Object.assign(data, props)
                }

                var widget = parser.parse({
                    data: data,
                    parentNode: this.widget,
                    parent: this
                })

                widget._index = i
                widget.container.classList.add('not-editable')

                this.value[i] = widget.getValue()

            }

        } else {

            this.errors.widgetType = this.getProp('widgetType') + ' is not a valid widget type'

        }

    }

    defaultProps(i) {

        return {
            type: this.getProp('widgetType'),
            id: '@{parent.id}/' + i,
            address: '@{parent.address}/' + i,
            preArgs: '@{parent.preArgs}',
            target: '@{parent.target}',
            precision: '@{parent.precision}',
            bypass: '@{parent.bypass}',
            label: i,
            top: 'auto',
            left: 'auto',
            height: 'auto',
            width: 'auto'
        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'props':

                for (let i = this.children.length - 1; i >= 0; i--) {

                    let data = this.resolveProp('props', undefined, false, false, false, {'$': i + this.start})

                    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
                        data = {}
                    }

                    if (typeof oldPropValue === 'object' && oldPropValue !== null) {
                        // if an overridden default props is removed, set it back to default
                        let overriddenDefaults,
                            widgetDefaults
                        for (var k in oldPropValue) {
                            if (data[k] === undefined) {
                                if (Matrix.overriddenDefaults.indexOf(k) !== -1) {
                                    overriddenDefaults = overriddenDefaults || this.defaultProps(i + this.start)
                                    data[k] = overriddenDefaults[k]
                                } else {
                                    widgetDefaults = widgetDefaults || parser.defaults[data.type || this.getProp('widgetType')]
                                    data[k] = deepCopy(widgetDefaults[k])
                                }
                            }
                        }
                    }

                    Object.assign(this.children[i].props, data)

                    this.children[i].updateProps(Object.keys(data), this, options)
                    // this.children[i] might have been recreated
                    this.children[i].container.classList.add('not-editable')

                }

                return

        }

    }

}

Matrix.overriddenDefaults = [
    'type', 'id', 'address', 'preArgs', 'target', 'precision', 'bypass',
    'label', 'top', 'left', 'height', 'width'
]

Matrix.dynamicProps = Matrix.prototype.constructor.dynamicProps.concat(
    'props'
)

module.exports = Matrix
