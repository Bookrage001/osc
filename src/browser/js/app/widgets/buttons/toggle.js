var _widgets_base = require('../common/_widgets_base')

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

        this.widget.value = this.widget.find('span')
        this.widget.state = 0

        this.widget.on('drag',(e)=>{e.stopPropagation()})
        this.widget.on('draginit.toggle',()=>{
            this.widget.off('draginit.toggle')
            this.fakeclick()
        })

        if (this.getProp('led')) this.container.addClass('led')

        this.classHolders = this.widget.add(this.container)

        this.value = this.getProp('off')

    }

    fakeclick() {

        var newVal = this.widget.state?this.getProp('off'):this.getProp('on')
        this.setValue(newVal,{sync:true,send:true})
        this.widget.on('dragend.toggle',()=>{
            this.widget.off('dragend.toggle')
            this.widget.on('draginit.toggle',()=>{
                this.widget.off('draginit.toggle')
                this.fakeclick()
            })
        })

    }


    setValue(v,options={}) {

        if (v===this.getProp('on') || (this.getProp('on') != null && v.value === this.getProp('on').value && v.value !== undefined)) {
            this.classHolders.addClass('on')
            this.widget.state = 1
            this.value = this.getProp('on')
            if (options.send) this.sendValue()
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v.value === this.getProp('off').value && v.value !== undefined)) {
            this.classHolders.removeClass('on')
            this.widget.state = 0
            this.value = this.getProp('off')
            if (options.send) this.sendValue()
        }

        if (options.sync) this.widget.trigger({type:'change',id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'), options})

    }

}
