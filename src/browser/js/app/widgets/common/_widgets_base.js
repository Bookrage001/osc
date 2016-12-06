var {sendOsc} = require('../utils')


var _widget_base = module.exports = function(widgetData) {
    this.widgetData = widgetData
}

_widget_base.prototype.sendValue = function() {

    var args = this.widgetData.preArgs.concat(this.value)

    sendOsc({
        target:this.widgetData.target,
        address:this.widgetData.address,
        precision:this.widgetData.precision,
        args:args,
        syncOnly:this.split?true:false
    })

    if (this.split) {
        var n = 0
        for (i in this.split) {
            sendOsc({
                target:this.widgetData.target,
                address:this.split[i],
                precision:this.widgetData.precision,
                args:this.widgetData.preArgs.concat(this.value[n]),
                sync:false

            })
            n++
        }
    }

}

_widget_base.prototype.getValue = function() {

    if (typeof this.value == 'object') {

        return (()=>{

            var a = []

            for (i in this.value)  {
                a.push(this.value[i])
            }
            
            return a

        })()

    } else {

        return this.value

    }

}
