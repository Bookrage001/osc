var osc = require('../../osc')

module.exports = class OscReceiver {

    constructor(options) {

        var {address, value, parent, propName} = options

        try {
            this.value = JSON.parse(value)
        } catch (err) {
            this.value = value
        }

        this.parent = parent
        this.propNames = [propName]
        this.bindedCallback = this.callback.bind(this)
        this.prefix = ''
        this.setAddress(address)

    }

    setAddress(address) {

        if (this.address !== address) {

            if (this.address) osc.off(this.prefix + this.address, this.bindedCallback, this.parent)

            if (address) this.address = address

            if (this.address[0] !== '/') {
                this.prefix = this.parent.getProp('address') || this.parent.resolveProp('address', undefined, false, this)
                if (this.prefix[this.prefix.length - 1] !== '/') this.prefix += '/'
            }

            osc.on(this.prefix + this.address, this.bindedCallback, {context: this.parent})

        }

    }

    addProp(propName){

        if (!this.propNames.includes(propName)) this.propNames.push(propName)

    }

    callback(args) {

        if (typeof args !== 'object') args = [args]
        var preArgs = this.parent.getProp('preArgs') || []
        if (!Array.isArray(preArgs) && preArgs !== '') preArgs = [preArgs]
        if (args.length >= preArgs.length) {
            for (var i in preArgs) {
                if (preArgs[i] !== args[i]) return
            }
            var val = args.slice(preArgs.length)
            if (val.length < 2) val = val[0]
            try {
                this.value = JSON.parse(val)
            } catch (err) {
                this.value = val
            }
            this.parent.updateProps(this.propNames, this.parent)
        }

    }

}
