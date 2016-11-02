var sendOsc = require('./utils').sendOsc

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
    precision:2,
    address:'auto',
    preArgs:[],
    target:[]
}
module.exports.create = function(widgetData,container) {

    var widget = $(`
        <div class="light">
        </div>\
        `),
        $document = $(document)

    widget.value = widget.find('span')
    widget.state = 0

    widget.on('drag',function(e){e.stopPropagation()})
    widget.on('draginit.toggle',function(){
        widget.off('draginit.toggle')
        widget.fakeclick()
    })

    widget.fakeclick = function(){
        var newVal = widget.state?widgetData.off:widgetData.on
        widget.setValue(newVal,{sync:true,send:true})
        $document.on('dragend.toggle',function(){
            $document.off('dragend.toggle')
            widget.on('draginit.toggle',function(){
                widget.off('draginit.toggle')
                widget.fakeclick()
            })
        })
    }


    widget.getValue = function() {
        return widget.state ?
            widgetData.on != null && widgetData.on.value !== undefined ? widgetData.on.value : widgetData.on
            :
            widgetData.off != null && widgetData.off.value !== undefined ? widgetData.off.value : widgetData.off
    }
    widget.setValue = function(v,options={}) {
        if (v===widgetData.on || (widgetData.on != null && v.value === widgetData.on.value && v.value !== undefined)) {
            widget.addClass('on')
            widget.state = 1
            if (options.send) widget.sendValue(widgetData.on)
        } else if (v===widgetData.off || (widgetData.off != null && v.value === widgetData.off.value && v.value !== undefined)) {
            widget.removeClass('on')
            widget.state = 0
            if (options.send) widget.sendValue(widgetData.off)
        }

        if (options.sync) widget.trigger({type:'sync',id:widgetData.id,widget:widget, linkId:widgetData.linkId, options})

    }
    widget.sendValue = function(v) {
        var args = widgetData.preArgs.concat(v)

        sendOsc({
            target:widgetData.target,
            address:widgetData.address,
            precision:widgetData.precision,
            args:args
        })
    }
    return widget
}
