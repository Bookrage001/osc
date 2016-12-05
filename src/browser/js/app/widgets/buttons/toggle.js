var _widgets_base = require('../common/_widgets_base'),
    $document = $(document)

module.exports.options = {
    type:'toggle',
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
    value:'',
    precision:2,
    address:'auto',
    preArgs:[],
    target:[]
}

var Toggle = module.exports.Toggle = function(widgetData,container) {

    _widgets_base.apply(this, arguments)

    this.widget = $(`
        <div class="light">
        </div>\
        `)

    this.widget.value = this.widget.find('span')
    this.widget.state = 0

    this.widget.on('drag',(e)=>{e.stopPropagation()})
    this.widget.on('draginit.toggle',()=>{
        this.widget.off('draginit.toggle')
        this.fakeclick()
    })


    this.widget.getValue = ()=>{
        return this.widget.state ?
            this.widgetData.on != null && this.widgetData.on.value !== undefined ? this.widgetData.on.value : this.widgetData.on
            :
            this.widgetData.off != null && this.widgetData.off.value !== undefined ? this.widgetData.off.value : this.widgetData.off
    }
    this.value = this.widget.getValue()
    this.widget.setValue = this.setValue.bind(this)

}


Toggle.prototype = Object.create(_widgets_base.prototype)

Toggle.prototype.constructor = Toggle

Toggle.prototype.fakeclick = function(){
    var newVal = this.widget.state?this.widgetData.off:this.widgetData.on
    this.widget.setValue(newVal,{sync:true,send:true})
    $document.on('dragend.toggle',()=>{
        $document.off('dragend.toggle')
        this.widget.on('draginit.toggle',()=>{
            this.widget.off('draginit.toggle')
            this.fakeclick()
        })
    })
}


Toggle.prototype.setValue = function(v,options={}){
    if (v===this.widgetData.on || (this.widgetData.on != null && v.value === this.widgetData.on.value && v.value !== undefined)) {
        this.widget.addClass('on')
        this.widget.state = 1
        this.value = this.widgetData.on
        if (options.send) this.sendValue(this.widgetData.on)
    } else if (v===this.widgetData.off || (this.widgetData.off != null && v.value === this.widgetData.off.value && v.value !== undefined)) {
        this.widget.removeClass('on')
        this.widget.state = 0
        this.value = this.widgetData.off
        if (options.send) this.sendValue(this.widgetData.off)
    }

    if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options})

}


module.exports.create = function(widgetData, container) {
    var toggle = new Toggle(widgetData, container)
    return toggle.widget
}
