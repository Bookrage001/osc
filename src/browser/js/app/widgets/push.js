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
    norelease:false,
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
        if (!widget.active) widget.setValuePrivate(widgetData.on,{send:true,sync:true})
        $document.on('dragend.push',function(){
            widget.setValuePrivate(widgetData.off,{send:true,sync:true})
            $document.off('dragend.push')
            widget.on('draginit.push',function(){
                widget.off('draginit.push')
                widget.fakeclick()
            })
        })
    }

    widget.getValue = function() {
        return widget[widget.lastChanged] ?
            widgetData.on != null && widgetData.on.value !== undefined ? widgetData.on.value : widgetData.on
            :
            widgetData.off != null && widgetData.off.value !== undefined ? widgetData.off.value : widgetData.off
    }

    widget.setValuePrivate = function(v,options={}) {
        if (v===widgetData.on || (widgetData.on != null && v.value === widgetData.on.value && v.value !== undefined)) {
            widget.addClass('active')
            widget.active = 1
            if (options.send) widget.sendValue(v)
            widget.lastChanged = 'active'
            if (options.sync) widget.trigger({type:'sync',id:widgetData.id,widget:widget, linkId:widgetData.linkId, options:options})
        } else if (v===widgetData.off || (widgetData.off != null && v.value === widgetData.off.value && v.value !== undefined)) {
            widget.removeClass('active')
            widget.active = 0
            if (options.send) widget.sendValue(v, widgetData.norelease)
            widget.lastChanged = 'active'
            if (options.sync) widget.trigger({type:'sync',id:widgetData.id,widget:widget, linkId:widgetData.linkId, options:options})
        }
    }

    widget.setValue = function(v,options={}) {
        if (!options.fromExternal) {
            if (options.send || options.sync) widget.setValuePrivate(v,options)
            return
        }
        if (v===widgetData.on || (widgetData.on != null && v.value === widgetData.on.value && v.value !== undefined)) {
            widget.addClass('on')
            widget.state = 1
            if (options.send) widget.sendValue(v)
            widget.lastChanged = 'state'
            if (options.sync) widget.trigger({type:'sync',id:widgetData.id,widget:widget, linkId:widgetData.linkId,options:options})
        } else if (v===widgetData.off || (widgetData.off != null && v.value === widgetData.off.value && v.value !== undefined)) {
            widget.removeClass('on')
            widget.state = 0
            if (options.send) widget.sendValue(v)
            widget.lastChanged = 'state'
            if (options.sync) widget.trigger({type:'sync',id:widgetData.id,widget:widget, linkId:widgetData.linkId,options:options})
        }
    }

    widget.sendValue = function(v, norelease) {
        var args = widgetData.preArgs.concat(v)

        sendOsc({
            target:widgetData.target,
            path:widgetData.path,
            precision:widgetData.precision,
            args:args,
            syncOnly:norelease
        })
    }
    return widget
}
