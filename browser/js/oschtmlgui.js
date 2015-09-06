// defaultTarget
defaultTarget = '127.0.0.1:9999'





createWidget= {}
__widgets__ = {}

function parsetabs(tabs,parent,sub){

    if (!sub) {
        var $nav = $(document.createElement('div')).addClass('main navigation'),
            $navtabs = $(document.createElement('ul')).addClass('tablist'),
            $content = $(document.createElement('div')).addClass('content');
            $nav.append($navtabs)
            $('#container').append($nav).append($content);
    } else {
        var $nav = $(document.createElement('div')).addClass('sub navigation'),
            $navtabs = $(document.createElement('ul')).addClass('tablist'),

            $content = $(document.createElement('div')).addClass('content hastabs');
            $nav.append($navtabs);
            parent.append($nav).append($content);

    }

    for (tabId in tabs) {
        var tabData = tabs[tabId]

        var title = tabData.title||tabId

        var id = parent?parent.attr('id')+tabId:tabId
        $navtabs.append('<li><a href="#'+id+'"><span>'+title+'</span></a></li>');

        var $tabContent = $(document.createElement('div')).addClass('tab').attr('id',id);

        if (tabData.tabs) {
            parsetabs(tabData.tabs,parent=$tabContent,sub=true);
        } else {
            parsewidgets(tabData.widgets,$tabContent)
        }

        $content.append($tabContent);
        // console.log('OK parsing tab ' + title )
    }

}

function parsewidgets(widgets,parent) {

    for (widgetId in widgets) {
        var widgetData = widgets[widgetId]

        var color = widgetData.color?'style="background:'+widgetData.color+'"':'';
        var title = widgetData.title || widgetId;
        var type = widgetData.type || 'fader'
        widgetData.path = widgetData.path || '/' + widgetId

        var widget = $('\
            <div class="widget" widgetType="'+type+'" widgetId="'+widgetId+'" path="'+widgetData.path+'">\
                <div class="title" '+color+'>'+title+'</div>\
            </div>\
        ');


        var widgetInner = createWidget[type](widgetData,parent)
        widgetInner.type =  widgetData.type || 'fader'

        widget.append(widgetInner)
        if (__widgets__[widgetId]==undefined) {
            __widgets__[widgetId] = []
        }
        __widgets__[widgetId].push(widgetInner)


        parent.append(widget);
    }
}




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

createWidget.button = function(widgetData) {
    var widget = $('\
        <div class="button-wrapper">\
            <div class="button"></div>\
            <input disabled></input>\
        </div>\
    ');

    widget.input = widget.find('input')
    widget.button =  widget.find('.button')

    widgetData.args = widgetData.args || {off:0,on:1}

    widget.button.click(function(){
        var newVal = widget.button.hasClass('on')?widgetData.args.off||0:widgetData.args.on||1
        widget.setValue(newVal,true)
    })


    widget.getValue = function() {
        return widget.button.hasClass('on')?widgetData.args.on||1:widgetData.args.off||0
    }
    widget.setValue = function(v,send,sync) {
        var on = widgetData.args.on||1,
            off= widgetData.args.off||0
        if (v==on) {
            widget.button.addClass('on')
            if (send) widget.sendValue(v)
        } else if (v==off) {
            widget.button.removeClass('on')
            if (send) widget.sendValue(v)
        }
        widget.input.val(widget.getValue())
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
    ');
    widget.xy = widget.find('.xy')
    widget.xy.handle = widget.find('.handle')
    widget.xy.handle.css({top:0,left:0}).draggable({
        addClasses: false,
        scroll:false,
        containment:'parent'
    });

    widget.xy.value = {x:widget.find('.x'),y:widget.find('.y')}


    widget.xy.on('drag',function(e, data){
        var v = widget.getValue();

        widget.sendValue(v);
        widget.showValue(v)
        widget.trigger('sync')
    })

    widgetData.range = widgetData.range || {x:{min:0,max:1},y:{min:0,max:1}}

    widget.getValue = function() {
        var x = mapToScale(widget.xy.handle.css('left'),[0,widget.xy.innerWidth()],[widgetData.range.x.min,widgetData.range.x.max]),
            y = mapToScale(widget.xy.handle.css('top'),[0,widget.xy.innerHeight()],[widgetData.range.y.min,widgetData.range.y.max],true)

        return [x,y]
    }
    widget.setValue = function(v,send,sync) {
        if (v[1]==undefined) var v = [v,v]
        var left = mapToScale(v[0],[widgetData.range.x.min,widgetData.range.x.max],[0,widget.xy.innerWidth()])
            ytop = mapToScale(v[1],[widgetData.range.y.min,widgetData.range.y.max],[0,widget.xy.innerHeight()],true),

        widget.xy.handle.css({'top':ytop+'px','left':left+'px'})

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
        widget.xy.value.x.val(v[0])
        widget.xy.value.y.val(v[1])
    }

    widget.xy.value.x.change(function(){
        var v = widget.getValue();
        v[0] = limit($(this).val(),[widgetData.range.x.min,widgetData.range.x.max])
        widget.setValue(v,true,true)
    })
    widget.xy.value.y.change(function(){
        var v = widget.getValue();
        v[1] = limit($(this).val(),[widgetData.range.y.min,widgetData.range.y.max])
        widget.setValue(v,true,true)
    })


    return widget;


    // alternate technique to jqueryui using css transform (hw accelerated)
    // doesn't seem to increase performance (there's no transition to optimize)
    // add require( __dirname + "/js/jquery.event.drag-2.2.js") to index.html to enable

    // widget.xy.handle.drag(function( ev, dd ){
    //         var x = limit(dd.offsetX,[0,widget.xy.innerWidth()]),
    //             y = limit(dd.offsetY,[0,widget.xy.innerHeight()])
    //         $( this ).css({
    //             'transform': 'translate3d('+x+'px,'+y+'px,0px)'
    //         });
    //
    //         var v = widget.getValue([0,0,0,x,y]);
    //         widget.sendValue(v);
    //         widget.showValue(v)
    //         widget.trigger('sync')
    //     },{ relative:true });
    //
    // widgetData.range = widgetData.range || {x:{min:0,max:1},y:{min:0,max:1}}
    //
    // widget.getValue = function(css) {
    //     var css = css || widget.xy.handle.css('transform').split('(')[1].split(',')
    //         x = mapToScale(css[4],[0,widget.xy.innerWidth()],[widgetData.range.x.min,widgetData.range.x.max]),
    //         y = mapToScale(css[5],[0,widget.xy.innerHeight()],[widgetData.range.y.min,widgetData.range.y.max],true)
    //     return [x,y]
    // }
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


var limit = function(value,range) {
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

    value = (value/rangeIn[1]-rangeIn[0]) * (rangeOut[1]-rangeOut[0]) + rangeOut[0]

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
        </div>\
    ');
    widget.xy = widget.find('.xy')
    widget.xy.saturation = widget.find('.rgb .handle')
    widget.xy.hue = widget.find('.hue .handle')
    widget.xy.saturation.css({top:0,left:0}).draggable({
        addClasses: false,
        scroll:false,
        containment:'parent'
    });
    widget.xy.hue.css({left:0}).draggable({
        addClasses: false,
        scroll:false,
        containment:'parent'
    });

    widget.xy.value = {r:widget.find('input.r'),g:widget.find('input.g'),b:widget.find('input.b')}



    widget.xy.hue.on('drag',function(e, data){
        var h = parseFloat(widget.xy.hue.css('left'))/widget.xy.innerWidth()*360,
            rgb = hsbToRgb({h:h,s:100,b:100}),
            v = widget.getValue();

        widget.xy.css('background-color','rgb('+rgb.r+','+rgb.g+','+rgb.b+')')
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')
    })

    widget.xy.saturation.on('drag',function(e, data){
        var v = widget.getValue();
        widget.sendValue(v);
        widget.showValue(v);

        widget.trigger('sync')

    })
    widget.xy.saturation.on('stop',function(e, data){
        var v = widget.getValue();
        widget.sendValue(v);
        widget.showValue(v);

        //widget.trigger('sync')
    })


    widgetData.range = {r:{min:0,max:255},g:{min:0,max:255},b:{min:255}}



    widget.getValue = function() {
        var s = mapToScale(widget.xy.saturation.css('left'),[0,widget.xy.innerWidth()],[0,100]),
            l = mapToScale(widget.xy.saturation.css('top'),[0,widget.xy.innerHeight()],[0,100],true),
            h = mapToScale(widget.xy.hue.css('left'),[0,widget.xy.innerWidth()],[0,360]),
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

        var left = mapToScale(hsb.s,[0,100],[0,widget.xy.innerWidth()]),
            top = mapToScale(hsb.b,[0,100],[0,widget.xy.innerHeight()],true),
            leftHue = mapToScale(hsb.h,[0,360],[0,widget.xy.innerWidth()])
        widget.xy.saturation.css({'top':top+'px','left':left+'px'})
        widget.xy.hue.css({'left':leftHue+'px'})


        var rgb = hsbToRgb({h:hsb.h,s:100,b:100})
        widget.xy.css('background-color','rgb('+rgb.r+','+rgb.g+','+rgb.b+')')

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
        widget.xy.value.r.val(v[0])
        widget.xy.value.g.val(v[1])
        widget.xy.value.b.val(v[2])
    }
    widget.xy.value.r.change(function(){
        if (!0<=$(this).val()<=255) {$(this).val(Math.min(255,Math.max(0,$(this).val())))}
        var v = widget.getValue()
        widget.setValue([$(this).val(),v[1],v[2]],true,true)
    })
    widget.xy.value.g.change(function(){
        if (!0<=$(this).val()<=255) {$(this).val(Math.min(255,Math.max(0,$(this).val())))}
        var v = widget.getValue()
        widget.setValue([v[0],$(this).val(),v[2]],true,true)
    })
    widget.xy.value.b.change(function(){
        if (!0<=$(this).val()<=255) {$(this).val(Math.min(255,Math.max(0,$(this).val())))}
        var v = widget.getValue()
        widget.setValue([v[0],v[1],$(this).val()],true,true)
    })


    return widget;
}






createWidget.fader = function(widgetData,parent) {
    var widget = $('\
        <div class="fader-wrapper-outer">\
            <div class="fader-wrapper">\
                <div class="fader locked"></div>\
            </div>\
            <input value="0"></input>\
        </div>\
    ');

    widget.fader = widget.find('.fader')
    widget.lock = false
    var range = (widgetData.range=='db'||!widgetData.range)?{'min': -70,'20%': -40,'45%': -20,'60%': -10,'max': 6}:widgetData.range;


    var pips = function() {
        if (widgetData.range=='db'||!widgetData.range) {
            return [-70,-60,-50,-40,-30,-20,-10,-6,-3,0,3,6];
        } else {
            var autopips = [];
            var i=0;
            for (key in range) {
                autopips[i]=range[key];
                i=i+1;
            }
            if (range.min<0 && 0<range.max){
                autopips.push(0);
            }
            //autopips.push((range.max-range.min)/2);
            //autopips.push((range.max-range.min)/4);
            //autopips.push((range.max-range.min)*.75);
            return autopips;
        }
    }
    var pips = pips();

    var orientation = parent.hasClass('stack')?'horizontal':'vertical',
        direction = parent.hasClass('stack')?'ltr':'rtl',
        density = parent.hasClass('stack')?'2':'1';

    widget.fader
        .noUiSlider({
            orientation:orientation,
            direction: direction,
            behaviour: "drag",
            connect: "lower",
            //animate:false,
            start: 0,
            range: range
        })
        .noUiSlider_pips({
            mode: 'values',
            density: density,
            filter:function(v,t){return v==0?1:2;},
            values: pips,
            format: wNumb({})
        })
        .Link('lower').to(widget.find('input'))
        .on('slide',function(){

            if (!widget.lock) {
                widget.sendValue();
            }
        })
        .on('set',function(){
            if (!widget.lock) {
                widget.sendValue();
                widget.trigger('sync')
            }
        });

    widget.getValue = function(v,send){
        return widget.fader.val();
    }

    widget.setValue = function(v,send,sync){
        if (!send) {widget.lock=true}
        widget.fader.val(v);
        if (sync) widget.trigger('sync')
        widget.lock=false;

    }
    widget.sendValue = function(){
        var t = widgetData.target,
            p = widgetData.path,
            v = widgetData.scale1?
                Math.max(0,Math.round(10000*((Math.abs(range.min)/(range.max-range.min)) + widget.fader.val()/(range.max-range.min)))/10000)
                : widget.fader.val();
        sendOsc([t,p,parseFloat(v)]);
    }

    return widget
}








function sendOsc(data){
    // Unpack args for osc sending function
    ipc.send('sendOsc', {target:data[0],path:data[1],args:data[2]});
}

function saveState() {
    var data = getState()
    ipc.send('save',data.join('\n'))
}
function getState(){
    var data = []
    $.each(__widgets__,function(i,widget) {
        data.push(widget[0].type+':'+i+':'+widget[0].getValue())
    })
    return data
}
function loadState() {
    ipc.send('load')
}

function sendState(){
    var data = getState().join('\n')
    setState(data)

}
function setState(preset){

    $.each(preset.split('\n'),function(i,d) {
        var data = d.split(':')

        setTimeout(function(){
            if (__widgets__[data[1]]!=undefined) {
                __widgets__[data[1]][0].setValue(data[2].split(','),true,true)
            }
        },i)
    })
}


// inspector
function findNode(searchID, searchObject) {
    var result=false;
    $.each(searchObject,function(id,object){

        if (id==searchID) {
            result = searchObject[id]
            return false
        } else if (typeof  searchObject[id] === 'object'){
            result = findNode(searchID, searchObject[id])
        }
        if (result !== false) {return false}
    })
    return result
}


// CALLBACKS

ipc.on('receiveOsc',function(data){
    // fetch id
    var path = data.address;
    var id = $('[path="'+path+'"]').attr('widgetId');

    // update
    if (__widgets__[id]!=undefined) __widgets__[id][0].setValue(data.args,false,true)

})

ipc.on('load',function(preset){
    setState(preset)
})













init = function(callback) {


parsetabs(TABS,false,false)



// Widget Synchronization : widget that share the same id will update each other
// without sending any extra osc message (they must be of the same type as well)

$.each(__widgets__,function(i,widget) {
    if (widget.length>1) {
        var script ='';
        for (j in widget) {

            // Oh dear this looks hacky
            // I didn't manage to cross-bind all widgets together the usual way
            // ( getValue() always returns the last element's value, maybe a scope problem)

            script += '                                     \n\
            widget['+j+'].on(\'sync\',function(){           \n\
                var v = widget['+j+'].getValue()            \n\
                for (k=0;k<widget.length;k++) {             \n\
                    if ('+j+'!=k) {                         \n\
                        widget[k].setValue(v,false,false)   \n\
                    }                                       \n\
                }                                           \n\
            })                                              \n\
            ';
        }
        eval(script)
    }
})



// Tabs...
$('.tablist a').click(function(){

    var id = $(this).attr('href');
    $(id).siblings('.on').removeClass('on');
    $(id).addClass('on');
    $(this).parents('ul').find('.on').removeClass('on');
    $(this).addClass('on');$(this).parent().addClass('on');

})




// Activate first tabs
$('.tablist li:first-child a').click();




// horizontal scrolling with mousewheel
// if shift is pressed or if mouse is on h-scrollbar
$('.tab').on('mousewheel',function(e) {
    // console.log(e)
    var h = $('#container').innerHeight()-20-$(this).parents('.tab').length*5;
    if (e.shiftKey) {
        $(this).scrollLeft($(this).scrollLeft()+e.originalEvent.deltaX);
        e.preventDefault();
    } else if (e.pageY>=h) {
        $(this).scrollLeft($(this).scrollLeft()+e.originalEvent.deltaY);
        e.preventDefault()
    }
});



// sidepanel


$('#sidepanel').append('\
    <div class="open-toggle">\
        <span class="bars"></span>\
    </div>\
    <ul id="options">\
        <li><div class="saveState">Save</div></li>\
        <li><div href="#" class="loadState">Load</div></li>\
        <li><div href="#" class="sendState">Send ALL</div></li>\
        <li><div href="#" class="goFullscreen">Fullscreen</div></li>\
        <li>\
            <div class="inspector">\
                    Inspector\
                    <div class="result"><em>Click on a widges\'s title to inspect</em></div>\
            </div>\
        </li>\
    </ul>\
')

$('#sidepanel .open-toggle').click(function(){
    $('#sidepanel .open-toggle, #sidepanel .open-toggle .bars, #sidepanel, #container').toggleClass('sidepanel-open');
})

$('.title').click(function(){
    if (!$('#sidepanel').hasClass('sidepanel-open')){return}
    var id = $(this).parents('.widget').attr('widgetid');
    var data = id + ': <br/>' + String(JSON.stringify(findNode(id,TABS),null,2)).split('\n').join('<br/>&nbsp;&nbsp;')
    $('.inspector .result').html(data);
})


// Options menu
$('.showOptions a').click(function(e){
    e.preventDefault();
    $('#options').toggleClass('open');
})
$('.goFullscreen').click(function(e){
    e.preventDefault();
    ipc.send('fullscreen')
})

$('.saveState').click(function(e){
    e.preventDefault();
    saveState();
})
$('.loadState').click(function(e){
    e.preventDefault();
    loadState();
})
$('.sendState').click(function(e){
    e.preventDefault();
    sendState();
})

if (callback) callback()

}// END INIT
