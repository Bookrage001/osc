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
                if (e.button==2) {
                    e.speedX = e.speedX/10
                    e.speedY = e.speedY/10
                }
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
                var offsetLeft = 0
                var offsetTop = 0
                if (obj) {
                    do {
                        if (!isNaN(obj.offsetLeft)) {
                            offsetLeft += obj.offsetLeft - obj.scrollLeft
                        }
                        if (!isNaN(obj.offsetTop)) {
                            offsetTop += obj.offsetTop - obj.scrollTop
                        }
                    } while(obj = obj.offsetParent )
                }

                return {left: offsetLeft, top: offsetTop}
            }

            element.on("touchstart.drag mousedown.drag", function(e) {
                e.preventDefault()
                previousEvent = e

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
            })
            element.on("touchmove.drag", function(e) {
                e.preventDefault()

                // get element under pointer: usefull only for master dragging (when target changes during drag)
                e.target = document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY)

                e.pageX = e.originalEvent.targetTouches[0].pageX
                e.pageY = e.originalEvent.targetTouches[0].pageY
                e.offsetX = e.pageX-getOffset(e.target).left
                e.offsetY = e.pageY-getOffset(e.target).top
                e.speedX = previousEvent?e.pageX - previousEvent.pageX:0
                e.speedY = previousEvent?e.pageY - previousEvent.pageY:0
                e.deltaX = previousEvent?e.speedX + previousEvent.deltaX:0
                e.deltaY = previousEvent?e.speedY + previousEvent.deltaY:0

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
