var _switchers_base = require('./_switchers_base'),
    Switch = require('../buttons/switch')

var switchDefaults = Switch.defaults()

module.exports = class Switcher extends _switchers_base {

    static defaults() {

        return {
            type:'switcher',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _switcher:'Switcher',

            horizontal:false,
            linkedWidgets:'',
            values:['A', 'B'],
            value:'A',

            _osc:'osc',

            address:'auto',
            preArgs:[],
            target:[]
        }

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
        }})

        this.switch.sendValue = ()=>{}

        this.widget.appendChild(this.switch.widget)

        this.switch.on('change', (e)=>{

            e.stopPropagation = true
            e.options.fromSelf = true

            this.setValue(this.switch.getValue(), e.options)

        })


    }

    setValue(v, options={}) {

        super.setValue(...arguments)

        if (!options.fromSelf) this.switch.setValue(this.value._selected)

    }


}
