const Touch = window.Touch || class Touch {}

module.exports = {

    fix: function(e) {

        return {

            target: e.target,
            offsetX: e.offsetX,
            offsetY: e.offsetY,
            pageX: e.pageX,
            pageY: e.pageY,
            movementX: e.movementX,
            movementY: e.movementY,
            pointerId: e.pointerId,
            pointerType: e.pointerType,
            button: e.button,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            inertia: e.inertia,
            traversing: e.traversing,
            traversingContainer: e.traversingContainer,
            isTouch: e instanceof Touch
        }
    },

    normalizeDragEvent: function(event, previousEvent) {

        event = module.exports.fix(event)

        if (event.movementX === undefined) {

            event.movementX = previousEvent ? event.pageX - previousEvent.pageX : 0
            event.movementY = previousEvent ? event.pageY - previousEvent.pageY : 0

        }

        if (event.isTouch && !previousEvent) {

            module.exports.resetEventOffset(event, event.target)

        } else if (event.isTouch && previousEvent) {

            event.offsetX = previousEvent.offsetX + event.movementX
            event.offsetY = previousEvent.offsetY + event.movementY

        }

        if (event.inertia === undefined) {

            event.inertia = 1

        }

        if (previousEvent && previousEvent.traversing) {

            event.traversing = previousEvent.traversing
            event.traversingContainer = previousEvent.traversingContainer

        }

        return event

    },

    resetEventOffset: function(event, target) {

        var off = DOM.offset(target)

        event.offsetX = event.pageX - off.left
        event.offsetY = event.pageY - off.top

    }

}
