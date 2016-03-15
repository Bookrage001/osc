/* jquery.reize
 * based on jQuery resize event (@ "Cowboy" Ben Alman  http://benalman.com/projects/jquery-resize-plugin/)
 * just lighter and faster
*/
(function($){

    var elems = [],
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

    function resizePollingLoop() {

        // yep, setTimeout, 'cuz requestAnimation doesn't seem to perform that well
        resizeTimeout = window.setTimeout(function(){
            // Iterate over all elements to which the 'resize' event is bound.
            for (var i = elems.length - 1; i >= 0; i--) {
                var elem = elems[i],
                    width = elem.offsetWidth,
                    height = elem.offsetHeight,
                    data = {
                        w:elem.resizedataw,
                        h:elem.resizedatah
                    }

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if ( width != data.w || height != data.h ) {
                    elem.resizedataw = width
                    elem.resizedatah = height
                    $(elem).trigger('resize',[width,height])
                }

            }

            // Loop.
            resizePollingLoop()

        }, pollInterval )

    }

})(jQuery)
