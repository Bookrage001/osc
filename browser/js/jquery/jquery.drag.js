// jQuery drag event handler
// note: triggerHandler() is used instead of trigger() when event bubblig is not
// necessary, this increases performances a lot.
;(function($){
    var events = 'ontouchstart' in window ?
            {start:'touchstart.drag',stop:'touchend.drag touchcancel.drag',move:'touchmove.drag',touch:true}:
            {start:'mousedown.drag',stop:'mouseup.drag',move:'mousemove.drag',touch:false}
        $document = $(document),
        getOffset = function(obj) {
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

    $.fn.handleDragging = function(traversing) {

        // mouse single touch handler
        if (!events.touch) {

            var previousEvent = null,
                target = null,
                isPointerDown = false

            this.on(events.start,function(e){
                e.stopPropagation()

                isPointerDown = true
                target = $(e.target)
                previousEvent = e

                e.speedX = 0
                e.speedY = 0
                e.deltaX = 0
                e.deltaY = 0


                if (e.button==2)  {
                    e.preventDefault()
                    $(e.target).triggerHandler('fake-right-click',e)
                    return
                }

                target.triggerHandler('draginit',e)
            })

            this.on(events.move,function(e){
                e.stopPropagation()

                if (!isPointerDown) return

                e.speedX = e.pageX - previousEvent.pageX
                e.speedY = e.pageY - previousEvent.pageY
                e.deltaX = e.speedX + previousEvent.deltaX
                e.deltaY = e.speedY + previousEvent.deltaY


                if (traversing || TRAVERSING) {
                    target = $(e.target)
                    if (target[0]!=previousEvent.target) {
                        $(previousEvent.target).trigger('dragend',e)
                    }
                    e.preventDefault()
                    target.triggerHandler('draginit',e)
                } else {
                    target.triggerHandler('drag',e)
                }

                previousEvent = e
            })

            $document.on(events.stop,function(e){
                e.stopPropagation()

                if (!isPointerDown) return

                e.speedX = e.pageX - previousEvent.pageX
                e.speedY = e.pageY - previousEvent.pageY
                e.deltaX = e.deltaX + previousEvent.deltaX
                e.deltaY = e.deltaY + previousEvent.deltaY


                target.trigger('dragend',e)
                isPointerDown = false
            })

        }


        // multi touch hanlder
        if (events.touch) {

            var targets = {},
                previousTouches = {},
                touchTapTimer = false

            this.on(events.start,function(e){
                // e.stopPropagation()
                var oE = e.originalEvent

                for (i in oE.changedTouches) {
                    if (isNaN(i)) continue

                    var touch = oE.changedTouches[i],
                        id = touch.identifier

                    targets[id] = $(touch.target)
                    previousTouches[id] = touch

                    touch.speedX = 0
                    touch.speedY = 0

                    touch.deltaX = 0
                    touch.deltaY = 0

                    var off = getOffset(touch.target)
                    touch.offsetX = touch.pageX-off.left
                    touch.offsetY = touch.pageY-off.top

                    targets[id].triggerHandler('draginit',[touch,e])

                }

                if (!touchTapTimer&&oE.touches.length==1) {
                    touchTapTimer = setTimeout(function(){
                        $(oE.changedTouches[0].target).triggerHandler('fake-right-click',oE.changedTouches[0])
                    },600)
                } else {
                    clearTimeout(touchTapTimer)
                    touchTapTimer = false
                }

            })

            this.on(events.move,function(e){
                // e.stopPropagation()
                var oE = e.originalEvent


                if (touchTapTimer) {
                    clearTimeout(touchTapTimer)
                    touchTapTimer = false
                }

                for (i in oE.changedTouches) {
                    if (isNaN(i)) continue

                    var touch = oE.changedTouches[i],
                        id = touch.identifier

                    touch.speedX = touch.pageX - previousTouches[id].pageX
                    touch.speedY = touch.pageY - previousTouches[id].pageY

                    touch.deltaX = touch.speedX + previousTouches[id].deltaX
                    touch.deltaY = touch.speedY + previousTouches[id].deltaY

                    touch.offsetX = previousTouches[id].offsetX+touch.speedX
                    touch.offsetY = previousTouches[id].offsetY+touch.speedY

                    if (traversing || TRAVERSING) {

                        targets[id] = $(document.elementFromPoint(touch.clientX, touch.clientY))
                        var previousTarget = document.elementFromPoint(previousTouches[id].clientX, previousTouches[id].clientY)
                        if (targets[id][0]!=previousTarget) {
                            var off = getOffset(targets[id][0])
                            touch.offsetX = touch.pageX-off.left
                            touch.offsetY = touch.pageY-off.top
                            $(previousTarget).trigger('dragend',[touch,e])
                        }
                        e.preventDefault()
                        if (this.contains(targets[id][0])) targets[id].triggerHandler('draginit',[touch,e])

                    } else {

                        targets[id].triggerHandler('drag',[touch,e])

                    }

                    previousTouches[id] = touch

                }

            })

            $document.on(events.stop,function(e){
                e.stopPropagation()

                var oE = e.originalEvent

                for (i in oE.changedTouches) {

                    if (isNaN(i)) continue

                    var touch = oE.changedTouches[i],
                        id = touch.identifier

                    $(oE.changedTouches[i].target).trigger('dragend',[touch,e])

                    delete previousTouches[id]
                    delete targets[id]

                }

                if (touchTapTimer) {
                    clearTimeout(touchTapTimer)
                    touchTapTimer = false
                }

            })
        }



        return this

    }

    $document.handleDragging()

    if (events.touch) {
        $document.on('mousedown',function(e){
            if (e.toElement.tagName!='INPUT') return false
        })
    }

})(jQuery)
