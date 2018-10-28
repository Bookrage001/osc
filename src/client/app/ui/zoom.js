// mousewheel zoom

var mod = (navigator.platform || '').match('Mac') ? 'metaKey' : 'ctrlKey'

document.addEventListener('mousewheel', function(event) {
    if (event.ctrlKey) event.preventDefault()
    if (event[mod]) {
        
        event.preventDefault()

        if (event.deltaY === 0) return

        var d = - event.deltaY / (10 * Math.abs(event.deltaY))

        PXSCALE = parseFloat(d) + parseFloat(PXSCALE)
        document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

        DOM.dispatchEvent(window, 'resize')
    }
})

document.addEventListener('keydown', function(event){
    if (event[mod] && (event.keyCode == 96 || event.keyCode == 48)) {
        PXSCALE = INITIALZOOM
        document.documentElement.style.setProperty('font-size', PXSCALE + 'px')

        DOM.dispatchEvent(window, 'resize')
    }
})
