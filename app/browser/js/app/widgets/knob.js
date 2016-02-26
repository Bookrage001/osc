var utils = require('./utils'),
    clip = utils.clip,
    mapToScale = utils.mapToScale

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
    css:'',

    separator2:'behaviour',

    absolute:false,
    pan:false,


    separator3:'osc',

    range:{min:0,max:1},
    precision:2,
    path:'auto',
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
                <div class="pip min"></div>
                <div class="pip max"></div>
            </div>
            <div class="input"></div>
        </div>
        `),
        wrapper = widget.find('.knob-wrapper'),
        mask = widget.find('.knob-mask'),
        knob = widget.find('.knob'),
        handle = widget.find('.handle'),
        input = widget.find('.input').fakeInput(),
        range = widgetData.range || {min:0,max:1},
        unit = widgetData.unit?' '+widgetData.unit.trim(): '',
        absolute = widgetData.absolute,
        pan = widgetData.pan



    var pipmin = Math.abs(range.min)>=1000?range.min/1000+'k':range.min,
        pipmax = Math.abs(range.max)>=1000?range.max/1000+'k':range.max

    widget.find('.pip.min').text(pipmin)
    widget.find('.pip.max').text(pipmax)


    knob.rotation = 0

    var offR = 0,
        offX = 0,
        offY = 0
    wrapper.on('draginit',function(e,data){

        if (absolute || data.ctrlKey || data.shiftKey) {
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

            knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
            handle[0].setAttribute('style','transform:rotateZ('+(r-45)+'deg)')
            knob.rotation = r


            if (pan && r<135) {mask.removeClass('pan-right').addClass('pan-left')}
            else if (pan)     {mask.removeClass('pan-left').addClass('pan-right')}

            if      (r>180) {knob.addClass('d3')}
            else if (r>90)  {knob.removeClass('d3').addClass('d2')}
            else            {knob.removeClass('d3 d2')}

            var v = mapToScale(r,[0,270],[range.min,range.max],widgetData.precision)

            widget.sendValue(v)
            widget.trigger('sync')
            widget.showValue(v)

        }

        offR = knob.rotation
    })

    wrapper.on('drag',function(e,data){
        e.stopPropagation()

        if (data.shiftKey) return

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

        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        handle[0].setAttribute('style','transform:rotateZ('+(r-45)+'deg)')
        knob.rotation = r

        if (pan && r<135) {mask.removeClass('pan-right').addClass('pan-left')}
        else if (pan)     {mask.removeClass('pan-left').addClass('pan-right')}

        if      (r>180) {knob.addClass('d3')}
        else if (r>90)  {knob.removeClass('d3').addClass('d2')}
        else            {knob.removeClass('d3 d2')}

        var v = mapToScale(r,[0,270],[range.min,range.max],widgetData.precision)

        widget.sendValue(v)
        widget.trigger('sync')
        widget.showValue(v)

    })


    widget.getValue = function() {
        return mapToScale(knob.rotation,[0,270],[range.min,range.max],widgetData.precision)
    }
    widget.showValue = function(v) {
        input.val(v+unit)
    }
    widget.sendValue = function(v) {
        sendOsc({
            target:widgetData.target,
            path:widgetData.path,
            precision:widgetData.precision,
            args:v
        })
    }
    widget.setValue = function(v,send,sync) {
        var r = mapToScale(v,[range.min,range.max],[0,270],widgetData.precision)
        knob.rotation = r



        if (pan && r<135) {mask.removeClass('pan-right').addClass('pan-left')}
        else if (pan)     {mask.removeClass('pan-left').addClass('pan-right')}

        if      (r>180) {knob.addClass('d3')}
        else if (r>90)  {knob.removeClass('d3').addClass('d2')}
        else            {knob.removeClass('d3 d2')}


        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        handle[0].setAttribute('style','transform:rotateZ('+(r-45)+'deg)')
        var v = widget.getValue()

        widget.showValue(v)

        if (sync) widget.trigger('sync')
        if (send) widget.sendValue(v)
    }
    input.change(function(){
        widget.setValue(input.val(),true,true)
    })

    widget.setValue(range.min)
    return widget
}
