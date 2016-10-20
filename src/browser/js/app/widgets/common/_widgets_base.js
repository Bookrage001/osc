var {sendOsc} = require('../utils')


var _widget_base = module.exports = function(widgetData) {
    this.widgetData = widgetData
}

_widget_base.prototype.sendValue = function() {

    var args = this.widgetData.preArgs.concat(this.value)

    sendOsc({
        target:this.widgetData.target,
        path:this.widgetData.path,
        precision:this.widgetData.precision,
        args:args,
        syncOnly:this.split?true:false
    })

    if (this.split) {
        var n = 0
        for (i in this.split) {
            sendOsc({
                target:this.widgetData.target,
                path:this.split[i],
                precision:this.widgetData.precision,
                args:this.widgetData.preArgs.concat(this.value[n]),
                sync:false

            })
            n++
        }
    }

}
