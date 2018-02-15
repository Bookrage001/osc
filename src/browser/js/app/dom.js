var DomParserFragment,
    readyCallbacks = [],
    initState = false

module.exports = {

    init: function() {

        DomParserFragment = document.createRange()
        DomParserFragment.selectNode(document.body)

        for (var i in readyCallbacks) {
            readyCallbacks[i]()
        }

        initState = true

    },

    ready: function(callback) {
        if (initState) {
            callback()
        } else {
            readyCallbacks.push(callback)
        }
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
    },

    offset: function(element) {

        var offsetLeft = 0,
            offsetTop = 0

        if (element) {
            do {
                if (!isNaN(element.offsetLeft)) {
                    offsetLeft += element.offsetLeft - element.scrollLeft
                }
                if (!isNaN(element.offsetTop)) {
                    offsetTop += element.offsetTop - element.scrollTop
                }
            } while (element = element.offsetParent)
        }

        return {
            left: offsetLeft,
            top: offsetTop
        }
    }

}
