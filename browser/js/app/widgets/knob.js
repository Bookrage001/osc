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
    css:'',

    separator2:'behaviour',

    absolute:false,

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
                    <div class="round"></div>
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
        absolute = widgetData.absolute,
        logScale = widgetData.logScale,
        roundFactor = Math.pow(10,widgetData.precision)


    var pipmin = Math.abs(range.min)>=1000?range.min/1000+'k':range.min,
        pipmax = Math.abs(range.max)>=1000?range.max/1000+'k':range.max

    widget.find('.pip.min').text(pipmin)
    widget.find('.pip.max').text(pipmax)

    mask.size = 0

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
        widget.sendValue(v)
        widget.showValue(v)

        widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
    })


    knob.rotation = 0

    var offR = 0,
        offX = 0,
        offY = 0
    wrapper.on('draginit',function(e,data){

        if (absolute || TRAVERSING) {
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

            var v = widget.getValue(r)

            widget.sendValue(v)
            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
            widget.showValue(v)

        }

        offR = knob.rotation
    })

    wrapper.on('drag',function(e,data){
        e.stopPropagation()

        if (TRAVERSING) return

        var r = clip(-data.deltaY*2+offR,[0,270])

        if (absolute || data.ctrlKey || data.shiftKey) {
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

        var v = widget.getValue(r)

        widget.sendValue(v)
        widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        widget.showValue(v)

    })

    widget.updateUi = function(r) {
        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        handle[0].setAttribute('style','transform:rotateZ('+(r-45)+'deg)')

        if      (r>180) {knob.addClass('d3')}
        else if (r>90)  {knob.removeClass('d3').addClass('d2')}
        else            {knob.removeClass('d3 d2')}
    }

    widget.getValue = function() {
        return mapToScale(knob.rotation,[0,270],[range.min,range.max],widgetData.precision,logScale)
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

        var r = mapToScale(Math.round(v*roundFactor)/roundFactor,[range.min,range.max],[0,270],widgetData.precision,logScale,true)
        knob.rotation = r

        widget.updateUi(r)

        var v = widget.getValue()

        widget.showValue(v)

        if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
        if (send) widget.sendValue(v)
    }
    input.change(function(){
        widget.setValue(parseFloat(input.val()),true,true)
    })

    widget.setValue(range.min)
    return widget
}
