var WolfyEventEmitter = require('wolfy87-eventemitter')

module.exports = class EventEmitter extends WolfyEventEmitter {

    emitEvent(evt, args) {

        super.emitEvent(evt, args)

        if (args[0] && !args[0].stopPropagation) {
            if (this.parent) this.parent.emitEvent(evt, args)
        }

        return this

    }

}
