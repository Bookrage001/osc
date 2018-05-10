var Widget = require('../common/widget'),
    doubletab = require('../mixins/double_tap')

class Toggle extends Widget {

    static defaults() {

        return {
            type:'toggle',
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

            _toggle: 'toggle',

            doubleTap: false,
            led: false,
            on:1,
            off:0,

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

        super({...options, html: '<div class="toggle"></div>'})

        this.state = 0
        this.active = false

        if (this.getProp('led')) this.container.classList.add('led')

        if (this.getProp('doubleTap')) {

            doubletab(this.widget, ()=>{
                var newVal = this.state?this.getProp('off'):this.getProp('on')
                this.setValue(newVal,{sync:true,send:true})
            })

        } else {

            this.on('draginit',()=>{
                if (this.active) return
                this.active = true
                var newVal = this.state?this.getProp('off'):this.getProp('on')
                this.setValue(newVal,{sync:true,send:true})
            }, {element: this.widget})

            this.on('dragend',()=>{
                this.active = false
            }, {element: this.widget})

        }

        this.value = this.getProp('off')

    }

    setValue(v,options={}) {

        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getProp('on') || (this.getProp('on') != null && v === this.getProp('on').value && v !== undefined)) {
            this.widget.classList.add('on')
            this.container.classList.add('on')
            this.state = 1
            this.value = this.getProp('on')
            if (options.send) this.sendValue()
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v === this.getProp('off').value && v !== undefined)) {
            this.widget.classList.remove('on')
            this.container.classList.remove('on')
            this.state = 0
            this.value = this.getProp('off')
            if (options.send) this.sendValue()
        }

        if (options.sync) this.changed(options)

    }

}

Toggle.dynamicProps = Toggle.prototype.constructor.dynamicProps.concat(
    'on',
    'off'
)

module.exports = Toggle
