var DomParserFragment,
    readyCallbacks = []

module.exports = {

    init: function() {

        DomParserFragment = document.createRange()
        DomParserFragment.selectNode(document.body)

        for (var i in readyCallbacks) {
            readyCallbacks[i]()
        }

    },

    ready: function(callback) {
        readyCallbacks.push(callback)
    },

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

        if (selector.indexOf('>') == 0) selector = ':scope ' + selector

        var nodes = context.querySelectorAll(selector)
        return NodeList.prototype.forEach ? nodes : [...nodes]

    },

    create: function(html) {

        return DomParserFragment.createContextualFragment(html.trim()).firstChild

    },

    each: function(context, selector, callback) {

        var nodes = module.exports.get(context, selector)

        nodes.forEach(callback)

        return nodes

    },

    index: function(element) {
        var parent = element.parentNode
        return parent ? Array.prototype.indexOf.call(parent.children, element) : -1
    }

}
