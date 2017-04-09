var osc = require('../../osc'),
    shortid = require('shortid')

module.exports = class _widgets_base {

    static options() {

        throw 'Calling unimplemented static options() method'

    }

    static createHash() {

        return shortid.generate()
    }

    constructor(widgetData, widgetContainer, widgetHtml) {

        this.container = widgetContainer
        this.widget = $(widgetHtml)
        this.widgetData = widgetData
        this.hash = _widgets_base.createHash()


    }

    sendValue() {

        osc.send({
            h:this.hash,
            v:this.value
        })

    }

    getValue() {

        return _widgets_base.deepCopy(this.value)

    }

    static deepCopy(obj){

        var copy = obj,
            key

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (key in obj) {
                copy[key] = _widgets_base.deepCopy(obj[key])
            }
        }

        return copy

    }

}
