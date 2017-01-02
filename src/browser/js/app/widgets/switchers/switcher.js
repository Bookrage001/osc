var _switchers_base = require('./_switchers_base'),
    Switch = require('../buttons/switch')

module.exports = class Switcher extends _switchers_base {

    static options() {

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

    constructor(widgetData) {

        var widgetHtml = `
            <div class="switcher switch-container ${widgetData.horizontal ? 'horizontal' : ''}"></div>
        `

        super(...arguments, widgetHtml)

        this.switch = new Switch({
            label:false,
            values:widgetData.values,
            value: widgetData.value,
            horizontal:widgetData.horizontal
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
