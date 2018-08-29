var _switchers_base = require('./_switchers_base'),
    Switch = require('../buttons/switch')

var switchDefaults = Switch.defaults()

module.exports = class Switcher extends _switchers_base {

    static defaults() {

        return super.defaults({

            _switcher:'switcher',

            horizontal:false,
            linkedWidgets:'',
            values:['A', 'B'],

        }, [], {

            touchAddress:'',
            split:false

        })

    }

    constructor(options) {

        super({...options, html: '<div class="switcher"></div>'})

        if (this.getProp('horizontal')) this.widget.classList.add('horizontal')

        this.switch = new Switch({props:{
            ...switchDefaults,
            label:false,
            values:this.getProp('values'),
            value: this.getProp('value'),
            horizontal:this.getProp('horizontal')
        }, parent: this})

        this.switch.sendValue = ()=>{}

        this.widget.appendChild(this.switch.widget)

        this.switch.on('change', (e)=>{

            e.stopPropagation = true
            e.options.fromSelf = true

            this.setValue(this.switch.getValue(), e.options)

        })


    }

    setValue(v, options={}) {

        super.setValue(v, options)

        if (!options.fromSelf) this.switch.setValue(this.value._selected)

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'color':
                for (var w of [this.switch]) {
                    w.onPropChanged('color')
                }
                return

        }

    }

    onRemove() {
        this.switch.onRemove()
        super.onRemove()
    }

}
