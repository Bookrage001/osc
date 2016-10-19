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
        args:args
    })

}
