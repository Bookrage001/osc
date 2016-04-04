// jQuery drag event handler
var startEvent = 'ontouchstart' in window ?'touchstart':'mousedown'
;(function($){
    var $document = $(document)
    $.event.special.drag = {
        setup: function() {
            var element = $(this),
                previousEvent = null

            var mousemove = function(e) {
                e.preventDefault()

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

            element.on(startEvent+".drag", function(e) {
                previousEvent = e

                if (!e.originalEvent.changedTouches) {
                    // mouse
                    $document.on("mousemove", mousemove)
                    $document.on("mouseup", mouseup)
                } else {
                    // touch
                    if (e.originalEvent.targetTouches.length == 2) return
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

                e.pageX = e.originalEvent.targetTouches[0].pageX
                e.pageY = e.originalEvent.targetTouches[0].pageY
                e.speedX = previousEvent?e.pageX - previousEvent.pageX:0
                e.speedY = previousEvent?e.pageY - previousEvent.pageY:0

                if (e.originalEvent.targetTouches.length == 2) {
                    e.speedX = e.speedX / 4
                    e.speedY = e.speedY / 4
                }

                e.deltaX = previousEvent?e.speedX + previousEvent.deltaX:0
                e.deltaY = previousEvent?e.speedY + previousEvent.deltaY:0
                e.offsetX = previousEvent&&!e.shiftKey?previousEvent.offsetX+e.speedX:e.pageX-getOffset(e.target).left
                e.offsetY = previousEvent&&!e.shiftKey?previousEvent.offsetY+e.speedY:e.pageY-getOffset(e.target).top


                element.trigger("drag",e)
                previousEvent = e

            })
            element.on("touchend.drag", touchend)
            element.on("touchcancel.drag", touchend)


        },
        teardown: function() {
            var element = $(this)
            element.off(".drag")
        }
    }
    $.fn.delegateDrag = function(action) {
        if (action=='disable') {
            this.off('.delegateDrag')
        } else {
            var target = null
            this.on('drag.delegateDrag',function(ev,dd){
                dd.target = dd.originalEvent&&dd.originalEvent.changedTouches?
                        document.elementFromPoint(dd.originalEvent.changedTouches[0].clientX, dd.originalEvent.changedTouches[0].clientY)
                        :dd.target

                if (target!=dd.target) {
                    $(target).trigger('dragend',[dd])
                    $(dd.target).trigger('draginit',[dd])
                } else {
                    $(dd.target).trigger('draginit',[dd])
                }
                target = dd.target

            })
            this.on('dragend.delegateDrag',function(){
                target = null
            })
        }
        return this
    }

})(jQuery)
