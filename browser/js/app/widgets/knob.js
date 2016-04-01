var utils = require('./utils'),
    clip = utils.clip,
    mapToScale = utils.mapToScale,
    sendOsc = utils.sendOsc

module.exports.options = {
    type:'knob',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    noPip:false,
    css:'',

    separator2:'behaviour',

    snap:false,

    separator3:'osc',

    range:{min:0,max:1},
    logScale:false,
    precision:2,
    path:'auto',
    preArgs:[],
    target:[]
}
module.exports.create = function(widgetData,container) {
    var widget = $(`
        <div class="knob-wrapper-outer">
            <div class="knob-wrapper">
                <div class="knob-mask">
                    <div class="knob"><span></span></div>
                    <div class="handle"></div>
                </div>
                <div class="pips">
                    <div class="pip min"></div>
                    <div class="pip max"></div>
                </div>
            </div>
            <div class="input"></div>
        </div>
        `),
        wrapper = widget.find('.knob-wrapper'),
        mask = widget.find('.knob-mask'),
        knob = widget.find('.knob'),
        handle = widget.find('.handle'),
        input = widget.find('.input').fakeInput({align:'center'}),
        range = widgetData.range,
        unit = widgetData.unit?' '+widgetData.unit.trim(): '',
        snap = widgetData.snap,
        logScale = widgetData.logScale,
        roundFactor = Math.pow(10,widgetData.precision)

    if (widgetData.noPip) wrapper.addClass('no-pip')


    var rangeKeys = [],
        rangeVals = [],
        rangeLabels = []

    for (k in widgetData.range) {
        var key = k=='min'?0:k=='max'?100:parseInt(k),
            val = typeof widgetData.range[k] == 'object'?
                        widgetData.range[k][Object.keys(widgetData.range[k])[0]]:
                        widgetData.range[k],
            label = typeof widgetData.range[k] == 'object'?
                        Object.keys(widgetData.range[k])[0]:
                        val

        rangeKeys.push(key)
        rangeVals.push(val)
        rangeLabels.push(label)
    }


    var pipmin = Math.abs(rangeLabels[0])>=1000?rangeLabels[0]/1000+'k':rangeLabels[0],
        pipmax = Math.abs(rangeLabels[rangeLabels.length-1])>=1000?rangeLabels[rangeLabels.length-1]/1000+'k':rangeLabels[rangeLabels.length-1]



    widget.find('.pip.min').text(pipmin)
    widget.find('.pip.max').text(pipmax)

    mask.size = 0
    widget.value = undefined

    wrapper.resize(function(){
        var w = Math.floor(wrapper[0].offsetWidth*.58)
        if (!w || mask.size==w) return
        mask.size=w
        mask[0].setAttribute('style',`height:${w}px;width:${w}px;padding-bottom:0`)
    })

    wrapper.on('mousewheel',function(e){
        if (e.originalEvent.wheelDeltaX) return

        e.preventDefault()
        e.stopPropagation()

        var divider = e.ctrlKey?48:8
        knob.rotation = clip(knob.rotation+e.originalEvent.wheelDeltaY/divider,[0,270])

        widget.updateUi(knob.rotation)

        var v = widget.getValue()

        if (v!=widget.value) {
            widget.value = v

            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        }
    })


    knob.rotation = 0

    var offR = 0,
        offX = 0,
        offY = 0
    wrapper.on('draginit',function(e,data){

        if (snap || TRAVERSING) {
            var w = data.target.clientWidth,
                h = data.target.clientHeight,
                x = data.offsetX-w/2,
                y = data.offsetY-h/2,
                angle =  Math.atan2(-y, -x) * 180 / Math.PI +45,
                r = angle<-90?angle+360:angle
                r = (angle>=-90 && angle<-45)?270:r
                r = clip(r,[0,270])

            offX = x
            offY = y

            widget.updateUi(r)

            knob.rotation = r

            var v = widget.getValue()

            if (v!=widget.value) {
                widget.value = v

                widget.sendValue(v)
                widget.showValue(v)

                widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
            }

        }

        offR = knob.rotation
    })

    wrapper.on('drag',function(e,data){
        e.stopPropagation()

        if (TRAVERSING) return

        var r = clip(-data.deltaY*2+offR,[0,270])

        if (snap || data.ctrlKey || data.shiftKey) {
            var w   =  data.target.clientWidth,
                h   =  data.target.clientHeight,
                x   =  data.deltaX + offX,
                y   =  data.deltaY + offY,
                angle =  Math.atan2(-y, -x) * 180 / Math.PI +45,
                r = angle<-90?angle+360:angle
                r = (angle>=-90 && angle<-45)?270:r
                r = clip(r,[0,270])
        }

        widget.updateUi(r)

        knob.rotation = r

        var v = widget.getValue()

        if (v!=widget.value) {
            widget.value = v

            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        }
    })

    widget.updateUi = function(r) {
        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        handle[0].setAttribute('style','transform:rotateZ('+(r-45)+'deg)')

        if      (r>180) {knob.addClass('d3')}
        else if (r>90)  {knob.removeClass('d3').addClass('d2')}
        else            {knob.removeClass('d3 d2')}
    }

    widget.getValue = function() {
        var h = knob.rotation
        for (var i=0;i<rangeKeys.length-1;i++) {
            if (h <= rangeKeys[i+1]*2.7 && h >= rangeKeys[i]*2.7) {
                return mapToScale(h,[rangeKeys[i]*2.7,rangeKeys[i+1]*2.7],[rangeVals[i],rangeVals[i+1]],widgetData.precision,logScale)
            }
        }
    }
    widget.showValue = function(v) {
        input.val(v+unit)
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
    widget.setValue = function(v,send,sync) {
        if (typeof v != 'number') return

        var v = Math.round(v*roundFactor)/roundFactor,
            r

        for (var i=0;i<rangeVals.length-1;i++) {
            if (v <= rangeVals[i+1] && v >= rangeVals[i]) {
                r = mapToScale(v,[rangeVals[i],rangeVals[i+1]],[rangeKeys[i]*2.7,rangeKeys[i+1]*2.7],widgetData.precision,logScale,true)
                break
            }
        }

        knob.rotation = r

        widget.updateUi(r)

        var v = widget.getValue()
        widget.value = v

        widget.showValue(v)

        if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        if (send) widget.sendValue(v)
    }
    input.change(function(){
        widget.setValue(parseFloat(input.val()),true,true)
    })

    widget.setValue(rangeVals[0])
    return widget
}
