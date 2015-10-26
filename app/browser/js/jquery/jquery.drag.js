// jQuery drag event handler
;(function($){
    $.event.special.drag = {
        setup: function() {
            var element = $(this),
                previousEvent = null,
                $document = $(document)

            var mousemove = function(e) {
                e.speedX = e.pageX - previousEvent.pageX
                e.speedY = e.pageY - previousEvent.pageY
                e.deltaX = e.speedX + previousEvent.deltaX
                e.deltaY = e.speedY + previousEvent.deltaY


                element.trigger("drag",e)
                previousEvent = e
            }
            var mouseup = function(e) {
                $document.off("mouseup")
                $document.off("mousemove")

                e.speedX = e.pageX - previousEvent.pageX
                e.speedY = e.pageY - previousEvent.pageY
                e.deltaX = e.deltaX + previousEvent.deltaX
                e.deltaY = e.deltaY + previousEvent.deltaY

                element.trigger("dragend", e)
            }
            var touchend = function(e) {
                e.preventDefault()

                e.pageX = e.originalEvent.changedTouches[0].pageX
                e.pageY = e.originalEvent.changedTouches[0].pageY
                e.offsetX = e.pageX-getOffset(e.target).left
                e.offsetY = e.pageY-getOffset(e.target).top
                e.speedX = e.pageX - previousEvent.pageX
                e.speedY = e.pageY - previousEvent.pageY
                e.deltaX = e.deltaX + previousEvent.deltaX
                e.deltaY = e.deltaY + previousEvent.deltaY

                element.trigger("dragend", e)
            }

            function getOffset(obj) {
                var offsetLeft = 0;
                var offsetTop = 0;
                do {
                    if (!isNaN(obj.offsetLeft)) {
                        offsetLeft += obj.offsetLeft;
                    }
                    if (!isNaN(obj.offsetTop)) {
                        offsetTop += obj.offsetTop;
                    }
                } while(obj = obj.offsetParent );

                return {left: offsetLeft, top: offsetTop};
            }

            element.on("touchstart.drag mousedown.drag", function(e) {
                e.preventDefault()

                if (!e.originalEvent.changedTouches) {
                    // mouse
                    $document.on("mousemove", mousemove)
                    $document.on("mouseup", mouseup)
                } else {
                    // touch
                    e.pageX = e.originalEvent.changedTouches[0].pageX
                    e.pageY = e.originalEvent.changedTouches[0].pageY
                    e.offsetX = e.pageX-getOffset(e.target).left
                    e.offsetY = e.pageY-getOffset(e.target).top
                }

                e.speedX = 0
                e.speedY = 0
                e.deltaX = 0
                e.deltaY = 0

                element.trigger("draginit", e)
                previousEvent = e
            })
            element.on("touchmove.drag", function(e) {
                e.preventDefault()

                e.pageX = e.originalEvent.changedTouches[0].pageX
                e.pageY = e.originalEvent.changedTouches[0].pageY
                e.offsetX = e.pageX-getOffset(e.target).left
                e.offsetY = e.pageY-getOffset(e.target).top
                e.speedX = e.pageX - previousEvent.pageX
                e.speedY = e.pageY - previousEvent.pageY
                e.deltaX = e.speedX + previousEvent.deltaX
                e.deltaY = e.speedY + previousEvent.deltaY

                // do now allow two touch points to drag the same element
                if (e.originalEvent.targetTouches.length > 1) return

                element.trigger("drag",e)
                previousEvent = e

            })
            element.on("touchend.drag", touchend)
            element.on("touchcancel.drag", touchend)


        },
        teardown: function() {
            var element = $(this)
            element.off("touchstart.drag")
            element.off("touchmove.drag")
            element.off("touchend.drag")
            element.off("touchcancel.drag")
            element.off("mousedown.drag")
            element.off("mouseup.drag")
        }
    }



})(jQuery)
