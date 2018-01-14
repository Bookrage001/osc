var _widgets_base = require('../common/_widgets_base'),
    doubletab = require('../mixins/double_tap')


module.exports = class Toggle extends _widgets_base {

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
            value:'',

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        super({...options, html: '<div class="toggle"></div>'})

        this.state = 0
        this.active = false

        if (this.getProp('led')) this.container.addClass('led')

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
            }, {element: this.widget[0]})

            this.on('dragend',()=>{
                this.active = false
            }, {element: this.widget[0]})

        }

        this.classHolders = this.widget.add(this.container)

        this.value = this.getProp('off')

    }

    setValue(v,options={}) {

        if (v===this.getProp('on') || (this.getProp('on') != null && v.value === this.getProp('on').value && v.value !== undefined)) {
            this.classHolders.addClass('on')
            this.state = 1
            this.value = this.getProp('on')
            if (options.send) this.sendValue()
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v.value === this.getProp('off').value && v.value !== undefined)) {
            this.classHolders.removeClass('on')
            this.state = 0
            this.value = this.getProp('off')
            if (options.send) this.sendValue()
        }

        if (options.sync) this.changed(options)

    }

}
