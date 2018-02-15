var {fix} = require('./utils'),
    supportsPassive = require('./supports-passive')

var longTouchTimer = false,
    clearLongTouchTimer = function() {
        if (longTouchTimer) {
            clearTimeout(longTouchTimer)
            longTouchTimer = false
        }
    }

document.body.setAttribute('oncontextmenu', 'return false')

document.addEventListener('mousedown', (event)=>{

    if (event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) return
    if (event.button == 2) event.preventDefault()

    var e = fix(event)

    var name = event.button == 2 ? 'fast-right-click' : 'fast-click'

    DOM.dispatchEvent(e.target, name, e)

})

document.addEventListener('touchstart', (event)=>{

    var e = fix(event.changedTouches[0])

    DOM.dispatchEvent(e.target, 'fast-click', e)

    longTouchTimer = setTimeout(()=>{

        var off = DOM.offset(e.target)

        e.offsetX = e.pageX - off.left
        e.offsetY = e.pageY - off.top

        DOM.dispatchEvent(e.target, 'fast-right-click', e)

        clearLongTouchTimer()

    }, 600)

}, supportsPassive ? { passive: true } : false)


DOM.addEventListener(document, 'touchend touchmove touchcancel', clearLongTouchTimer)
