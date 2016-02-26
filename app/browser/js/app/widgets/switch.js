var sendOsc = require('./utils').sendOsc

module.exports.options = {
    type:'switch',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    horizontal:false,
    css:'',

    separator2:'osc',

    values:{"Value 1":1,"Value 2":2},
    precision:2,
    path:'auto',
    target:[]
}
module.exports.create = function(widgetData,container) {

        var widget = $(`
            <div class="switch">
            </div>
            `),
            $document = $(document)

        if (widgetData.horizontal) {
            widget.addClass('horizontal')
        }

        widget.values = []

        for (k in widgetData.values) {
            widget.values.push(widgetData.values[k])
            $('<div class="value">'+k+'</div>').data({value:widgetData.values[k]}).appendTo(widget)
        }

        widget.value = undefined

        widget.on('drag',function(e){e.stopPropagation()})

        widget.on('draginit',function(e,dd){
            var data = $(dd.target).data()
            if (data.value!=widget.value || widget.value===undefined) widget.setValue(data.value,true,true)
        })



        widget.getValue = function() {
            return widget.value
        }
        widget.setValue = function(v,send,sync) {
            var i = widget.values.indexOf(v)
            if (i!=-1) {
                widget.value = widget.values[i]
                widget.find('.on').removeClass('on')
                widget.find('.value').eq(i).addClass('on').removeClass('ripple').addClass('ripple').delay(250).queue(function(next){
        			widget.removeClass('ripple')
        			next()
        		})
                if (send) widget.sendValue(widget.value)
                if (sync) widget.trigger('sync')
            }

        }
        widget.sendValue = function(v) {
            sendOsc({
                target:widgetData.target,
                path:widgetData.path,
                precision:widgetData.precision,
                args:v
            })
        }
        return widget
}
