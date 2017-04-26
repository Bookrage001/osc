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

        this.value = widgetData.off

    }

    updateValue(){

        this.value = this[this.lastChanged] ?
        this.widgetData.on != null && this.widgetData.on.value !== undefined ? this.widgetData.on.value : this.widgetData.on
        :
        this.widgetData.off != null && this.widgetData.off.value !== undefined ? this.widgetData.off.value : this.widgetData.off

    }

    fakeclick(){

        if (!this.active) this.setValuePrivate(this.widgetData.on,{send:true,sync:true})
        this.widget.on('dragend.push',()=>{
            this.setValuePrivate(this.widgetData.off,{send:true,sync:true})
            this.widget.off('dragend.push')
            this.widget.on('draginit.push',()=>{
                this.widget.off('draginit.push')
                this.fakeclick()
            })
        })

    }

    setValuePrivate(v,options={}) {

        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.widgetData.on || (this.widgetData.on != null && v === this.widgetData.on.value && v !== undefined)) {
            this.widget.addClass('active')
            this.active = 1
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(v)
            if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
        } else if (v===this.widgetData.off || (this.widgetData.off != null && v === this.widgetData.off.value && v !== undefined)) {
            this.widget.removeClass('active')
            this.active = 0
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(v, this.widgetData.norelease)
            if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
        }

    }

    setValue(v,options={}) {

        if (!options.fromExternal) {
            this.setValuePrivate(v,options)
            return
        }
        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.widgetData.on || (this.widgetData.on != null && v === this.widgetData.on.value && v !== undefined)) {
            this.widget.addClass('on')
            this.state = 1
            if (options.send) this.sendValue(v)
            this.lastChanged = 'state'
            if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId,options:options})
        } else if (v===this.widgetData.off || (this.widgetData.off != null && v === this.widgetData.off.value && v !== undefined)) {
            this.widget.removeClass('on')
            this.state = 0
            if (options.send) this.sendValue(v)
            this.lastChanged = 'state'
            if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId,options:options})
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
