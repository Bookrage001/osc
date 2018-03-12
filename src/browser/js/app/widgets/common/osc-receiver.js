var osc = require('../../osc')

module.exports = class OscReceiver {

    constructor(address, value, parent, propName) {

        this.value = value
        this.parent = parent

        osc.on(address  + '.' + parent.hash, (args)=>{

            if (typeof args !== 'object') args = [args]
            var preArgs = parent.getProp('preArgs') || []
            if (args.length >= preArgs.length) {
                for (var i in preArgs) {
                    if (preArgs[i] !== args[i]) return
                }
                var val = args.slice(preArgs.length)
                if (val.length < 2) val = val[0]
                if (val !== this.value) {
                    this.value = val
                    parent.updateProps([propName], parent)
                }
            }
        })

    }

}
