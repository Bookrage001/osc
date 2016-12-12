/* jquery.resize
 * based on jQuery resize event (@ "Cowboy" Ben Alman  http://benalman.com/projects/jquery-resize-plugin/)
 * just lighter and faster
*/
(function($){

    var elems = []

    $.event.special.resize = {
      setup: function(data, namespaces, handler) {

          if (this===window) return false

          // Add this element to the list of internal elements to monitor.
          elems.push(this)

      },
      teardown: function() {

          if (this===window) return false

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

          this.resizeHandler = handleObj.handler

      }
    }

    function checkResizes(){
        // Iterate over all elements to which the 'resize' event is bound.
        var resizedElems = []
        for (var i = elems.length - 1; i >= 0; i--) {
            var elem = elems[i]

            if (!document.contains(elem)) continue

            var style = window.getComputedStyle(elem),
                width = parseInt(style['width']) - parseInt(style['padding-left']) - parseInt(style['padding-right']),
                height = parseInt(style['height']) - parseInt(style['padding-top']) - parseInt(style['padding-bottom'])

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
            resizedElems[i].resizeHandler(undefined, resizedElems[i].resizedataw, resizedElems[i].resizedatah)
        }

    }

    $(window).resize(checkResizes)

})(jQuery)
