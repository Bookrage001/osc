var DomParserFragment = document.createRange()
    DomParserFragment.selectNode(document.body)

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

    },

    get: function(a, b) {

        var context = b ? a : document,
            selector = b || a

        var nodes = context.querySelectorAll(selector)
        return NodeList.prototype.forEach ? nodes : [...nodes]

    },

    create: function(html) {

        return DomParserFragment.createContextualFragment(html.trim()).firstChild

    },

    each: function(context, selector, callback) {

        return module.exports.get(context, selector).forEach(callback)

    }

}
