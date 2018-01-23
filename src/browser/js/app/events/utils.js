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
            shiftKey: e.shiftKey

        }

    },

    normalizeEvent: function(event, previousEvent) {

        if (event.movementX === undefined) {

            event.movementX = previousEvent ? event.pageX - previousEvent.pageX : 0
            event.movementY = previousEvent ? event.pageY - previousEvent.pageY : 0

        }

        if (event instanceof Touch && !previousEvent) {

            module.exports.resetEventOffset(event, event.target)

        } else if (event instanceof Touch && previousEvent) {

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

        event.stopPropagation = true

    },

    resetEventOffset: function(event, target) {

        var off = module.exports.getElementOffset(target)

        event.offsetX = event.pageX - off.left
        event.offsetY = event.pageY - off.top

    },

    getElementOffset: function(element) {

        var offsetLeft = 0,
            offsetTop = 0

        if (element) {
            do {
                if (!isNaN(element.offsetLeft)) {
                    offsetLeft += element.offsetLeft - element.scrollLeft
                }
                if (!isNaN(element.offsetTop)) {
                    offsetTop += element.offsetTop - element.scrollTop
                }
            } while (element = element.offsetParent)
        }

        return {
            left: offsetLeft,
            top: offsetTop
        }
    },

    Touch: Touch


}
