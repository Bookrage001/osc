var Widget = require('../common/widget'),
    ipc = require('../../ipc'),
    html = require('nanohtml'),
    {urlParser} = require('../utils')

module.exports = class Image extends Widget {

    static description() {

        return 'Load a image (url or base64-encoded).'

    }

    static defaults() {

        return super.defaults({

            _image:'image',

            size: {type: 'string', value: 'cover', help: 'CSS background-size'},
            position: {type: 'string', value: 'center', help: 'CSS background-position'},
            repeat: {type: 'string', value: 'no-repeat', help: 'CSS background-repeat'},
            border: {type: 'boolean', value: true, help: 'Set to `false` to disable the borders and background-color'},
            cache: {type: 'boolean', value: true, help: [
                'Set to false to disable image caching (forces file reload when updating or editing the widget).',
                'When true, sending `reload` to the widget reloads its image without changing its value'
            ]}

        }, ['color', 'target', 'precision', 'bypass'], {

            value: {type: 'string', value: '', help: [
                '- File `url` or `absolute path`',
                '- Base64 encoded image : `data:image/...`'
            ]}

        })

    }

    constructor(options) {

        super({...options, html: html`<div class="image"></div>`})

        if (!this.getProp('border')) this.container.classList.add('noborder')

        this.widget.style.setProperty('background-size', this.getProp('size'))
        this.widget.style.setProperty('background-position', this.getProp('position'))
        this.widget.style.setProperty('background-repeat', this.getProp('repeat'))

    }

    setValue(v, options={}) {

        var s = v==null ? '' : '' + v,
            cache_query = ''

        if (!s.length) {

            this.value = this.getProp('value')

        } else if (s != 'reload') {

            if (s.length > 1) this.value = s

        }

        if (typeof this.value === 'string' && this.value.length) {

            if ((s === 'reload' || !this.getProp('cache')) && this.value.indexOf('base64') === -1) {
                cache_query = (this.value.indexOf('?') != -1 ? '&' : '?') + Date.now()
            }

        }

        var url = this.value,
            parser = urlParser(url)

        // escpape windows absolute file paths
        if (!parser.protocol.match(/http|data/)) url = url.replace(':', '_:_')
        url = url.replace(/\\/g, '\\\\')

        this.widget.style.setProperty('background-image', `url("${url}${cache_query}")`)

        if (options.sync) this.changed(options)

    }

    onRemove() {

        if (this.bindedOnStreamUpdate) ipc.off('video', this.bindedOnStreamUpdate)
        super.onRemove()

    }

}
