var actions = require('./actions'),
    icon = require('./utils').icon

var sidepanel = require('./sidepanel').init

// Tabs...
var tabs = function() {
    $('#container').on('fake-click', function(e){
        var link = e.target

        if (!link.hasAttribute('data-tab') || link.classList.contains('on')) return

        var id = link.getAttribute('data-tab')

        link.classList.add('on')

        var previous = $(link).siblings('.on').removeClass('on').data('tab')

        // TABS[id].tab.appendTo(TABS[id].parent)
        TABS[id].parent[0].appendChild(TABS[id].tab[0])
        $(previous).detach()


        $(id).find('li[data-tab]:first-child, li.parent + li[data-tab]').each(function(){
            if (!$(this).siblings('.on').length) $(this).trigger('fake-click')
        })

        $(window).resize()

    })
    $('li[data-tab]').first().trigger('fake-click')
}

// zoom zoom
var scrolls = function(){
    $('html').on('mousewheel.zoom',function(e) {
        // console.log(e)
        if (e.ctrlKey) {
            e.preventDefault()
            if (e.originalEvent.deltaY==0) return
            var d = -e.originalEvent.deltaY/(10*Math.abs(e.originalEvent.deltaY))

            PXSCALE = parseFloat(d)+parseFloat(PXSCALE)
            document.documentElement.style.setProperty("--pixel-scale",'')
            document.documentElement.style.setProperty("--pixel-scale",PXSCALE)

            $(window).resize()
        }
    })
    $(document).on('keydown.resetzoom', function(e){
        if (e.keyCode==96||e.keyCode==48) {
            PXSCALE = INITIALZOOM
            document.documentElement.style.setProperty("--pixel-scale",'')
            document.documentElement.style.setProperty("--pixel-scale",PXSCALE)

            $(window).resize()
        }
    })

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
