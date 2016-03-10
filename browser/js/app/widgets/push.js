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
        <div class="push toggle">
            <div class="light"></div>
        </div>\
        `),
        $document = $(document)

    widget.value = widget.find('span')

    widget.on('drag',function(e){e.stopPropagation()})
    widget.on('draginit.push',function(){
        widget.off('draginit.push')
        widget.fakeclick()
    })

    widget.fakeclick = function(){
        widget.setValue(widgetData.on,true,true)
        $document.on('dragend.push',function(){
            widget.setValue(widgetData.off,true,true)
            $document.off('dragend.push')
            widget.on('draginit.push',function(){
                widget.off('draginit.push')
                widget.fakeclick()
            })
        })
    }

    widget.getValue = function() {
        return widget.hasClass('on')?widgetData.on:widgetData.off
    }
    widget.setValue = function(v,send,sync) {
        var on = widgetData.on,
            off= widgetData.off
        if (v==on) {
            widget.addClass('on')
            if (send) widget.sendValue(v)
        } else if (v==off) {
            widget.removeClass('on')
            if (send) widget.sendValue(v)
        }

        if (sync) widget.trigger('sync')

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
