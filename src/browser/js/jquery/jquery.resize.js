/* jquery.resize
 * based on jQuery resize event (@ "Cowboy" Ben Alman  http://benalman.com/projects/jquery-resize-plugin/)
 * just lighter and faster
*/
(function($){

    var elems = [],
        resizedElems = [],
        pollInterval = 250,
        resizeTimeout

    $.event.special.resize = {
      setup: function() {

          if (this===window) return false

          var elem = this

          // Add this element to the list of internal elements to monitor.
          elems.push( elem )

          // If this is the first element added, start the polling loop.
          if ( elems.length === 1 ) {
            resizePollingLoop()
          }
      },
      teardown: function() {

          if (this===window) return false

          var elem = this

          // Remove this element from the list of internal elements to monitor.
          for (var i = elems.length - 1; i >= 0; i--) {
              if(elems[i] == this){
                elems.splice(i, 1)
                break
              }
          }

          if ( !elems.length ) {
            clearTimeout(resizeTimeout)
          }

      },
      add: function(handleObj) {

          if (this===window) return false

          // Save a reference to the bound event handler.
          var old_handler = handleObj.handler

          handleObj.handler = function(event,data) {
            // Call the originally-bound event handler and return its result.
            return old_handler.apply(this, arguments)
          }
      }
    }

    function checkResizes(){
        // Iterate over all elements to which the 'resize' event is bound.
        resizedElems = []
        for (var i = elems.length - 1; i >= 0; i--) {
            var elem = elems[i]

            if (!document.contains(elem)) continue

            var width = elem.offsetWidth,
                height = elem.offsetHeight

            if (!width) continue

            // If element size has changed since the last time, update the element
            // data store and trigger the 'resize' event.
            if ( width != elem.resizedataw || height != elem.resizedatah ) {
                elem.resizedataw = width
                elem.resizedatah = height
                resizedElems.push(elem)
            }
        }
        for (var i = resizedElems.length - 1; i >= 0; i--)  {
            $(resizedElems[i]).triggerHandler('resize',[resizedElems[i].resizedataw,resizedElems[i].resizedatah])
        }

    }

    function resizePollingLoop() {
        // yep, setTimeout, 'cuz requestAnimation doesn't seem to perform that well
        checkResizes()
        resizeTimeout = window.setTimeout(resizePollingLoop, pollInterval)

    }

    $(window).resize(checkResizes)
    resizePollingLoop()

})(jQuery)
