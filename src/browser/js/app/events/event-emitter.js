var WolfyEventEmitter = require('wolfy87-eventemitter'),
    customEvents = {}

customEvents['draginit'] = customEvents['drag'] = customEvents['dragend']  = require('./drag')

module.exports = class EventEmitter extends WolfyEventEmitter {

    constructor() {

        super()

        this._customBindings = {}

        for (var evt in customEvents) {
            this._customBindings[evt] = {
                bindings: 0
            }
        }

    }

    emitEvent(evt, args) {

        // Event bubbling

        super.emitEvent(evt, args)

        if (args[0] && !args[0].stopPropagation) {
            if (this.parent) this.parent.emitEvent(evt, args)
        }

        return this

    }

    addListener(evt, listener, options) {

        // Custom event setup

        var eventName = typeof evt == 'string' ? evt.split('.')[0] : ''

        if (
            customEvents.hasOwnProperty(eventName) &&
            typeof customEvents[eventName].setup === 'function'
        ) {
            if (this._customBindings[eventName].bindings === 0) {
                this._customBindings[eventName].options = options
                customEvents[eventName].setup.call(this, options)
            }
            this._customBindings[eventName].bindings += 1
        }

        super.addListener(evt, listener)

        return this

    }

    removeListener(evt, listener) {

        // Custom event teardown

        var eventName = typeof evt == 'string' ? evt.split('.')[0] : ''

        if (
            customEvents.hasOwnProperty(eventName) &&
            typeof customEvents[eventName].teardown === 'function' &&
            this._customBindings[eventName].bindings !== 0
        ) {
            this._customBindings[eventName].bindings -= 1
            if (this._customBindings[eventName].bindings === 0 || !listener) {
                var options = this._customBindings[eventName].options
                customEvents[eventName].teardown.call(this, options)
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

}
