
// defaultTarget
defaultTarget = 'localhost:9999'

// Disable console
console.log = function() {}

// Predeclare python callbacks (before document's ready event!)
loadPreset = function(){};
oscReceive = function(){};
init = function(){};

// jQuery loaded
$(document).ready(function(){

document.title = 'INIT'

init = function() {
  
__strips__ = [];

parsetabs(TABS,false,false)

function parsetabs(TABS,parent,sub) {

    if (!sub) {
        var $nav = $(document.createElement('div')).addClass('main navigation'),
            $navtabs = $(document.createElement('ul')).addClass('tablist'),
            $mainNavOptions = $(document.createElement('ul')).addClass('options').append('\
                <ul id="options">\
                    <li><a href="#" class="saveState">Save</a></li>\
                    <li><a href="#" class="loadState">Load</a></li>\
                    <li><a href="#" class="goFullscreen">Fullscreen</a></li>\
                    <li class="showOptions"><a href="#"></a></li>\
                </ul>\
            '),        
            $content = $(document.createElement('div')).addClass('content');  
            $nav.append($navtabs).append($mainNavOptions);
            $('#__container__').append($nav).append($content);
    } else {
        var $nav = $(document.createElement('div')).addClass('sub navigation'),
            $navtabs = $(document.createElement('ul')).addClass('tablist'),
     
            $content = $(document.createElement('div')).addClass('content hastabs');  
            $nav.append($navtabs);
            parent.append($nav).append($content);
            
    }

    $.each(TABS,function(tabId,tabData){

        var title = tabData.title||tabId

        $navtabs.append('<li><a href="#'+tabId+'">'+title+'</a></li>');
        
        var $tabContent = $(document.createElement('div')).addClass('tab').attr('id',tabId);        
        
        
        if (tabData.tabs) {
           
            parsetabs(tabData.tabs,parent=$tabContent,sub=true);

        } else {
            
            $.each(tabData.widgets,function(widgetId,widgetData){// parse widgets
            
                var color = widgetData.color?'style="background-color:'+widgetData.color+'"':'';
                var title = widgetData.title || widgetId;

                switch(widgetData.type) {
                
                    case 'button':
                        var $widget = $('\
                            <div class="widget button">\
                                <div class="title" '+color+'>'+title+'</div>\
                                <div class="button-inner-wrapper"><div class="push"></div></div>\
                                <input value="OFF"></input>\
                            </div>\
                        ');

                        break
                        
                    
                    
                    case 'strip':
                    default:

                        var $widget = $('\
                            <div class="widget strip">\
                                <div class="title" '+color+'>'+title+'</div>\
                                <div class="strip-inner-wrapper">\
                                    <div class="fader locked" path="'+widgetData.path+'" name="'+widgetId+'"></div>\
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
                                if (range.min<0<range.max){
                                    autopips.push(0);  
                                }
                                autopips.push((range.max-range.min)/2);
                                autopips.push((range.max-range.min)/4);
                                autopips.push((range.max-range.min)*.75);
                                return autopips;         
                            }
                        }
                        var pips = pips();


                        $widget.find('.fader')
                            .noUiSlider({
                                orientation:'vertical',
                                direction: "rtl",
                                behaviour: "none-drag",
                                connect: "lower",
                                //animate:false,
                                start: 0,
                                range: range
                            })
                            .noUiSlider_pips({
                                mode: 'values',
                                density: 1,
                                filter:function(v,t){return v==0?1:2;},
                                values: pips,
                                format: wNumb({})
                            })
                            .Link('lower').to($widget.find('input'))
                            .on('slide',function(){
                                if ($(this).hasClass('locked')) return;
                                var p = widgetData.path,
                                    n = widgetData.args,
                                    t = widgetData.target?widgetData.target:defaultTarget,
                                    v = widgetData.scale1?
                                        Math.max(0,Math.round(10000*((Math.abs(range.min)/(range.max-range.min)) + $(this).val()/(range.max-range.min)))/10000)
                                        : $(this).val();
                                sendOsc([t,p,n,v]);
                            })            
                            .on('set',function(){
                                if ($(this).hasClass('locked')) return;
                                var p = widgetData.path,
                                    t = widgetData.target?widgetData.target:defaultTarget,
                                    a = widgetData.args,
                                    v = widgetData.scale1?
                                        Math.max(0,Math.round(10000*((Math.abs(range.min)/(range.max-range.min)) + $(this).val()/(range.max-range.min)))/10000)
                                        : $(this).val();
                                        
                                sendOsc([t,p,a,v]);
                            });
                            // store reference for state saving/loading
                            __strips__.push($widget)
                            

                    }
                    
                    $tabContent.append($widget);
            });// widgets parsed
            
        }
        
        $content.append($tabContent);
    })

}



// Synchronize faders that share the same name 
$(".fader").each(function(){
    $(".fader[name='"+$(this).attr('name')+"']").not(this).Link('lower').to($(this), crossUpdate);
}).removeClass('locked');
function crossUpdate ( value, handle, slider ) {
	$(this).val( value );
}




// Scrollbar
$('#__container__').niceScroll({
    cursorcolor: "#444",
    //touchbehavior:true,
    //bouncescroll:true,
    cursorborder:0,
    cursorborderradius:0,
    cursoropacitymin:1,
    cursorwidth:'30px',
    zindex:999999,
    autohidemode:false,
}); 

// Tabs...
$('.tablist a').click(function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    $(id).siblings().removeClass('on');
    $(id).addClass('on');
    $(this).parents('ul').find('.on').removeClass('on');
    $(this).addClass('on');

    updateScrollbar()

})

$(window).resize(function(){
    updateScrollbar()
})

function updateScrollbar(){
    // update scrollbar
    $('#__container__').getNiceScroll().resize();
    $('#__container__').focus();
    if ($('.nicescroll-rails-hr .nicescroll-cursors').width()) {
        $('body').addClass('scrollable')
    } else {
        $('body').removeClass('scrollable')
    }
}

 
// Activate first tabs
$('.tablist li:first-child a').click();


// Options menu
$('.showOptions a').click(function(e){
    e.preventDefault();
    $('#options').toggleClass('open');   
})
$('.goFullscreen').click(function(e){
    e.preventDefault();
    $(this).toggleClass('on');
    if ($(this).hasClass('on')) {
        document.title = 'Fullscreen,1'
    } else {
        document.title = 'Fullscreen,0'
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







// PYTHON FUNCTIONS

function sendOsc(argsPack){
    // Unpack args for osc sending function 
    document.title = 'Send,'+argsPack.filter(function(n){ return n != undefined }).join(',');
} 

function saveState() {
    data = []
    $.each(__strips__,function(i,strip) {
        data.push('strip:'+strip.fader.attr('name')+':'+strip.fader.val())
    })
    document.title = 'Save,'+data.join(';')
}

function loadState() {
    document.title = 'Load'
}

// CALLBACKS

loadPreset = function(preset){

    $.each(preset.split(';'),function(i,d) {
        var data = d.split(':')
        setTimeout(function(){
            if (data[0] == 'strip') {
                $('.fader[name="'+data[1]+'"]').val(data[2]).trigger('set')
                
            }
        },i)
    })

}

receiveOsc = function(argsPack){
    argsPack = argsPack.split(',')
    $('.fader[path="'+argsPack[0]+'"]').addClass('locked').val(argsPack.pop()).removeClass('locked')
}


}// END INIT

});

