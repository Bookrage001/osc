

init = function(callback) {

    parsetabs(TABS,false,false)



    // Widget Synchronization : widget that share the same id will update each other
    // without sending any extra osc message (they must be of the same type as well)

    $.each(__widgets__,function(i,widget) {
        if (widget.length>1) {
            var script ='';

            var closureSync = function(x) {
                return function() {
                    var v = widget[x].getValue()
                    for (k=0;k<widget.length;k++) {
                        if (x!=k) {
                            widget[k].setValue(v,false,false)
                        }
                    }
                }
            }

            for (j in widget) {
                widget[j].on('sync',closureSync(j))
            }


        }
    })




    // Tabs...
    $('.tablist a').click(function(){

        var id = $(this).data('tab');
        $(id).siblings('.on').removeClass('on');
        $(id).addClass('on');
        $(this).parents('ul').find('.on').removeClass('on');
        $(this).addClass('on');$(this).parent().addClass('on');

    })




    // Activate first tabs
    $('.tablist li:first-child a').click();




    // horizontal scrolling with mousewheel
    // if shift is pressed (native), or if there is no vertical scrollbar,
    //                               or if mouse is on h-scrollbar
    $('.tab').on('mousewheel',function(e) {
        // console.log(e)
        var h = $('#container').innerHeight()-10-$(this).parents('.tab').length*5;
        if ($(this).get(0).scrollHeight+10 == $(this).height()) {
            $(this).scrollLeft($(this).scrollLeft()+e.originalEvent.deltaY);
            e.preventDefault();
        } else if (e.pageY>=h) {
            $(this).scrollLeft($(this).scrollLeft()+e.originalEvent.deltaY);
            e.preventDefault()
        }
    });

    // sidepanel


    $('#container').append('\
        <a id="open-toggle">'+icon('navicon')+'</a>\
    ')


    $('#sidepanel').append(createMenu([
        {
            label:'Save',
            click:saveState,
            icon:'save'
        },
        {
            label:'Load',
            click:loadState,
            icon:'folder-open'
        },
        {
            label:'Send all',
            click:sendState,
            icon:'feed'

        },
        {
            label:'Fullscreen',
            click:function(){ipc.send('fullscreen')},
            icon:'tv'
        },
        {
            label:'Preferences',
            icon:'gears',
            click:configPanel
        },
        {
            html:'<div class="inspector btn">\
                    Inspector\
                    <div class="result"><em>Click on a widges\'s title to inspect</em></div>\
                  </div>',
            icon:'terminal'
        }
    ]))


    $('#open-toggle').click(function(){
        $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open');
    })

    $('.title').click(function(){
        if (!$('#sidepanel').hasClass('sidepanel-open')){return}
        var id = $(this).parents('.widget').attr('widgetid');
        var data = id + ': <br/>' + String(JSON.stringify(findNode(id,TABS),null,2)).split('\n').join('<br/>&nbsp;&nbsp;')
        $('.inspector .result').html(data);
    })



    if (callback) callback()

}
