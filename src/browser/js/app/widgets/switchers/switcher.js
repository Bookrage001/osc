var _switchers_base = require('./_switchers_base'),
    Switch = require('../buttons/switch')

module.exports = class Switcher extends _switchers_base {

    static defaults() {

        return {
            type:'switcher',
            id:'auto',
            linkId:'',

            _switcher:'Switcher',

            linkedWidgets:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            horizontal:false,
            color:'auto',
            css:'',

            _osc:'osc',

            values:['A', 'B'],
            value:'A',
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(props) {

        var widgetHtml = `
            <div class="switcher switch-container"></div>
        `

        super(...arguments, widgetHtml)

        if (this.getProp('horizontal')) this.widget.addClass('horizontal')

        this.switch = new Switch({
            label:false,
            values:this.getProp('values'),
            value: this.getProp('value'),
            horizontal:this.getProp('horizontal')
        },0)

        this.switch.sendValue = ()=>{}

        this.widget.append(this.switch.widget)

        this.switch.widget.on('sync', (e)=>{

            e.stopPropagation()

            var {widget, options} = e

            options.fromSelf = true

            this.setValue(this.switch.getValue(), options)

        })


    }

    setValue(v, options={}) {

        super.setValue(...arguments)

        if (!options.fromSelf) this.switch.setValue(this.value._selected)

    }


}
