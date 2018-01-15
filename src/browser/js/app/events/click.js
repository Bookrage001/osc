var {fix, getElementOffset} = require('./utils')

var longTouchTimer = false,
    clearLongTouchTimer = function() {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer)
            longTouchTimer = false
        }
    }


document.addEventListener('contextmenu', ()=>{return false})

document.addEventListener('mousedown', (event)=>{

    if (event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) return
    if (event.button == 2) event.preventDefault()

    var e = fix(event)

    var name = event.button == 2 ? 'fake-right-click' : 'fake-click'

    DOM.dispatchEvent(e.target, name, e)

})

document.addEventListener('touchstart', (event)=>{

    var e = fix(event.changedTouches[0])

    DOM.dispatchEvent(e.target, 'fake-click', e)

    longTouchTimer = setTimeout(()=>{

        var off = getElementOffset(e.target)

        e.offsetX = e.pageX - off.left
        e.offsetY = e.pageY - off.top

        DOM.dispatchEvent(e.target, 'fake-right-click', e)

        clearLongTouchTimer()

    }, 600)

})


DOM.addEventListener(document, 'touchend touchmove touchcancel', clearLongTouchTimer)
