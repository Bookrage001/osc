var osc = require('../../osc'),
    shortid = require('shortid'),
    {widgetManager} = require('../../managers')

module.exports = class _widgets_base {

    static defaults() {

        throw 'Calling unimplemented static defaults() method'

    }

    static createHash() {

        return shortid.generate()
    }

    constructor(props, widgetContainer, widgetHtml) {

        this.container = widgetContainer
        this.widget = $(widgetHtml)
        this.props = props
        this.hash = _widgets_base.createHash()


    }

    sendValue(overrides) {

        var data = {
            h:this.hash,
            v:this.value
        }

        if (overrides) {
            for (var k in overrides) {
                data[k] = overrides[k]
            }
        }

        osc.send(data)

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
            for (let key in obj) {
                copy[key] = _widgets_base.deepCopy(obj[key])
            }
        }

        return copy

    }

    getProp(key) {

        var opt = this.props[key]

        if (typeof opt == 'string' && opt.indexOf('@{') != -1) {
            opt = opt.replace(/@\{([^\}]+)\}/g, (m)=>{
                let id = m.substr(2, m.length - 3).split('.'),
                    k = id.pop()
                id = id.join('.')

                var widgets = widgetManager.getWidgetById(id)
                for (var i in widgets) {
                    if (widgets[i].props.hasOwnProperty(k)) {
                        return widgets[i].getProp(k)
                    }
                }
            })

        }

        return opt


    }

}
