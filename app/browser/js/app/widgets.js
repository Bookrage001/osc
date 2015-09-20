createWidget= {}


createWidget.strip = function(widgetData) {
    var widget = $('\
            <div class="strip">\
            </div>\
    ');
    if (widgetData.horizontal) widget.addClass('horizontal')
    parsewidgets(widgetData.widgets,widget)
    widget.getValue = function(){return}
    widget.setValue = function(){return}
    return widget;
}


createWidget.led = function(widgetData) {
    var widget = $('\
            <div class="led">\
                <div><span></span></div>\
            </div>\
            '),
        led = widget.find('span'),
        range = widgetData.range || {min:0,max:1}

    if (widgetData.color) led.css('background-color',widgetData.color)

    widget.setValue = function(v){
        led.css('opacity',mapToScale(v,[range.min,range.max],[0,1]))
    }
    widget.getValue = function(){return}
    return widget;
}



createWidget.toggle = createWidget.button  = function(widgetData) {

        widgetData.on = widgetData.on || 1
        widgetData.off = widgetData.off || 0

    var widget = $('\
        <div class="toggle">\
            <div class="light"></div>\
        </div>\
        '),
        led = widget.find('.light')


    widget.value = widget.find('span')

    widget.click(function(){
        var newVal = widget.hasClass('on')?widgetData.off:widgetData.on
        widget.setValue(newVal,true)
    })


    widget.getValue = function() {
        return widget.hasClass('on')?widgetData.on:widgetData.off
    }
    widget.setValue = function(v,send,sync) {
        var on = widgetData.on,
            off= widgetData.off
        if (v==on) {
            widget.addClass('on')
            if (widgetData.color) led[0].setAttribute('style','background:'+widgetData.color)
            if (send) widget.sendValue(v)
        } else if (v==off) {
            widget.removeClass('on')
            if (widgetData.color) led[0].setAttribute('style','')
            if (send) widget.sendValue(v)
        }

        if (send) widget.trigger('sync')

    }
    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
    }
    widget.setValue()
    return widget;
}



createWidget.switch = function(widgetData) {

    var widget = $('\
        <div class="switch">\
        </div>\
    ');

    for (v in widgetData.values) {
        widget.append('<div class="value" data-value="'+widgetData.values[v]+'">'+widgetData.values[v]+'</div>')
    }


    widget.find('.value').click(function(){
        if ($(this).hasClass('on')) return;
        var newVal = $(this).data('value')
        widget.setValue(newVal,true,true)
    })


    widget.getValue = function() {
        return widget.find('.on').data('value')
    }
    widget.setValue = function(v,send,sync) {
        var e = widget.find('.value[data-value="'+v+'"]')
        if (e.length) {
            widget.find('.on').removeClass('on')
            e.addClass('on')
            if (send) widget.sendValue(v)
            if (sync) widget.trigger('sync')
        }

    }
    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
    }
    return widget;
}



createWidget.xy = function(widgetData) {
    var widget = $('\
        <div class="xy-wrapper">\
            <div class="xy">\
                <div class="handle"><span></span></div>\
            </div>\
            <div class="value">\
                <input disabled value="X"></input><input disabled value="Y"></input>\
                <input class="x"></input><input class="y"></input>\
            </div>\
        </div>\
        '),
        handle = widget.find('.handle'),
        pad = widget.find('.xy'),
        value = {x:widget.find('.x'),y:widget.find('.y')},
        range = widgetData.range || {x:{min:0,max:1},y:{min:0,max:1}},
        absolute = widgetData.absolute


    widgetData.range = range


    pad.width = pad.innerWidth()
    pad.height = pad.innerHeight()
    handle.height = 0
    handle.width = 0

    pad.resize(function(){
        pad.width = pad.innerWidth()
        pad.height = pad.innerHeight()
    })

    var off = {x:0,y:0}
    if (absolute) {
        handle.drag('init',function(e){
                var h = handle.height + (-e.offsetY * 100 / pad.height),
                    w = (e.offsetX * 100 / pad.width)
                handle[0].setAttribute('style','height:'+h+'%;width:'+w+'%')
                handle.height = h
                handle.width = w

                var v = widget.getValue()
                widget.sendValue(v);
                widget.showValue(v);
                widget.trigger('sync')

            off = {x:handle.width,y:handle.height}
        })
    } else {
        handle.drag('init',function(){
            off = {x:handle.width,y:handle.height}
        })
    }
    handle.drag(function( ev, dd ){
        var h = clip((-dd.deltaY)*100/pad.height+off.y,[0,100]),
            w = clip((dd.deltaX)*100/pad.width+off.x,[0,100])
        handle[0].setAttribute('style','height:'+h+'%;width:'+w+'%')
        handle.height = h
        handle.width = w

        var v = widget.getValue()
        widget.sendValue(v);
        widget.showValue(v);
        widget.trigger('sync')

    },{ relative:true });



    widget.getValue = function() {
        var x = mapToScale(handle.width,[0,100],[range.x.min,range.x.max]),
            y = mapToScale(handle.height,[0,100],[range.y.min,range.y.max])

        return [x,y]
    }
    widget.setValue = function(v,send,sync) {
        if (v[1]==undefined) var v = [v,v]
        var w = mapToScale(v[0],[range.x.min,range.x.max],[0,100])
            h = mapToScale(v[1],[range.y.min,range.y.max],[0,100]),

        handle[0].setAttribute('style','height:'+h+'%;width:'+w+'%')
        handle.height = h
        handle.width = w

        widget.showValue(v)
        if (sync) widget.trigger('sync')
        if (send) widget.sendValue(v);
    }
    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
    }

    widget.showValue = function(v) {
        value.x.val(v[0])
        value.y.val(v[1])
    }

    value.x.change(function(){
        var v = widget.getValue();
        v[0] = clip(value.x.val(),[range.x.min,range.x.max])
        widget.setValue(v,true,true)
    })
    value.y.change(function(){
        var v = widget.getValue();
        v[1] = clip(value.y.val(),[range.y.min,range.y.max])
        widget.setValue(v,true,true)
    })

    widget.setValue(range.x.min,range.y.min)
    return widget;
}






createWidget.rgb = function(widgetData) {
    var widget = $('\
        <div class="xy-wrapper rgb-wrapper">\
            <div class="xy rgb">\
                <div class="handle"><span></span></div>\
            </div>\
            <div class="hue">\
                <div class="handle"><span></span></div>\
            </div>\
            <div class="value">\
                <input disabled value="R"></input><input disabled value="G"></input><input disabled value="B"></input>\
                <input class="r"></input><input class="g"></input><input class="b"></input>\
            </div>\
        </div>'),
        rgbHandle = widget.find('.rgb .handle'),
        hueHandle = widget.find('.hue .handle'),
        pad = widget.find('.xy'),
        value = {r:widget.find('input.r'),g:widget.find('input.g'),b:widget.find('input.b')}
        absolute = widgetData.absolute


    widgetData.range = {r:{min:0,max:255},g:{min:0,max:255},b:{min:255}}



    pad.width = pad.innerWidth()
    pad.height = pad.innerHeight()
    rgbHandle.height = 0
    rgbHandle.width = 0
    hueHandle.width = 0

    pad.resize(function(){
        pad.width = pad.innerWidth()
        pad.height = pad.innerHeight()
    })


    var rgbOff = {x:0,y:0}
    if (absolute) {
        rgbHandle.drag('init',function(e){
                var h = rgbHandle.height + (-e.offsetY * 100 / pad.height),
                    w = (e.offsetX * 100 / pad.width)
                rgbHandle[0].setAttribute('style','height:'+h+'%;width:'+w+'%')
                rgbHandle.height = h
                rgbHandle.width = w

                var v = widget.getValue()
                widget.sendValue(v);
                widget.showValue(v);
                widget.trigger('sync')

            rgbOff = {x:rgbHandle.width,y:rgbHandle.height}
        })
    } else {
        rgbHandle.drag('init',function(){
            rgbOff = {x:rgbHandle.width,y:rgbHandle.height}
        })
    }
    rgbHandle.drag(function( ev, dd ){
        var h = clip((-dd.deltaY)*100/pad.height+rgbOff.y,[0,100]),
            w = clip(dd.deltaX*100/pad.width+rgbOff.x,[0,100])
        rgbHandle[0].setAttribute('style','height:'+h+'%;width:'+w+'%')
        rgbHandle.height = h
        rgbHandle.width = w

        var v = widget.getValue()
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')

    },{ relative:true });


    var hueOff = 0
    if (absolute) {
        hueHandle.drag('init',function(e){
            var d = (e.offsetX * 100 / pad.width)
            hueHandle[0].setAttribute('style','width:'+d+'%')
            hueHandle.width = d


            var h = clip(hueHandle.width*3.6,[0,360]),
                rgb = hsbToRgb({h:h,s:100,b:100}),
                v = widget.getValue();

            pad[0].setAttribute('style','background-color:rgb('+rgb.r+','+rgb.g+','+rgb.b+')')



            widget.sendValue(v);
            widget.showValue(v);
            widget.trigger('sync')

            hueOff = hueHandle.width
        })
    } else {
        hueHandle.drag('init',function(){
            hueOff = hueHandle.width
        })
    }


    hueHandle.drag(function( ev, dd ){
        var w = clip(dd.deltaX*100/pad.width+hueOff,[0,100])
        hueHandle[0].setAttribute('style','width:'+w+'%')
        hueHandle.width = w

        var h = clip(hueHandle.width*3.6,[0,360]),
            rgb = hsbToRgb({h:h,s:100,b:100}),
            v = widget.getValue();

        pad[0].setAttribute('style','background-color:rgb('+rgb.r+','+rgb.g+','+rgb.b+')')
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')

    },{ relative:true });





    widget.getValue = function() {
        var s = clip(rgbHandle.width,[0,100]),
            l = clip(rgbHandle.height,[0,100]),
            h = mapToScale(hueHandle.width,[0,100],[0,360]),
            rgb = hsbToRgb({h:h,s:s,b:l})
        return [rgb.r,rgb.g,rgb.b]
    }
    widget.setValue = function(v,send,sync) {
        if (v[1]==undefined && v[2]==undefined) var v = [v,v,v]
        if (v[2]==undefined) var v = [v[0],v[1],v[1]]

        for (i in [0,1,2]) {
            if (!0<=v[i]<=255) {v[i]=Math.min(255,Math.max(0,v[i]))}
        }


        var hsb = rgbToHsb({r:v[0],g:v[1],b:v[2]})

        var w = mapToScale(hsb.s,[0,100],[0,100]),
            h = mapToScale(hsb.b,[0,100],[0,100]),
            hueW = mapToScale(hsb.h,[0,360],[0,100])

        rgbHandle[0].setAttribute('style','height:'+h+'%;width:'+w+'%')
        hueHandle[0].setAttribute('style','width:'+hueW+'%')

        rgbHandle.height = h
        rgbHandle.width = w
        hueHandle.width = hueW


        var rgb = hsbToRgb({h:hsb.h,s:100,b:100})
        pad[0].setAttribute('style','background-color:rgb('+rgb.r+','+rgb.g+','+rgb.b+')')

        widget.showValue(v);



        if (sync) widget.trigger('sync');
        if (send) widget.sendValue(v);
    }
    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
    }



    widget.showValue = function(v) {
        value.r.val(v[0])
        value.g.val(v[1])
        value.b.val(v[2])
    }
    value.r.change(function(){
        var r = clip(value.r.val(),[0,255])
        var v = widget.getValue()
        widget.setValue([r,v[1],v[2]],true,true)
    })
    value.g.change(function(){
        var g = clip(value.g.val(),[0,255])
        var v = widget.getValue()
        widget.setValue([v[0],g,v[2]],true,true)
    })
    value.b.change(function(){
        var b = clip(value.b.val(),[0,255])
        var v = widget.getValue()
        widget.setValue([v[0],v[1],b],true,true)
    })

    widget.setValue(0)

    return widget;
}



createWidget.fader = function(widgetData,container){
    var widget = $('\
        <div class="fader-wrapper-outer">\
            <div class="fader-wrapper">\
                <div class="fader">\
                    <div class="handle"></div>\
                    <div class="pips"></div>\
                </div>\
            </div>\
            <input></input>\
        </div>\
        '),
        handle = widget.find('.handle'),
        fader = widget.find('.fader'),
        pips = widget.find('.pips'),
        input = widget.find('input'),
        unit = widgetData.unit?' '+widgetData.unit.trim(): '',
        dimension = widgetData.horizontal?'width':'height',
        absolute = widgetData.absolute;

        if (widgetData.horizontal) container.addClass('horizontal')

        handle.size = 0
        fader.size = dimension=='height'?fader.height():fader.width()

        fader.resize(function(){
            fader.size=dimension=='height'?fader.height():fader.width()
        })


    var off = 0
    if (absolute) {
        handle.drag('init',function(e){
                var d = (dimension=='height')?
                        handle.size + (-e.offsetY * 100 / fader.size):
                        (e.offsetX * 100 / fader.size)
                handle[0].setAttribute('style',dimension+':'+d+'%')
                handle.size = d

                var v = widget.getValue()
                widget.sendValue(v);
                widget.showValue(v);

                widget.trigger('sync')

            off = handle.size
        })
    } else {
        handle.drag('init',function(){
            off = handle.size
        })
    }


    handle.drag(function( ev, dd ){
            var d = (dimension=='height')?-dd.deltaY:dd.deltaX

            d = clip(d*100/fader.size+off,[0,100])
            handle[0].setAttribute('style',dimension+':'+d+'%')
            handle.size = d

            var v = widget.getValue()
            widget.sendValue(v);
            widget.showValue(v);

            widget.trigger('sync')

    },{ relative:true });

    widgetData.range = widgetData.range || {'min':0,'max':1}

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



    widget.getValue = function(){
        var h = clip(handle.size,[0,100])
        for (var i=0;i<rangeKeys.length-1;i++) {
            if (h <= rangeKeys[i+1] && h >= rangeKeys[i]) {
                return mapToScale(h,[rangeKeys[i],rangeKeys[i+1]],[rangeVals[i],rangeVals[i+1]])
            }
        }

    }
    widget.setValue = function(v,send,sync) {
        var h,
            v=clip(v,[rangeVals[0],rangeVals.slice(-1)[0]])
        for (var i=0;i<rangeVals.length-1;i++) {
            if (v <= rangeVals[i+1] && v >= rangeVals[i]) {
                h = mapToScale(v,[rangeVals[i],rangeVals[i+1]],[rangeKeys[i],rangeKeys[i+1]])
                break
            }
        }
        handle[0].setAttribute('style',dimension+':'+h+'%')
        handle.size = h

        widget.showValue(v);


        if (sync) widget.trigger('sync');
        if (send) widget.sendValue(v);
    }

    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
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


createWidget.knob = function(widgetData) {
    var widget = $('\
        <div class="knob-wrapper-outer">\
            <div class="knob-wrapper">\
                <div class="knob-mask">\
                    <div class="knob"><span></span></div>\
                </div>\
                <div class="pip min"></div>\
                <div class="pip max"></div>\
            </div>\
            <input></input>\
        </div>\
        '),
        knob = widget.find('.knob'),
        input = widget.find('input'),
        range = widgetData.range || {min:0,max:1},
        unit = widgetData.unit?' '+widgetData.unit.trim(): '';


    var pipmin = Math.abs(range.min)>=1000?range.min/1000+'k':range.min,
        pipmax = Math.abs(range.max)>=1000?range.max/1000+'k':range.max;

    widget.find('.pip.min').text(pipmin)
    widget.find('.pip.max').text(pipmax)


    knob.rotation = 0

    var offR = 0
    knob[0].setAttribute('style','transform:rotate(45deg)')
    knob.drag('init',function(){
        offR = knob.rotation
    })

    knob.drag(function( ev, dd ){
        var r = clip(-dd.deltaY*2+offR,[0,270])
        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        knob.rotation = r

        if (r>180) {
            knob.addClass('d3')
        } else if (r>90) {
            knob.removeClass('d3').addClass('d2')
        } else {
            knob.removeClass('d3 d2')
        }

        var v = mapToScale(r,[0,270],[range.min,range.max])

        widget.sendValue(v);
        widget.trigger('sync')
        widget.showValue(v)

    },{ relative:true });


    widget.getValue = function() {
        return mapToScale(knob.rotation,[0,270],[range.min,range.max])
    }
    widget.showValue = function(v) {
        input.val(v+unit)
    }
    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
    }
    widget.setValue = function(v,send,sync) {
        var r = mapToScale(v,[range.min,range.max],[0,270])
        knob.rotation = r

        if (r>180) {
            knob.addClass('d3')
        } else if (r>90) {
            knob.removeClass('d3').addClass('d2')
        } else {
            knob.removeClass('d3 d2')
        }


        knob[0].setAttribute('style','transform:rotateZ('+r+'deg)')
        var v = widget.getValue() || v

        widget.showValue(v);

        if (sync) widget.trigger('sync');
        if (send) widget.sendValue(v);
    }
    input.change(function(){
        widget.setValue(input.val(),true,true)
    })

    widget.setValue(range.min)
    return widget
}
