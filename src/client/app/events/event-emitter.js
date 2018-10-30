var WolfyEventEmitter = require('wolfy87-eventemitter'),
    customEvents = {}

customEvents['draginit'] = customEvents['drag'] = customEvents['dragend']  = require('./drag')
customEvents['resize']  = require('./resize')

module.exports = class EventEmitter extends WolfyEventEmitter {

    constructor() {

        super()

        this._customBindings = {}
        this._contextEvents = {}

        for (var evt in customEvents) {
            this._customBindings[evt] = {
                bindings: 0
            }
        }

    }

    emitEvent(evt, args) {

        // super.emitEvent(evt, args)
        // Patched emitEvent method
        var listenersMap = this.getListenersAsObject(evt),
            listeners,
            listener,
            i,
            key,
            response

        for (key in listenersMap) {
            // patch: .hasOwnProperty(key) appeared to be slower
            if (listenersMap.key) {
                // patch: don't copy the array, reverse loop instead
                listeners = listenersMap[key]

                for (i = listeners.length - 1; i >= 0; i--) {

                    listener = listeners[i]

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener)
                    }

                    // patch: call instead of apply -> no array wrapper on event data
                    response = listener.listener.call(this, args)

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener)
                    }
                }
            }
        }

        // Event bubbling
        if (args && !args.stopPropagation) {
            if (this.parent) this.parent.emitEvent(evt, args)
        }

        return this

    }

    addListener(evt, listener, options) {

        // Custom event setup

        if (
            customEvents.hasOwnProperty(evt) &&
            typeof customEvents[evt].setup === 'function'
        ) {
            if (this._customBindings[evt].bindings === 0) {
                this._customBindings[evt].options = options
                customEvents[evt].setup.call(this, options)
            }
            this._customBindings[evt].bindings += 1
        }

        if (options && options.context) {
            var hash = options.context.hash
            if (!this._contextEvents[hash]) this._contextEvents[hash] = []
            this._contextEvents[hash].push([evt, listener])
        }

        super.addListener(evt, listener)

        return this

    }

    removeListener(evt, listener) {

        // Custom event teardown

        if (
            customEvents.hasOwnProperty(evt) &&
            typeof customEvents[evt].teardown === 'function' &&
            this._customBindings[evt].bindings !== 0
        ) {
            this._customBindings[evt].bindings -= 1
            if (this._customBindings[evt].bindings === 0 || !listener) {
                var options = this._customBindings[evt].options
                customEvents[evt].teardown.call(this, options)
            }
        }

        // Remove all listeners is none specified

        if (listener) {

            super.removeListener(evt, listener)

        } else {

            this.removeEvent(evt)

        }

        return this

    }

    removeEventContext(context, evt, listener) {

        var events = this._contextEvents[context.hash]

        if (events) {

            for (var i = 0; i < events.length; i++) {

                if (evt && evt !== events[i][0]) continue
                if (listener && listener !== events[i][1]) continue

                this.removeListener(events[i][0], events[i][1])
            }

            if (!this._contextEvents[context.hash].length) delete this._contextEvents[context.hash]

        }

    }

}
