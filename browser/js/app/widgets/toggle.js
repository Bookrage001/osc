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
    css:'',

    separator2:'osc',

    on:1,
    off:0,
    precision:2,
    path:'auto',
    target:[]
}
module.exports.create = function(widgetData,container) {

    var widget = $(`
        <div class="toggle">
            <div class="light"></div>
        </div>\
        `),
        $document = $(document)

    widget.value = widget.find('span')

    widget.on('drag',function(e){e.stopPropagation()})
    widget.on('draginit.toggle',function(){
        widget.off('draginit.toggle')
        widget.fakeclick()
    })

    widget.fakeclick = function(){
        var newVal = widget.hasClass('on')?widgetData.off:widgetData.on
        widget.setValue(newVal,true,true)
        $document.on('dragend.toggle',function(){
            $document.off('dragend.toggle')
            widget.on('draginit.toggle',function(){
                widget.off('draginit.toggle')
                widget.fakeclick()
            })
        })
    }


    widget.getValue = function() {
        return widget.hasClass('on')?widgetData.on:widgetData.off
    }
    widget.setValue = function(v,send,sync) {
        if (v==widgetData.on) {
            widget.addClass('on')
            if (send) widget.sendValue(widgetData.on)
        } else if (v==widgetData.off) {
            widget.removeClass('on')
            if (send) widget.sendValue(widgetData.off)
        }

        if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

    }
    widget.sendValue = function(v) {
        if (v===false) return
        sendOsc({
            target:widgetData.target,
            path:widgetData.path,
            precision:widgetData.precision,
            args:v
        })
    }
    widget.setValue()
    return widget
}
