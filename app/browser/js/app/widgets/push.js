var sendOsc = require('./utils').sendOsc

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
    precision:2,
    path:'auto',
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
    widget.active = 0
    widget.lastChanged = 'state'

    widget.on('drag',function(e){e.stopPropagation()})
    widget.on('draginit.push',function(){
        widget.off('draginit.push')
        widget.fakeclick()
    })

    widget.fakeclick = function(){
        if (!widget.active) widget.setValuePrivate(widgetData.on,true,true)
        $document.on('dragend.push',function(){
            widget.setValuePrivate(widgetData.off,true,true)
            $document.off('dragend.push')
            widget.on('draginit.push',function(){
                widget.off('draginit.push')
                widget.fakeclick()
            })
        })
    }

    widget.getValue = function() {
        return widget[widget.lastChanged]?widgetData.on:widgetData.off
    }

    widget.setValuePrivate = function(v,send,sync) {
        if (v===widgetData.on || (v=='false'&&widgetData.on===false)) {
            widget.addClass('active')
            widget.active = 1
            if (send) widget.sendValue(v)
            widget.lastChanged = 'active'
            if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        } else if (v===widgetData.off || (v=='false'&&widgetData.off===false)) {
            widget.removeClass('active')
            widget.active = 0
            if (send) widget.sendValue(v)
            widget.lastChanged = 'active'
            if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        }
    }

    widget.setValue = function(v,options={}) {
        if (options.fromLocal) {
            widget.setValuePrivate(v,options.send,false)
            return
        }
        if (v===widgetData.on || (v=='false'&&widgetData.on===false)) {
            widget.addClass('on')
            widget.state = 1
            if (options.send) widget.sendValue(v)
            widget.lastChanged = 'state'
            if (options.sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        } else if (v===widgetData.off || (v=='false'&&widgetData.off===false)) {
            widget.removeClass('on')
            widget.state = 0
            if (options.send) widget.sendValue(v)
            widget.lastChanged = 'state'
            if (options.sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        }
    }

    widget.sendValue = function(v) {
        if (v===false) return
        var args = widgetData.preArgs.concat(v)
        sendOsc({
            target:widgetData.target,
            path:widgetData.path,
            precision:widgetData.precision,
            args:args
        })
    }
    widget.setValue()
    return widget
}
