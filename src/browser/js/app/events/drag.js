const {fix, normalizeEvent, resetEventOffset} = require('./utils')

var targets = {},
    previousPointers = {}

function pointerDownHandler(event) {

    if (!event.multitouch) {
        for (var i in targets) {
            if (targets[i] == event.target) return
        }
    }

    targets[event.pointerId] = event.target

    normalizeEvent(event)

    previousPointers[event.pointerId] = event

    triggerWidgetEvent(targets[event.pointerId], 'draginit', event)

}

function pointerMoveHandler(event) {

    normalizeEvent(event, previousPointers[event.pointerId])

    if (event.traversing) {

        var previousTarget = targets[event.pointerId],
            target = event instanceof Touch ?
                document.elementFromPoint(event.clientX, event.clientY)
                : event.target

        if (target) target = target.closest('.drag-event')

        if (target && event instanceof Touch) {
            resetEventOffset(event, target)
        }

        if (previousTarget !== -1 && previousTarget !== target) {
            triggerWidgetEvent(previousTarget, 'dragend', event)
        }

        targets[event.pointerId] = target

        if (target) {
            if (event.traversingContainer.contains(target)) {
                triggerWidgetEvent(targets[event.pointerId], 'draginit', event)
            }
        }


    } else {
        triggerWidgetEvent(targets[event.pointerId], 'drag', event)
    }

    previousPointers[event.pointerId] = event

}

function pointerUpHandler(event) {

    normalizeEvent(event, previousPointers[event.pointerId])

    triggerWidgetEvent(targets[event.pointerId], 'dragend', event)

    delete targets[event.pointerId]
    delete previousPointers[event.pointerId]

}


function triggerWidgetEvent(target, name, event) {
    if (target !== null && target._widget) {
        target._widget.trigger(name, [event])
    } else if (target !== null) {
        triggerWidgetEvent(target.closest('.drag-event'), name, event)
    }
}


// Move / Up handlers

function capturedMoveHandler(event) {

    if (targets[event.pointerId] !== undefined) {
        pointerMoveHandler.call(targets[event.pointerId], event)
    }

}

function capturedUpHandler(event) {

    if (targets[event.pointerId] !== undefined) {
        pointerUpHandler.call(targets[event.pointerId], event)
        delete targets[event.pointerId]
    }

}

// Mouse events wrappers

function mouseDownHandler(event) {
    if ((event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) || event.button == 2) return
    event.pointerId = 'mouse'
    pointerDownHandler(event)
}

function mouseMultiWrapper(event) {
    event.multitouch = true
    mouseDownHandler(event)
}

document.addEventListener('mousemove', (event)=>{
    event.pointerId = 'mouse'
    event.inertia = event.ctrlKey ? 10 : 1
    capturedMoveHandler(event)
}, true)

document.addEventListener('mouseup', (event)=>{
    if ((event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents) || event.button == 2) return
    event.pointerId = 'mouse'
    capturedUpHandler(event)
}, true)


// Touch events wrappers

function touchDownHandler(event) {
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

function touchMultiWrapper(event) {
    event.multitouch = true
    touchDownHandler(event)
}

document.addEventListener('touchmove', (event)=>{
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
        capturedMoveHandler(touchEvent)
    }
}, true)

DOM.addEventListener(document, 'touchend touchcancel', (event)=>{
    for (var i in event.changedTouches) {
        if (isNaN(i) || !event.changedTouches[i]) continue
        var touchEvent = event.changedTouches[i]
        touchEvent.pointerId = touchEvent.identifier
        capturedUpHandler(touchEvent)
    }
}, true)




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

        element._widget = this
        element.style.touchAction = 'none'
        element.classList.add('drag-event')

        if (multitouch) {
            element.addEventListener('touchstart', touchMultiWrapper)
            element.addEventListener('mousedown', mouseMultiWrapper)
        } else {
            element.addEventListener('touchstart', touchDownHandler)
            element.addEventListener('mousedown', mouseDownHandler)
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

    }

}



$.fn.enableTraversingGestures = function(options={}) {

    var self = this[0]

    var makeEventTraversing = function(e){
        if (e.ctrlKey && options.ctrlKeyCancel) return
        e.traversing=true
        if (!e.traversingContainer) e.traversingContainer = self
    }

    self.addEventListener("mousedown", makeEventTraversing, true)
    self.addEventListener("touchstart", makeEventTraversing, true)

    this.on('disableTraversingGestures',()=>{
        self.removeEventListener("mousedown", makeEventTraversing, true)
        self.removeEventListener("touchstart", makeEventTraversing, true)
    })


    return this

}

$.fn.disableTraversingGestures = function() {

    this.trigger('disableTraversingGestures')

}
