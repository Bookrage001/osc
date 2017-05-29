var _widgets_base = require('../common/_widgets_base')

module.exports = class Toggle extends _widgets_base {

    static options() {

        return {
            type:'toggle',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _osc:'osc',

            on:1,
            off:0,
            value:'',
            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(widgetData) {

        var widgetHtml = `
            <div class="light"></div>
        `

        super(...arguments, widgetHtml)

        this.widget.value = this.widget.find('span')
        this.widget.state = 0

        this.widget.on('drag',(e)=>{e.stopPropagation()})
        this.widget.on('draginit.toggle',()=>{
            this.widget.off('draginit.toggle')
            this.fakeclick()
        })


        this.value = this.getOption('off')

    }

    fakeclick() {

        var newVal = this.widget.state?this.getOption('off'):this.getOption('on')
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

        if (v===this.getOption('on') || (this.getOption('on') != null && v.value === this.getOption('on').value && v.value !== undefined)) {
            this.widget.addClass('on')
            this.widget.state = 1
            this.value = this.getOption('on')
            if (options.send) this.sendValue()
        } else if (v===this.getOption('off') || (this.getOption('off') != null && v.value === this.getOption('off').value && v.value !== undefined)) {
            this.widget.removeClass('on')
            this.widget.state = 0
            this.value = this.getOption('off')
            if (options.send) this.sendValue()
        }

        if (options.sync) this.widget.trigger({type:'sync',id:this.getOption('id'),widget:this.widget, linkId:this.getOption('linkId'), options})

    }

}
