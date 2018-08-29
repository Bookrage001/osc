var Widget = require('../common/widget'),
    {clip} = require('../utils')

module.exports = class Rbgled extends Widget {

    static defaults() {

        return super.defaults({}, ['color', 'target', 'precision', 'bypass'], {})

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }

        var html = `
            <div class="led">
            </div>
        `

        super({...options, html: html})

        this.setValue([0,0,0,0])

    }


    setValue(v, options={}) {

        var c = ''

        if (Array.isArray(v) && v.length >= 3) {

            for (let i in [0,1,2]) {
                v[i] = parseInt(clip(v[i],[0,255]))
            }

            v[3] = clip(v[3] != undefined ? v[3] : 1,[0,1])

            c = `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${v[3]})`

        } else if (typeof v == 'string') {

            c = v


        } else {

            return

        }

        this.value = v

        this.widget.style.setProperty('--color-led', c)

        if (options.sync) this.changed(options)

    }

}
