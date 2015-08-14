
// defaultTarget
defaultTarget = 'localhost:9999'


// Predeclare python callbacks (before document's ready event!)
loadPreset = function(){};
oscReceive = function(){};
init = function(){};

// jQuery loaded
$(document).ready(function(){



init = function() {

__faders__ = {};
__buttons__ = {};

parsetabs(TABS,false,false)

function parsetabs(TABS,parent,sub){

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

    $.each(TABS,function(tabId,tabData){

        var title = tabData.title||tabId

        var id = parent?parent.attr('id')+tabId:tabId
        $navtabs.append('<li><a href="#'+id+'">'+title+'</a></li>');

        var $tabContent = $(document.createElement('div')).addClass('tab').attr('id',id);


        if (tabData.tabs) {

            parsetabs(tabData.tabs,parent=$tabContent,sub=true);

        } else {

            parsewidgets(tabData.widgets,$tabContent)

        }

        $content.append($tabContent);
    })

}


function parsewidgets(widgets,parent) {

    $.each(widgets,function(widgetId,widgetData){// parse widgets

        var color = widgetData.color?'style="background-color:'+widgetData.color+'"':'';
        var title = widgetData.title || widgetId;

        switch(widgetData.type) {

            case 'sep':
            case 'separator':
                var $widget = $('\
                    <div class="separator">\
                    </div>\
                ');

                break
            case 'stack':
                var $widget = $('\
                    <div class="widget stack">\
                        <div class="title" '+color+'>'+title+'</div>\
                        <div class="stack-wrapper">\
                        </div>\
                    </div>\
                ');

                parsewidgets(widgetData.widgets,$widget.find('.stack-wrapper'))

                break

            case 'button':

                var dv = widgetData.args?widgetData.args.off:0;
                var $widget = $('\
                    <div class="widget">\
                        <div class="title" '+color+'>'+title+'</div>\
                        <div class="button-wrapper">\
                            <div class="button" widgetId="'+widgetId+'" path="'+widgetData.path+'"></div>\
                        </div>\
                        <input disabled value="'+dv+'"></input>\
                    </div>\
                ');

                $widget.input = $widget.find('input')
                $widget.button =  $widget.find('.button')

                $widget.button
                    .on('on',function(e,send){
                        $(this).addClass('on');
                        var t = widgetData.target?widgetData.target:defaultTarget,
                            p = widgetData.path,
                            v = widgetData.on?widgetData.on:1;
                        if (send) sendOsc([t,p,parseFloat(v)]);
                        $widget.input.val(v)
                    })
                    .on('off',function(e,send){
                        $(this).removeClass('on');
                        var t = widgetData.target?widgetData.target:defaultTarget,
                            p = widgetData.path,
                            v = widgetData.off?widgetData.off:0;
                        if (send) sendOsc([t,p,parseFloat(v)]);
                        $widget.input.val(v)
                    })
                    .click(function(){
                        var x = $widget.button.val()?'off':'on'
                        $(this).trigger(x,true)
                    });

                $widget.button.val = function(v,send) {
                    var send = send==undefined?true:false;
                    if (v== undefined) {return $(this).hasClass('on')?1:0;}
                    else {
                        if (widgetData.args!=undefined) {
                            if (v==widgetData.args.on) {$widget.button.trigger('on',send)}
                            if (v==widgetData.args.off) {$widget.button.trigger('off',send)}
                        } else {
                            if (v==1) {$widget.button.trigger('on',send)}
                            if (v==0) {$widget.button.trigger('off',send)}
                        }
                    }
                }

                __buttons__[widgetId] = $widget.button

                break



            case 'fader':
            default:

                var $widget = $('\
                    <div class="widget">\
                        <div class="title" '+color+'>'+title+'</div>\
                        <div class="fader-wrapper">\
                            <div class="fader locked" path="'+widgetData.path+'" widgetId="'+widgetId+'"></div>\
                        </div>\
                        <input value="0"></input>\
                    </div>\
                ');

                $widget.fader = $widget.find('.fader')

                var range = (widgetData.range=='db'||!widgetData.range)?{'min': -70,'20%': -40,'45%': -20,'60%': -10,'max': 6}:widgetData.range;


                var pips = function() {
                    if (widgetData.range=='db'||!widgetData.range) {
                        return [-70,-60,-50,-40,-30,-20,-10,-6,-3,0,3,6];
                    } else {
                        var autopips = [];
                        var i=0;
                        for (key in range) {
                            //alert(range.key)
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

                var orientation = parent.hasClass('stack-wrapper')?'horizontal':'vertical',
                    direction = parent.hasClass('stack-wrapper')?'ltr':'rtl',
                    density = parent.hasClass('stack-wrapper')?'2':'1';

                $widget.fader
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
                    .Link('lower').to($widget.find('input'))
                    .on('slide',function(){
                        if ($widget.fader.hasClass('locked')) return;
                        var t = widgetData.target?widgetData.target:defaultTarget,
                            p = widgetData.path,
                            v = widgetData.scale1?
                                Math.max(0,Math.round(10000*((Math.abs(range.min)/(range.max-range.min)) + $(this).val()/(range.max-range.min)))/10000)
                                : $(this).val();
                        sendOsc([t,p,parseFloat(v)]);
                    })
                    .on('set',function(){
                        if ($widget.fader.hasClass('locked')) return;
                        var t = widgetData.target?widgetData.target:defaultTarget,
                            p = widgetData.path,
                            v = widgetData.scale1?
                                Math.max(0,Math.round(10000*((Math.abs(range.min)/(range.max-range.min)) + $(this).val()/(range.max-range.min)))/10000)
                                : $(this).val();

                        sendOsc([t,p,parseFloat(v)]);
                    });


                // store reference for state saving/loading
                if (__faders__[widgetId]!=undefined) {

                }
                __faders__[widgetId] = $widget.fader

            break
            }

            parent.append($widget);
        });// widgets parsed
}

// Synchronize faders that share the same widgetId
$(".fader").each(function(){
    $(".fader[widgetId='"+$(this).attr('widgetId')+"']").not(this).Link('lower').to($(this), crossUpdate);
}).removeClass('locked');
function crossUpdate ( value, handle, slider ) {
	$(this).val( value );
}




// Scrollbar
$('.content .tab').niceScroll({
    cursorcolor: "#444",
    //touchbehavior:true,
    //bouncescroll:true,
    cursorborder:0,
    cursorborderradius:0,
    cursoropacitymin:1,
    cursorwidth:'4px',
    zindex:999999,
    autohidemode:false,
});

// Tabs...
$('.tablist a').click(function(e){

    $('.tab.on').getNiceScroll().hide();

    e.preventDefault();
    var id = $(this).attr('href');
    $(id).siblings().removeClass('on');
    $(id).addClass('on');
    $(this).parents('ul').find('.on').removeClass('on');
    $(this).addClass('on');

    $('.tab.on').getNiceScroll().show();

    updateScrollbar();


})



function updateScrollbar(){
    // update scrollbar
    $('.content .tab').each(function(){
        $(this).getNiceScroll().resize();
    })
}

// Activate first tabs
$('.tablist li:first-child a').click();






// sidepanel

$('#sidepanel .open-toggle').click(function(){
    $('#sidepanel .open-toggle .bars, #sidepanel, #container').toggleClass('sidepanel-open');
    setTimeout(function(){
        updateScrollbar();
    },300)
})


// Options menu
$('.showOptions a').click(function(e){
    e.preventDefault();
    $('#options').toggleClass('open');
})
$('.goFullscreen').click(function(e){
    e.preventDefault();
    $(this).toggleClass('on');
    if ($(this).hasClass('on')) {
        ipc.send('fullscreen',true)
    } else {
        ipc.send('fullscreen',false)
    }

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
    $.each(__faders__,function(i,fader) {
        data.push('fader:'+i+':'+fader.val())
    })
    $.each(__buttons__,function(i,button) {
        data.push('button:'+i+':'+button.val())
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
            if (data[0] == 'fader') {
                if (__faders__[data[1]]!=undefined) {
                    __faders__[data[1]].val(data[2]).trigger('set')
                }
            }
            if (data[0] == 'button') {
                if (__buttons__[data[1]]!=undefined) {
                    __buttons__[data[1]].val(data[2])
                }
            }
        },i)
    })
}





// CALLBACKS

ipc.on('receiveOsc',function(data){
    // fetch id
    var path = data.address;
    var id = $('[path="'+path+'"]').attr('widgetId');

    // lock
    $('[path="'+path+'"]').addClass('locked');

    // update
    if (__faders__[id]!=undefined) __faders__[id].val(data.args)
    if (__buttons__[id]!=undefined) __buttons__[id].val(data.args,false)

    //unlock
    $('[path="'+path+'"]').removeClass('locked');
})

ipc.on('load',function(preset){
    setState(preset)
})

}// END INIT

});
