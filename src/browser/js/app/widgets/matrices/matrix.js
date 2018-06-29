var _matrix_base = require('./_matrix_base'),
    parser = require('../../parser'),
    widgetManager = require('../../managers/widgets')

class Matrix extends _matrix_base {

    static defaults() {

        return {
            type:'matrix',
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

            widgetType: 'toggle',
            matrix: [2,2],
            start:0,
            spacing:0,
            traversing:true,
            borders:true,
            props:{},

            _value: 'value',
            default: '',
            value: '',

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            target:[],
            bypass:false
        }

    }

    constructor(options) {

        super(options)

        this.widget.style.setProperty('--columns', this.getProp('matrix')[0])
        this.widget.style.setProperty('--rows', this.getProp('matrix')[1])
        this.widget.style.setProperty('--spacing', this.getProp('spacing') + 'rem')

        if (this.getProp('borders') === false) this.widget.classList.add('noborders')

        if (parser.widgets[this.getProp('widgetType')]) {

            for (var i = this.start; i < this.getProp('matrix')[0] * this.getProp('matrix')[1] + this.start; i++) {

                var data = {
                    type: this.getProp('widgetType'),
                    id: this.getProp('id') + '/' + i,
                    label: i,
                    top: 'auto',
                    left: 'auto',
                    height: 'auto',
                    width: 'auto',
                    ...this.resolveProp('props', undefined, false, false, false, {'$':i})
                }

                var widget = parser.parse([data], this.widget, this)

                widget.container.classList.add('not-editable')

            }

        } else {

            this.errors.widgetType = this.getProp('widgetType') + ' is not a valid widget type'

        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'props':

                var hashes = [...this.childrenHashes]
                this.childrenHashes = []

                for (var i = 0; i < hashes.length; i++) {

                    let widget = widgetManager.widgets[hashes[i]],
                        data = this.resolveProp('props', undefined, false, false, false, {'$':i})

                    Object.assign(widget.props, data)
                    widget.updateProps(Object.keys(data), this)

                }

                if (!this.childrenHashes.length) {
                    // only dynamic props updated
                    this.childrenHashes = hashes
                } else {
                    // widgets recreated
                    for (i in this.childrenHashes) {
                        let widget = widgetManager.widgets[this.childrenHashes[i]]
                        widget.container.classList.add('not-editable')
                    }
                }

                return

        }

    }

}


Matrix.dynamicProps = Matrix.prototype.constructor.dynamicProps.concat(
    'props'
)

module.exports = Matrix
