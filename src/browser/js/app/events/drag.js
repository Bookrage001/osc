const {fix, normalizeDragEvent, resetEventOffset} = require('./utils')

var targets = {},
    previousPointers = {}

function pointerDownHandler(event) {

    if (event.capturedByEditor === true) return

    if (!event.multitouch) {
        for (var i in targets) {
            if (targets[i] == event.target) return
        }
    }

    event = normalizeDragEvent(event)

    targets[event.pointerId] = event.target

    previousPointers[event.pointerId] = event

    triggerWidgetEvent(targets[event.pointerId], 'draginit', event)

}

function pointerMoveHandler(event) {

    event = normalizeDragEvent(event, previousPointers[event.pointerId])

    event.stopPropagation = true

    if (event.traversing) {

        var previousTarget = targets[event.pointerId],
            target = event.isTouch ?
                document.elementFromPoint(event.clientX, event.clientY)
                : event.target

        if (target) target = target.closest('.drag-event')

        if (target && event.isTouch) {
            resetEventOffset(event, target)
        }

        if (previousTarget !== target) {
            triggerWidgetEvent(previousTarget, 'dragend', event)
        }


        if (target) {
            if (event.traversingContainer.contains(target)) {
                triggerWidgetEvent(target, previousTarget !== target ? 'draginit' : 'drag', event)
            }
        }

        targets[event.pointerId] = target


    } else {
        triggerWidgetEvent(targets[event.pointerId], 'drag', event)
    }

    previousPointers[event.pointerId] = event

}

function pointerUpHandler(event) {

    event = normalizeDragEvent(event, previousPointers[event.pointerId])

    triggerWidgetEvent(targets[event.pointerId], 'dragend', event)

    delete targets[event.pointerId]
    delete previousPointers[event.pointerId]

}


// Move / Up Filter

function pointerMoveFilter(event) {

    if (targets[event.pointerId] !== undefined) {
        pointerMoveHandler.call(targets[event.pointerId], event)
    }

}

function pointerUpFilter(event) {

    if (targets[event.pointerId] !== undefined) {
        pointerUpHandler.call(targets[event.pointerId], event)
        delete targets[event.pointerId]
    }

}

// Mouse events wrappers

function mouseDownCapture(event) {
    if ((event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) || event.button == 2) return
    event.pointerId = 'mouse'
    pointerDownHandler(event)
}

function mouseMultiWrapper(event) {
    event.multitouch = true
    mouseDownCapture(event)
}

function mouseMoveCapture(event) {
    event.pointerId = 'mouse'
    event.inertia = event.ctrlKey ? 10 : 1
    pointerMoveFilter(event)
}

function mouseUpCapture(event){
    if ((event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) || event.button == 2) return
    event.pointerId = 'mouse'
    pointerUpFilter(event)
}


// Touch events wrappers

function touchMultiWrapper(event) {
    event.multitouch = true
    touchDownCapture(event)
}

function touchDownCapture(event) {
    event.preventDefault()
    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]

        if (event.traversing) {
            touchEvent.traversing = event.traversing
            touchEvent.traversingContainer = event.traversingContainer
        }

        touchEvent.pointerId = touchEvent.identifier
        pointerDownHandler(touchEvent)
    }
}

function touchMoveCapture(event) {
    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]

        var fingers = 0
        for (var j in event.touches) {
            if (event.touches[j].target && event.touches[j].target.isSameNode(touchEvent.target)) {
                fingers += 1
                if (fingers == 2) {
                    touchEvent.inertia = 10
                    break
                }
            }
        }

        touchEvent.pointerId = touchEvent.identifier
        pointerMoveFilter(touchEvent)
    }
}

function touchUpCapture(event) {
    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]
        touchEvent.pointerId = touchEvent.identifier
        pointerUpFilter(touchEvent)
    }
}

// Callback trigger

function triggerWidgetEvent(target, name, event) {
    if (target !== null && target._drag_widget) {
        target._drag_widget.trigger(name, [event])
    } else if (target !== null) {
        triggerWidgetEvent(target.closest('.drag-event'), name, event)
    }
}

// init

DOM.ready(()=>{

    document.addEventListener('mousemove', mouseMoveCapture, true)
    document.addEventListener('mouseup', mouseUpCapture, true)
    document.addEventListener('touchmove', touchMoveCapture, true)
    DOM.addEventListener(document, 'touchend touchcancel', touchUpCapture, true)

})

module.exports = {

    setup: function(options) {

        if (
            this._customBindings['drag'].bindings !== 0 ||
            this._customBindings['draginit'].bindings !== 0 ||
            this._customBindings['dragend'].bindings !== 0 ||
            !options
        ) {
            return
        }

        var {element, multitouch} = options

        element._drag_widget = this
        element.style.touchAction = 'none'
        element.classList.add('drag-event')

        if (multitouch) {
            element.addEventListener('touchstart', touchMultiWrapper, false)
            element.addEventListener('mousedown', mouseMultiWrapper)
        } else {
            element.addEventListener('touchstart', touchDownCapture, false)
            element.addEventListener('mousedown', mouseDownCapture)
        }

    },

    teardown: function(options) {

        if (
            this._customBindings['drag'].bindings !== 0 ||
            this._customBindings['draginit'].bindings !== 0 ||
            this._customBindings['dragend'].bindings !== 0 ||
            !options
        ) {
            return
        }

        delete element._drag_widget
        element.style.touchAction = ''
        element.classList.remove('drag-event')

        if (multitouch) {
            element.removeEventListener('touchstart', touchMultiWrapper, false)
            element.removeEventListener('mousedown', mouseMultiWrapper)
        } else {
            element.removeEventListener('touchstart', touchDownCapture, false)
            element.removeEventListener('mousedown', mouseDownCapture)
        }

    },

    enableTraversingGestures: function(element) {

        function makeEventTraversing(event) {
            if (event.ctrlKey) return
            event.traversing = true
            if (!event.traversingContainer) event.traversingContainer = element
        }

        element.addEventListener('mousedown', makeEventTraversing, true)
        element.addEventListener('touchstart', makeEventTraversing, true)

        element.addEventListener('disableTraversingGestures', ()=>{

            element.removeEventListener('mousedown', makeEventTraversing, true)
            element.removeEventListener('touchstart', makeEventTraversing, true)

        })

    },

    disableTraversingGestures: function(element) {

        DOM.dispatchEvent(element, 'disableTraversingGestures')

    }

}
