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

    constructor(options={}) {

        this.container = options.container
        this.widget = $(options.html)
        this.props = options.props
        this.parent = options.parent
        this.hash = _widgets_base.createHash()

        // Turn preArgs into array
        if (this.props.preArgs != undefined && !Array.isArray(this.getProp('preArgs'))) {
            this.props.preArgs = [this.props.preArgs]
        }

        // Turn preArgs into array
        if (this.props.target != undefined && !Array.isArray(this.getProp('target'))) {
            this.props.target = [this.props.target]
        }

        if (this.props.precision) {
            this.precision = Math.min(20,Math.max(this.getProp('precision'),0))
        }
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

    getProp(key, opt) {

        var opt = key == null ? opt : _widgets_base.deepCopy(this.props[key]),
            obj

        if (typeof opt == 'string' && opt.indexOf('@{') != -1) {
            opt = opt.replace(/@\{([^\}]+)\}/g, (m)=>{
                let id = m.substr(2, m.length - 3).split('.'),
                    k = id.pop()
                id = id.join('.')

                var widgets = id == 'parent' && this.parent ?
                    [this.parent] : widgetManager.getWidgetById(id)

                for (var i in widgets) {
                    if (widgets[i].props.hasOwnProperty(k)) {
                        var r = widgets[i].getProp(k)
                        if (typeof r != 'string') r = JSON.stringify(r)
                        return r
                    }
                }
            })

            try {
                opt = JSON.parse(opt)
            } catch (err) {}

        } else if (opt != null && typeof opt == 'object') {
            for (var k in opt) {
                opt[k] = this.getProp(null, opt[k])
            }
        }

        return opt


    }

}
