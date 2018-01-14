module.exports = {

    dispatchEvent: function(element, name, data) {

        var event = new CustomEvent(name, {
            detail: data,
            bubbles: true,
            cancelable: true
        })

        element.dispatchEvent(event)

    },

    addEventListener: function(element, events, listener, capture) {

        var eventsAsObject = typeof events == 'string' ? events.split(' ') : events

        for (var i in eventsAsObject) {

            element.addEventListener(eventsAsObject[i], listener, capture)

        }

    }
    
}
