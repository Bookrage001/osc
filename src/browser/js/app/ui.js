
// mousewheel zoom
$('html').on('mousewheel.zoom',function(e) {
    if (e.ctrlKey) {
        e.preventDefault()
        if (e.originalEvent.deltaY==0) return
        var d = -e.originalEvent.deltaY/(10*Math.abs(e.originalEvent.deltaY))

        PXSCALE = parseFloat(d)+parseFloat(PXSCALE)
        document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

        $(window).resize()
    }
})
$(document).on('keydown.resetzoom', function(e){
    if (e.ctrlKey && (e.keyCode==96||e.keyCode==48)) {
        PXSCALE = INITIALZOOM
        document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

        $(window).resize()
    }
})

require('./sidepanel')
