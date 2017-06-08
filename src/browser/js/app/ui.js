var actions = require('./actions'),
    icon = require('./utils').icon,
    editClean = function(){editClean = require('./editor/edit-objects').editClean; editClean()}

var sidepanel = require('./sidepanel').init

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
        scrolls()
    },
    scrolls:scrolls
}
