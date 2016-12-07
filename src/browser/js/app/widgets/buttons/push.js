var _widgets_base = require('../common/_widgets_base'),
    $document = $(document),
    osc = require('../../osc')

module.exports.options = {
    type:'push',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    css:'',

    separator2:'osc',

    on:1,
    off:0,
    norelease:false,
    precision:2,
    address:'auto',
    preArgs:[],
    target:[]
}

var Push = module.exports.Push = function(widgetData,container) {

    _widgets_base.apply(this, arguments)


    this.widget = $(`
        <div class="light">
        </div>\
        `)

    this.state = 0
    this.active = 0
    this.lastChanged = 'state'

    this.widget.on('drag',function(e){e.stopPropagation()})
    this.widget.on('draginit.push',()=>{
        this.widget.off('draginit.push')
        this.fakeclick()
    })

}


Push.prototype = Object.create(_widgets_base.prototype)

Push.prototype.constructor = Push

Push.prototype.getValue = function(){

    return this[this.lastChanged] ?
        this.widgetData.on != null && this.widgetData.on.value !== undefined ? this.widgetData.on.value : this.widgetData.on
        :
        this.widgetData.off != null && this.widgetData.off.value !== undefined ? this.widgetData.off.value : this.widgetData.off

}

Push.prototype.fakeclick = function(){
    if (!this.active) this.setValuePrivate(this.widgetData.on,{send:true,sync:true})
    $document.on('dragend.push',()=>{
        this.setValuePrivate(this.widgetData.off,{send:true,sync:true})
        $document.off('dragend.push')
        this.widget.on('draginit.push',()=>{
            this.widget.off('draginit.push')
            this.fakeclick()
        })
    })
}

Push.prototype.setValuePrivate = function(v,options={}) {
    if (v===this.widgetData.on || (this.widgetData.on != null && v.value === this.widgetData.on.value && v.value !== undefined)) {
        this.widget.addClass('active')
        this.active = 1
        if (options.send) this.sendValue(v)
        this.lastChanged = 'active'
        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
    } else if (v===this.widgetData.off || (this.widgetData.off != null && v.value === this.widgetData.off.value && v.value !== undefined)) {
        this.widget.removeClass('active')
        this.active = 0
        if (options.send) this.sendValue(v, this.widgetData.norelease)
        this.lastChanged = 'active'
        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
    }
}

Push.prototype.setValue = function(v,options={}) {
    if (!options.fromExternal) {
        if (options.send || options.sync) this.setValuePrivate(v,options)
        return
    }
    if (v===this.widgetData.on || (this.widgetData.on != null && v.value === this.widgetData.on.value && v.value !== undefined)) {
        this.widget.addClass('on')
        this.state = 1
        if (options.send) this.sendValue(v)
        this.lastChanged = 'state'
        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId,options:options})
    } else if (v===this.widgetData.off || (this.widgetData.off != null && v.value === this.widgetData.off.value && v.value !== undefined)) {
        this.widget.removeClass('on')
        this.state = 0
        if (options.send) this.sendValue(v)
        this.lastChanged = 'state'
        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId,options:options})
    }
}

Push.prototype.sendValue = function(v, norelease) {

    var args = this.widgetData.preArgs.concat(v)

    osc.send({
        target: this.widgetData.target,
        address: this.widgetData.address,
        precision: this.widgetData.precision,
        args:args,
        syncOnly:norelease
    })

}

module.exports.create = function(widgetData, container) {
    var push = new Push(widgetData, container)
    return push
}
