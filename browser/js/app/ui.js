var actions = require('./actions'),
    icon = require('./utils').icon

var sidepanel = require('./sidepanel')

// Tabs...
var tabs = function() {
    $('.tablist a').click(function(){

        var id = $(this).data('tab')
        $(id).siblings('.on').removeClass('on')
        $(id).addClass('on')
        $(this).parents('ul').find('.on').removeClass('on')
        $(this).addClass('on');$(this).parent().addClass('on')

    })
}

// horizontal scrolling & zoom with mousewheel
// if shift is pressed (native), or if there is no vertical scrollbar,
//                               or if mouse is on h-scrollbar
var scrollbarHeight = 20
var scrolls = function(){
    if (WEBFRAME) {
        $('html').on('mousewheel.zoom',function(e) {
            // console.log(e)
            if (e.ctrlKey) {
                e.preventDefault()
                if (e.originalEvent.deltaY==0) return
                var d = -e.originalEvent.deltaY/Math.abs(e.originalEvent.deltaY)/20,
                    s = d+WEBFRAME.getZoomFactor()
                WEBFRAME.setZoomFactor(s)

            }
        })
        $(document).on('keydown.resetzoom', function(e){
            if (e.keyCode==96||e.keyCode==48) WEBFRAME.setZoomFactor(1)
        })

    }


    $('.tab').on('mousewheel.scroll',function(e) {
        if (!e.ctrlKey) {
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

    $('.panel').on('mousewheel.scroll',function(e) {
        if (!e.ctrlKey) {

            var h = $(this).parent().innerHeight()-scrollbarHeight-$(this).parents('.tab').length*5
            if ($(this).get(0).scrollHeight+scrollbarHeight == $(this).parent().height()) {
                var scroll = e.originalEvent.deltaY || e.originalEvent.deltaX
                $(this).scrollLeft($(this).scrollLeft()+scroll)
                e.preventDefault()
            }

        }
    })
}


module.exports = {
    init: function(){
        sidepanel()
        tabs()
        scrolls()
    }
}
