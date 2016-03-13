var utils = require('./utils'),
    sizeToAngle = utils.sizeToAngle,
    clip = utils.clip,
    mapToScale = utils.mapToScale,
    sendOsc = utils.sendOsc

module.exports.options = {
    type:'fader',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    horizontal:false,
    css:'',

    separator2:'behaviour',

    absolute:false,

    separator3:'osc',

    range:{min:0,max:1},
    logScale:false,
    precision:2,
    path:'auto',
    target:[]
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
        <div class="fader-wrapper-outer">
            <div class="fader-wrapper">
                <div class="fader">
                    <div class="handle"><span></span></div>
                    <div class="pips"></div>
                </div>
            </div>
            <div class="input"></div>
        </div>
        `),
        handle = widget.find('.handle'),
        knob = widget.find('span')[0],
        wrapper = widget.find('.fader-wrapper'),
        fader = widget.find('.fader'),
        pips = widget.find('.pips'),
        input = widget.find('.input').fakeInput(),
        unit = widgetData.unit?' '+widgetData.unit.trim(): '',
        dimension = widgetData.horizontal?'width':'height',
        axe = dimension=='height'?'X':'Y',
        absolute = widgetData.absolute
        if (widgetData.horizontal) container.addClass('horizontal')

    handle.size = 0
    fader.size = dimension=='height'?fader.outerHeight():fader.outerWidth()
    wrapper.size = dimension=='height'?wrapper.outerHeight():wrapper.outerWidth()


    var range = {}
    for (k in widgetData.range) {
        if (k=='min') {
            range[0]=widgetData.range[k]
        } else if (k=='max') {
            range[100]=widgetData.range[k]
        } else {
            range[parseInt(k)]=widgetData.range[k]
        }
    }

    var scale = []
    for (var i=0;i<=100;i++) {scale.push(i)}
    for (i in scale) {
        var pip = $('<div class="pip"></div>')
        if (range[i]!=undefined) {
            var piptext = Math.abs(range[i])>=1000?range[i]/1000+'k':range[i]
            pip.addClass('val').append('<span>'+piptext+'</span>')
        }
        pips.append(pip)
    }
    if (dimension=='height') {
        pips.append(pips.find('.pip').get().reverse())
    }



    var rangeKeys = Object.keys(range).map(function (key) {return parseInt(key)}),
        rangeVals = Object.keys(range).map(function (key) {return parseFloat(range[key])})



    fader.resize(function(){
        fader.size= dimension=='height'?fader.outerHeight():fader.outerWidth()
        wrapper.size = dimension=='height'?wrapper.outerHeight():wrapper.outerWidth()
    })

    wrapper.on('mousewheel',function(e){
        if (e.originalEvent.wheelDeltaX) return

        e.preventDefault()
        e.stopPropagation()

        var divider = e.ctrlKey?4:.25
        handle.size = clip(handle.size+e.originalEvent.wheelDelta/(fader.size*divider),[0,100])

        widget.updateUi(handle.size)

        var v = widget.getValue()
        widget.sendValue(v)
        widget.showValue(v)

        widget.trigger('sync',[widgetData.id,widget])
    })

    var off = 0
    wrapper.on('draginit',function(e,data){
        if (absolute || TRAVERSING) {
            var d = (dimension=='height')?
                    ((fader.size-data.offsetY+(wrapper.size-fader.size)/2) * 100 / fader.size):
                    (data.offsetX - (wrapper.size-fader.size)/2) * 100 / fader.size
            d = clip(d,[0,100])

            widget.updateUi(d)
            handle.size = d

            var v = widget.getValue()
            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget])

        }

        off = handle.size

    })


    wrapper.on('drag',function(e,data){
        e.stopPropagation()

        if (TRAVERSING) return

        var d = (dimension=='height')?-data.deltaY:data.deltaX
            d = clip(d*100/fader.size+off,[0,100])

        widget.updateUi(d)

        handle.size = d

        var v = widget.getValue()
        widget.sendValue(v)
        widget.showValue(v)

        widget.trigger('sync',[widgetData.id,widget])

    })

    widget.updateUi = function(v){
        var r = sizeToAngle(v)
        handle[0].setAttribute('style','transform:rotate'+axe+'('+ r +'deg)')
        knob.setAttribute('style','transform:rotate'+axe+'('+ (-r) +'deg)')
    }

    widget.getValue = function(){
        var h = clip(handle.size,[0,100])
        for (var i=0;i<rangeKeys.length-1;i++) {
            if (h <= rangeKeys[i+1] && h >= rangeKeys[i]) {
                return mapToScale(h,[rangeKeys[i],rangeKeys[i+1]],[rangeVals[i],rangeVals[i+1]],widgetData.precision,widgetData.logScale)
            }
        }

    }
    widget.setValue = function(v,send,sync) {
        var h,
            v=clip(v,[rangeVals[0],rangeVals.slice(-1)[0]])
        for (var i=0;i<rangeVals.length-1;i++) {
            if (v <= rangeVals[i+1] && v >= rangeVals[i]) {
                h = mapToScale(v,[rangeVals[i],rangeVals[i+1]],[rangeKeys[i],rangeKeys[i+1]],widgetData.precision,widgetData.logScale,true)
                break
            }
        }

        widget.updateUi(h)

        handle.size = h

        widget.showValue(v)


        if (sync) widget.trigger('sync',[widgetData.id,widget])
        if (send) widget.sendValue(v)
    }

    widget.sendValue = function(v) {
        sendOsc({
            target:widgetData.target,
            path:widgetData.path,
            precision:widgetData.precision,
            args:v
        })
    }

    widget.showValue = function(v) {
        input.val(v+unit)
    }

    input.change(function(){
        widget.setValue(input.val(),true,true)
    })

    widget.setValue(rangeVals[0])

    return widget
}
