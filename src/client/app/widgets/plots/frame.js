var Widget = require('../common/widget'),
    html = require('nanohtml'),
    {urlParser} = require('../utils'),
    locales = require('../../locales')

class Frame extends Widget {

    static description() {

        return 'Embed a page in a frame (local network only).'

    }

    static defaults() {

        return super.defaults({

            _frame: 'frame',

            border: {type: 'boolean', value: true, help: 'Set to `false` to disable the borders and background-color'},

        }, ['color', 'target', 'precision', 'bypass'], {

            label: {type: 'string|boolean', value: 'auto', help: [
                'Set to `false` to hide completely',
                'Insert icons using the prefix ^ followed by the icon\'s name : ^play, ^pause, etc',
                'If set to `false`, all pointer-events will be disabled on the frame as long as the editor is enabled to ensure it can be selected'
            ]},
            value: {type: 'string', value: '', help: [
                'External web page URL. Only local URLs are allowed (starting with `http://127.0.0.1/`, `http://10.x.x.x/`, `http://192.168.x.x/`, etc)',
            ]}

        })

    }

    constructor(options) {

        super({...options, html: html`<div class="frame"><iframe src="" sandbox="allow-scripts"></iframe></div>`})

        if (!this.getProp('border')) this.container.classList.add('noborder')

        this.frame = DOM.get(this.widget, 'iframe')[0]
        this.errorText = html`<span>${locales('iframe_unauthorized')}<span>`
        this.errorTextMounted = false


    }

    setValue(v, options={}) {

        this.value = v

        var parser = urlParser(this.value)

        if (this.value && parser.isLocal()) {
            this.frame.setAttribute('src', this.value)
            this.widget.classList.remove('error')
            if (this.errorTextMounted) {
                this.widget.removeChild(this.errorText)
                this.errorTextMounted = false
            }
        } else {
            this.frame.setAttribute('src', '')
            this.widget.classList.add('error')
            this.widget.appendChild(this.errorText)
            this.errorTextMounted = true
        }

        if (options.sync) this.changed(options)

    }


}

module.exports = Frame
