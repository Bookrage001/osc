
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
            <li><a class="saveState btn">Save</a></li>\
            <li><a href="#" class="loadState btn">Load</a></li>\
            <li><a href="#" class="sendState btn">Send ALL</a></li>\
            <li><a href="#" class="goFullscreen btn">Fullscreen</a></li>\
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

}
