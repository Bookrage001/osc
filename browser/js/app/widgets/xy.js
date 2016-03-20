var utils = require('./utils'),
    clip = utils.clip,
    mapToScale = utils.mapToScale,
    sendOsc = utils.sendOsc

module.exports.options = {
    type:'xy',
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

    separator2:'behaviour',

    absolute:false,

    separator3:'osc',

    rangeX:{min:0,max:1},
    rangeY:{min:0,max:1},
    logScaleX:false,
    logScaleY:false,
    precision:2,
    path:'auto',
    split:false,
    target:[]
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
        <div class="xy-wrapper">
            <div class="xy">
                <div class="handle"></div>
            </div>
            <div class="value">
            <div class="input disabled">X</div><div class="input disabled">Y</div>
                <div class="input x"></div><div class="input y"></div>
            </div>
        </div>
        `),
        handle = widget.find('.handle'),
        pad = widget.find('.xy'),
        value = {x:widget.find('.x').fakeInput({align:'center'}),y:widget.find('.y').fakeInput({align:'center'})},
        range = {x:widgetData.rangeX,y:widgetData.rangeY},
        absolute = widgetData.absolute,
        split = widgetData.split?
                    typeof widgetData.split == 'object'?
                        widgetData.split:{x:widgetData.path+'/x',y:widgetData.path+'/y'}
                        :false;
        logScaleX = widgetData.logScaleX,
        logScaleY = widgetData.logScaleY


    if (widgetData.height!='auto') widget.addClass('manual-height')

    pad.width = 0
    pad.height = 0
    handle.height = 0
    handle.width = 0

    pad.resize(function(){
        var width = pad.innerWidth(),
            height = pad.innerHeight()
        if (!width || (pad.height==height && pad.width==width)) return
        pad.width = width
        pad.height = height

        widget.updateUi(handle.width,handle.height)
    })

    var off = {x:0,y:0}
    pad.on('draginit',function(e,data){
        if (absolute || TRAVERSING) {
            var h = ((pad.height-data.offsetY) * 100 / pad.height),
                w = (data.offsetX * 100 / pad.width)

            widget.updateUi(w,h)

            handle.height = h
            handle.width = w

            var v = widget.getValue()
            widget.sendValue(v)
            widget.showValue(v)
            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

        }

        off = {x:handle.width,y:handle.height}

    })
    pad.on('drag',function(e,data){
        e.stopPropagation()

        if (TRAVERSING) return

        var h = clip((-data.deltaY)*100/pad.height+off.y,[0,100]),
            w = clip((data.deltaX)*100/pad.width+off.x,[0,100])

        widget.updateUi(w,h)

        handle.height = h
        handle.width = w

        var v = widget.getValue()
        widget.sendValue(v)
        widget.showValue(v)
        widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

    })


    widget.updateUi = function(w,h) {
        handle[0].setAttribute('style',`transform:translate3d(${pad.width*w/100}px, -${pad.height*h/100}px,0)`)
    }

    widget.getValue = function() {
        var x = mapToScale(handle.width,[0,100],[range.x.min,range.x.max],widgetData.precision,logScaleX),
            y = mapToScale(handle.height,[0,100],[range.y.min,range.y.max],widgetData.precision,logScaleY)

        return [x,y]
    }
    widget.setValue = function(v,send,sync) {
        if (!v || v.length!=2) return

        for (i in [0,1]) {
            v[i] = clip(v[i],[range[['x','y'][i]].min,range[['x','y'][i]].max])
        }

        var w = mapToScale(v[0],[range.x.min,range.x.max],[0,100],widgetData.precision,logScaleX,true)
            h = mapToScale(v[1],[range.y.min,range.y.max],[0,100],widgetData.precision,logScaleY,true),


        widget.updateUi(w,h)

        handle.height = h
        handle.width = w

        widget.showValue(v)
        if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        if (send) widget.sendValue(v)
    }
    widget.sendValue = function(v) {
        sendOsc({
            target:split?false:widgetData.target,
            path:widgetData.path,
            args:v,
            precision:widgetData.precision,
        })
        if (split) {
            sendOsc({
                target:widgetData.target,
                path:split.x,
                args:v[0],
                precision:widgetData.precision,
                sync:false
            })
            sendOsc({
                target:widgetData.target,
                path:split.y,
                args:v[1],
                precision:widgetData.precision,
                sync:false
            })
        }
    }

    widget.showValue = function(v) {
        value.x.val(v[0])
        value.y.val(v[1])
    }

    value.x.change(function(){
        var v = widget.getValue()
        v[0] = clip(value.x.val(),[range.x.min,range.x.max])
        widget.setValue(v,true,true)
    })
    value.y.change(function(){
        var v = widget.getValue()
        v[1] = clip(value.y.val(),[range.y.min,range.y.max])
        widget.setValue(v,true,true)
    })

    widget.setValue([range.x.min,range.y.min])
    return widget
}
