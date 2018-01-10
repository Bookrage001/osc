var _widgets_base = require('../common/_widgets_base'),
    osc = require('../../osc')

module.exports = class Push extends _widgets_base {

    static defaults() {

        return {
            type:'push',
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

            _push: 'push',

            on:1,
            off:0,
            norelease:false,

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
        this.active = 0
        this.lastChanged = 'state'

        this.widget.on('drag',function(e){e.stopPropagation()})
        this.widget.on('draginit.push',()=>{
            this.widget.off('draginit.push')
            this.fakeclick()
        })
        this.classHolders = this.widget.add(this.container)

        this.value = this.getProp('off')


    }

    updateValue(){

        this.value = this[this.lastChanged] ?
        this.getProp('on') != null && this.getProp('on').value !== undefined ? this.getProp('on').value : this.getProp('on')
        :
        this.getProp('off') != null && this.getProp('off').value !== undefined ? this.getProp('off').value : this.getProp('off')

    }

    fakeclick(){

        if (!this.active) this.setValuePrivate(this.getProp('on'),{send:true,sync:true})
        this.widget.on('dragend.push',()=>{
            this.setValuePrivate(this.getProp('off'),{send:true,sync:true})
            this.widget.off('dragend.push')
            this.widget.on('draginit.push',()=>{
                this.widget.off('draginit.push')
                this.fakeclick()
            })
        })

    }

    setValuePrivate(v,options={}) {

        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getProp('on') || (this.getProp('on') != null && v === this.getProp('on').value && v !== undefined)) {
            this.widget.addClass('active')
            this.active = 1
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(v)
            if (options.sync) this.changed(options)
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v === this.getProp('off').value && v !== undefined)) {
            this.widget.removeClass('active')
            this.active = 0
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(v, this.getProp('norelease'))
            if (options.sync) this.changed(options)
        }

    }

    setValue(v,options={}) {

        if (!options.fromExternal) {
            this.setValuePrivate(v,options)
            return
        }
        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getProp('on') || (this.getProp('on') != null && v === this.getProp('on').value && v !== undefined)) {
            this.classHolders.addClass('on')
            this.state = 1
            if (options.send) this.sendValue(v)
            this.lastChanged = 'state'
            if (options.sync) this.widget.trigger({type:'change',id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'),options:options})
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v === this.getProp('off').value && v !== undefined)) {
            this.classHolders.removeClass('on')
            this.state = 0
            if (options.send) this.sendValue(v)
            this.lastChanged = 'state'
            if (options.sync) this.widget.trigger({type:'change',id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'),options:options})
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
