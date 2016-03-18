var actions = require('./actions'),
    icon = require('./utils').icon

var sidepanel = require('./sidepanel').init

// Tabs...
var tabs = function() {
    $('#container').click(function(e){
        var link = $(e.target)

        if (!link.is('li[data-tab]') || link.hasClass('on')) return

        var id = link.data('tab')

        link.addClass('on')

        var previous = link.siblings('.on').removeClass('on').data('tab')

        TABS[id].tab.appendTo(TABS[id].parent)
        $(previous).detach()


        $(id).find('li[data-tab]:first-child, li.parent + li[data-tab]').each(function(){
            if (!$(this).siblings('.on').length) $(this).click()
        })


    })
    $('li[data-tab]').first().click()
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
}


module.exports = {
    init: function(){
        sidepanel()
        tabs()
        scrolls()
    },
    tabs:tabs,
    scrolls:scrolls
}
