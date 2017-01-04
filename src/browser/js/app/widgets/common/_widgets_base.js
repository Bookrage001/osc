var osc = require('../../osc')

module.exports = class _widgets_base {

    static options() {

        throw 'Calling unimplemented static options() method'

    }

    static createHash() {

        return String(Math.random()).split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);

    }

    constructor(widgetData, widgetContainer, widgetHtml) {

        this.container = widgetContainer
        this.widget = $(widgetHtml)
        this.widgetData = widgetData
        this.hash = _widgets_base.createHash()


    }

    sendValue() {

        var args = this.widgetData.preArgs.concat(this.value)

        osc.send({
            target:this.widgetData.target,
            address:this.widgetData.address,
            precision:this.widgetData.precision,
            args:args,
            syncOnly:this.split?true:false
        })

        if (this.split) {
            var n = 0
            for (i in this.split) {
                osc.send({
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

    getValue() {

        return _widgets_base.deepCopy(this.value)

    }

    static deepCopy(obj){

        var copy = obj,
            key

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (key in obj) {
                copy[key] = _widgets_base.deepCopy(obj[key])
            }
        }

        return copy

    }

}
