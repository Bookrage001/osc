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
    color:'auto',
    css:'',

    separator2:'osc',

    values:{"Value 1":1,"Value 2":2},
    precision:2,
    path:'auto',
    preArgs:[],
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

        widget.find('.value').on('draginit',function(e,dd){
            var data = $(this).data()
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
        			$(this).removeClass('ripple')
        			next()
        		})
                if (send) widget.sendValue(widget.value)
                if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
            }

        }
        widget.sendValue = function(v) {
            var args = widgetData.preArgs.concat(v)

            sendOsc({
                target:widgetData.target,
                path:widgetData.path,
                precision:widgetData.precision,
                args:args
            })
        }
        return widget
}
