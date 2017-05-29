var _widgets_base = require('../common/_widgets_base'),
    osc = require('../../osc')

module.exports = class Push extends _widgets_base {

    static options() {

        return {
            type:'push',
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
            norelease:false,
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

        this.state = 0
        this.active = 0
        this.lastChanged = 'state'

        this.widget.on('drag',function(e){e.stopPropagation()})
        this.widget.on('draginit.push',()=>{
            this.widget.off('draginit.push')
            this.fakeclick()
        })

        this.value = this.getOption('off')

    }

    updateValue(){

        this.value = this[this.lastChanged] ?
        this.getOption('on') != null && this.getOption('on').value !== undefined ? this.getOption('on').value : this.getOption('on')
        :
        this.getOption('off') != null && this.getOption('off').value !== undefined ? this.getOption('off').value : this.getOption('off')

    }

    fakeclick(){

        if (!this.active) this.setValuePrivate(this.getOption('on'),{send:true,sync:true})
        this.widget.on('dragend.push',()=>{
            this.setValuePrivate(this.getOption('off'),{send:true,sync:true})
            this.widget.off('dragend.push')
            this.widget.on('draginit.push',()=>{
                this.widget.off('draginit.push')
                this.fakeclick()
            })
        })

    }

    setValuePrivate(v,options={}) {

        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getOption('on') || (this.getOption('on') != null && v === this.getOption('on').value && v !== undefined)) {
            this.widget.addClass('active')
            this.active = 1
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(v)
            if (options.sync) this.widget.trigger({type:'sync',id:this.getOption('id'),widget:this.widget, linkId:this.getOption('linkId'), options:options})
        } else if (v===this.getOption('off') || (this.getOption('off') != null && v === this.getOption('off').value && v !== undefined)) {
            this.widget.removeClass('active')
            this.active = 0
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(v, this.getOption('norelease'))
            if (options.sync) this.widget.trigger({type:'sync',id:this.getOption('id'),widget:this.widget, linkId:this.getOption('linkId'), options:options})
        }

    }

    setValue(v,options={}) {

        if (!options.fromExternal) {
            this.setValuePrivate(v,options)
            return
        }
        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getOption('on') || (this.getOption('on') != null && v === this.getOption('on').value && v !== undefined)) {
            this.widget.addClass('on')
            this.state = 1
            if (options.send) this.sendValue(v)
            this.lastChanged = 'state'
            if (options.sync) this.widget.trigger({type:'sync',id:this.getOption('id'),widget:this.widget, linkId:this.getOption('linkId'),options:options})
        } else if (v===this.getOption('off') || (this.getOption('off') != null && v === this.getOption('off').value && v !== undefined)) {
            this.widget.removeClass('on')
            this.state = 0
            if (options.send) this.sendValue(v)
            this.lastChanged = 'state'
            if (options.sync) this.widget.trigger({type:'sync',id:this.getOption('id'),widget:this.widget, linkId:this.getOption('linkId'),options:options})
        }

    }

    sendValue(v, norelease) {

        if (!norelease) {

            osc.send({
                h: this.hash,
                v: this.value
            })

        } else {

            osc.sync({
                h: this.hash,
                v: this.value
            })

        }

    }

}
