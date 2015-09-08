
sendOsc = function(data){
    // Unpack args for osc sending function
    if (data[0]) {
        ipc.send('sendOsc', {target:data[0],path:data[1],args:data[2]});
    }
}

createWidget= {}


createWidget.stack = function(widgetData) {
    var widget = $('\
            <div class="stack">\
            </div>\
    ');
    parsewidgets(widgetData.widgets,widget)
    widget.getValue = function(){return}
    widget.setValue = function(){return}
    return widget;
}


createWidget.toggle = createWidget.button  = function(widgetData) {

        widgetData.on = widgetData.on || 1
        widgetData.off = widgetData.off || 0

    var widget = $('\
        <div class="toggle">\
            <div class="value"><span>'+widgetData.off+'</span></div>\
        </div>\
    ');


    widget.value = widget.find('.value')

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
            widget.value.text(on)
            if (send) widget.sendValue(v)
        } else if (v==off) {
            widget.removeClass('on')
            widget.value.text(off)
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
    widgetData.on = widgetData.on || 1
    widgetData.off = widgetData.off || 0

    var widget = $('\
        <div class="switch">\
        </div>\
    ');

    for (v in widgetData.values) {
        widget.append('<div class="value" data-value="'+widgetData.values[v]+'"><span>'+widgetData.values[v]+'</span></div>')
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
                <input type="number" class="x"></input><input type="number" class="y"></input>\
            </div>\
        </div>\
        '),
        handle = widget.find('.handle'),
        pad = widget.find('.xy'),
        value = {x:widget.find('.x'),y:widget.find('.y')}


    widgetData.range = widgetData.range || {x:{min:0,max:1},y:{min:0,max:1}}



    handle.drag('init',function(){
        offX = handle.width()
    })
    handle.drag(function( ev, dd ){
        var h = (pad.innerHeight()-dd.offsetY)*100/pad.innerHeight(),
            w = (dd.deltaX+offX)*100/pad.innerWidth()
        handle.css({'height':h+'%','width':w+'%'})

        var v = widget.getValue()
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')

    },{ relative:true });



    widget.getValue = function() {
        var x = mapToScale(handle.width(),[0,pad.innerWidth()],[widgetData.range.x.min,widgetData.range.x.max]),
            y = mapToScale(handle.height(),[0,pad.innerHeight()],[widgetData.range.y.min,widgetData.range.y.max])

        return [x,y]
    }
    widget.setValue = function(v,send,sync) {
        if (v[1]==undefined) var v = [v,v]
        var w = mapToScale(v[0],[widgetData.range.x.min,widgetData.range.x.max],[0,100])
            h = mapToScale(v[1],[widgetData.range.y.min,widgetData.range.y.max],[0,100]),

        handle.css({'height':h+'%','width':w+'%'})

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
        v[0] = clip(value.x.val(),[widgetData.range.x.min,widgetData.range.x.max])
        widget.setValue(v,true,true)
    })
    value.y.change(function(){
        var v = widget.getValue();
        v[1] = clip(value.y.val(),[widgetData.range.y.min,widgetData.range.y.max])
        widget.setValue(v,true,true)
    })

    widget.setValue(widgetData.range.x.min,widgetData.range.y.min)
    return widget;
}



var hsbToRgb = function (hsb) {
	var rgb = {};
	var h = hsb.h;
	var s = hsb.s*255/100;
	var v = hsb.b*255/100;
	if(s == 0) {
		rgb.r = rgb.g = rgb.b = v;
	} else {
		var t1 = v;
		var t2 = (255-s)*v/255;
		var t3 = (t1-t2)*(h%60)/60;
		if(h==360) h = 0;
		if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
		else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
		else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
		else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
		else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
		else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
		else {rgb.r=0; rgb.g=0;	rgb.b=0}
	}
	return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
};
var rgbToHsb = function (rgb) {
    var hsb = {h: 0, s: 0, b: 0};
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max != 0 ? 255 * delta / max : 0;
    if (hsb.s != 0) {
        if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
        else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
        else hsb.h = 4 + (rgb.r - rgb.g) / delta;
    } else hsb.h = -1;
    hsb.h *= 60;
    if (hsb.h < 0) hsb.h += 360;
    hsb.s *= 100/255;
    hsb.b *= 100/255;
    return hsb;
};


var clip = function(value,range) {
    var max = Math.max,
        min = Math.min

        return max(min(range[0],range[1]),min(parseFloat(value),max(range[0],range[1])))

}

// map a value from a scale to another input and output must be range arrays
var mapToScale = function(value,rangeIn,rangeOut,reverse) {

    var max = Math.max,
        min = Math.min,
      round = Math.round

    value = max(min(rangeIn[0],rangeIn[1]),min(parseFloat(value),max(rangeIn[0],rangeIn[1])))

    value = ((value-rangeIn[0])/(rangeIn[1]-rangeIn[0])) * (rangeOut[1]-rangeOut[0]) + rangeOut[0]

    if (reverse) value = max(rangeOut[0],rangeOut[1])+min(rangeOut[0],rangeOut[1])-value

    value = max(min(rangeOut[0],rangeOut[1]),min(value,max(rangeOut[0],rangeOut[1])))

    value = round(value*100)/100

    return value

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
                <input class="r" type="number"></input><input class="g" type="number"></input><input class="b" type="number"></input>\
            </div>\
        </div>'),
        rgbHandle = widget.find('.rgb .handle'),
        hueHandle = widget.find('.hue .handle'),
        pad = widget.find('.xy'),
        value = {r:widget.find('input.r'),g:widget.find('input.g'),b:widget.find('input.b')}


    widgetData.range = {r:{min:0,max:255},g:{min:0,max:255},b:{min:255}}


    rgbHandle.drag('init',function(){
        rgbOffX = rgbHandle.width()
    })
    rgbHandle.drag(function( ev, dd ){
        var h = (pad.height()-dd.offsetY)*100/pad.innerHeight(),
            w = (dd.deltaX+rgbOffX)*100/pad.innerWidth()
        rgbHandle.css({'height':h+'%','width':w+'%'})

        var v = widget.getValue()
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')

    },{ relative:true });

    hueHandle.drag('init',function(){
        rgbOffX = hueHandle.width()
    })
    hueHandle.drag(function( ev, dd ){
        var w = (dd.deltaX+rgbOffX)*100/pad.innerWidth()
        hueHandle.css({'width':w+'%'})

        var h = parseFloat(hueHandle.width())/pad.innerWidth()*360,
            rgb = hsbToRgb({h:h,s:100,b:100}),
            v = widget.getValue();

        pad.css('background-color','rgb('+rgb.r+','+rgb.g+','+rgb.b+')')
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')

    },{ relative:true });





    widget.getValue = function() {
        var s = mapToScale(rgbHandle.width(),[0,pad.innerWidth()],[0,100]),
            l = mapToScale(rgbHandle.height(),[0,pad.innerHeight()],[0,100]),
            h = mapToScale(hueHandle.width(),[0,pad.innerWidth()],[0,360]),
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

        var w = mapToScale(hsb.s,[0,100],[0,pad.innerWidth()]),
            h = mapToScale(hsb.b,[0,100],[0,pad.innerHeight()]),
            hueW = mapToScale(hsb.h,[0,360],[0,pad.innerWidth()])

        rgbHandle.css({'height':h+'px','width':w+'px'})
        hueHandle.css({'width':hueW+'px'})


        var rgb = hsbToRgb({h:hsb.h,s:100,b:100})
        pad.css('background-color','rgb('+rgb.r+','+rgb.g+','+rgb.b+')')

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



createWidget.fader = function(widgetData,parent){
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

        dimension = parent.hasClass('stack')?'width':'height';

        handle.size = function() {
            return (dimension=='height')?handle.height():handle.width()
        }
        fader.size = function() {
            return (dimension=='height')?fader.height():fader.width()
        }


    var offX=0
    if (dimension=='width') {
        handle.drag('init',function(){
            offX = handle.size()
        })
    }

    handle.drag(function( ev, dd ){
            var d = (dimension=='height')?fader.size()-dd.offsetY:dd.deltaX+offX
            d = d*100/fader.size()
            handle.css(dimension, d+'%')

            var v = widget.getValue()
            widget.sendValue(v);
            widget.showValue(v);

            widget.trigger('sync')

        },{ relative:true });

    widgetData.range = widgetData.range || {'min':0,'max':1}
    widgetData.range = (widgetData.range=='db')?{'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}:widgetData.range;


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
            pip.addClass('val').append('<span>'+range[i]+'</span>')
        }
        pips.append(pip)
    }
    if (dimension=='height') {
        pips.append(pips.find('.pip').get().reverse())
    }




    var rangeKeys = Object.keys(range).map(function (key) {return parseInt(key)}),
        rangeVals = Object.keys(range).map(function (key) {return parseInt(range[key])})



    widget.getValue = function(){
        var v
        var h = handle.size() * 100 / fader.size()
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
        handle.css(dimension,h+'%')


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
        input.val(v)
    }

    input.change(function(){
        widget.setValue(input.val(),true,true)
    })

    widget.setValue(rangeVals[0])

    return widget
}

// get rotation plugin (@Ivo Renkema)

$.fn.getRotation = function () {
    var matrix = this.css("transform")
    if(typeof matrix === 'string' && matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    if (angle<0) angle = 360+angle
    return angle;
};


createWidget.knob = function(widgetData,parent) {
    var widget = $('\
        <div class="knob-wrapper-outer">\
            <div class="knob-wrapper">\
                <div class="knob">\
                </div>\
                <div class="pip min"></div>\
                <div class="pip max"></div>\
            </div>\
            <input></input>\
        </div>\
        '),
        knob = widget.find('.knob'),
        input = widget.find('input'),
        range = widgetData.range || {min:0,max:1}


    widget.find('.pip.min').text(range.min)
    widget.find('.pip.max').text(range.max)

    knob.css('transform','rotate(45deg)').drag('init',function(){
        offR = knob.getRotation()
    })

    knob.drag(function( ev, dd ){
        var r = clip(-dd.deltaY+offR,[45,315])
        knob.css('transform', 'rotateZ('+r+'deg)')

        var v = widget.getValue()

        widget.sendValue(v);
        widget.trigger('sync')
        widget.showValue(v)

    },{ relative:true });


    widget.getValue = function() {
        return mapToScale(knob.getRotation(),[45,315],[range.min,range.max])
    }
    widget.showValue = function(v) {
        input.val(v)
    }
    widget.sendValue = function(v) {
        var t = widgetData.target,
            p = widgetData.path
        sendOsc([t,p,v]);
    }
    widget.setValue = function(v,send,sync) {
        var r = mapToScale(v,[range.min,range.max],[45,315])

        knob.css('transform', 'rotateZ('+r+'deg)')
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
