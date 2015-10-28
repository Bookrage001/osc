

init = function(session,callback) {

    parsetabs(session,false,false)



    // Widget Synchronization : widget that share the same id will update each other
    // without sending any extra osc message

    $.each(__widgets__,function(i,widget) {
        if (widget.length>1) {
            var script =''

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

        var id = $(this).data('tab')
        $(id).siblings('.on').removeClass('on')
        $(id).addClass('on')
        $(this).parents('ul').find('.on').removeClass('on')
        $(this).addClass('on');$(this).parent().addClass('on')

    })




    // Activate first tabs
    $('.tablist li:first-child a').click()


    // get current webFrame
    var webFrame = require('web-frame');

    // horizontal scrolling & zoom with mousewheel
    // if shift is pressed (native), or if there is no vertical scrollbar,
    //                               or if mouse is on h-scrollbar
    var scrollbarHeight = 20
    var contentPanels = $('.content')
    $('.tab').on('mousewheel',function(e) {
        // console.log(e)
        if (e.ctrlKey) {
            e.preventDefault()
            var d = -e.originalEvent.deltaY/Math.abs(e.originalEvent.deltaY)/10,
                s = d+webFrame.getZoomFactor()
            webFrame.setZoomFactor(s);

        } else {
            if ($(this).height()>$(this).get(0).scrollHeight) {
                var scroll = e.originalEvent.deltaY || e.originalEvent.deltaX
                $(this).scrollLeft($(this).scrollLeft()+scroll)
                e.preventDefault()
            } else if (e.pageY>window.innerHeight-scrollbarHeight) {
                $(this).scrollLeft($(this).scrollLeft()+e.originalEvent.deltaY)
                e.preventDefault()
            }
        }
    })
    $('.panel').on('mousewheel',function(e) {
        if (!e.ctrlKey) {

            var h = $(this).parent().innerHeight()-scrollbarHeight-$(this).parents('.tab').length*5
            if ($(this).get(0).scrollHeight+scrollbarHeight == $(this).parent().height()) {
                var scroll = e.originalEvent.deltaY || e.originalEvent.deltaX
                $(this).scrollLeft($(this).scrollLeft()+scroll)
                e.preventDefault()
            }

        }
    })

    // reset zoom
    $(document).on('keydown.resetzoom', function(e){
        if (e.keyCode==96||e.keyCode==48) webFrame.setZoomFactor(1)
    })


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
            label:'Load last state',
            click:loadLastState,
            icon:'history'
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
            html:'<div class="inspector btn">\
                    Inspector\
                    <div class="result"><em>Click on a widges\'s label to inspect</em></div>\
                  </div>',
            icon:'terminal'
        }
    ]))


    $('#open-toggle').click(function(){
        $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
    })

    $('.widget .label').click(function(){
        if (!$('#sidepanel').hasClass('sidepanel-open')){return}
        var data = String(JSON.stringify($(this).data('papers'),null,2)).split('\n').join('<br/>&nbsp;&nbsp;')
        $('.inspector .result').html(data)
    })

    // MASTER DRAGGING (while shift key pressed)
    var target

    $(document).keydown(function (e) {
        if (e.keyCode == 16) {
            $('body').addClass('master-dragging')
            $('body').on('draginit',function(ev,dd){
                $('body').removeClass('master-dragging')
            })

            $('body').on('drag',function(ev,dd){
                dd.absolute=true
                $(dd.target).trigger('draginit',[dd])
                if (target!=dd.target) $(dd.target).click()
                target = dd.target

            })
            $('body').on('dragend',function(ev,dd){
                $('body').addClass('master-dragging')
            })
        }
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 16) {
            $('body').removeClass('master-dragging')
            $('body').off('draginit')
            $('body').off('drag')
            $('body').off('dragend')
        }
    });



    if (callback) callback()

}
