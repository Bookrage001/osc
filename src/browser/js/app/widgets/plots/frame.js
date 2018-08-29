var Widget = require('../common/widget'),
    locales = require('../../locales'),
    localUrlRe = /(^127\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^172\.1[6-9]{1}[0-9]{0,1}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^172\.2[0-9]{1}[0-9]{0,1}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^172\.3[0-1]{1}[0-9]{0,1}\.[0-9]{1,3}\.[0-9]{1,3}$)|(^192\.168\.[0-9]{1,3}\.[0-9]{1,3}$)/

class Frame extends Widget {

    static defaults() {

        return super.defaults({

            _frame: 'frame',

            border: {type: 'boolean', value: true, help: 'Set to `false` to disable the borders and background-color'},

        }, ['color', 'target', 'precision', 'bypass'], {})

    }

    constructor(options) {

        super({...options, html: '<div class="frame"><iframe src=""></iframe></div>'})

        if (!this.getProp('border')) this.container.classList.add('noborder')

        this.frame = DOM.get(this.widget, 'iframe')[0]
        this.errorText = DOM.create('<span>' + locales('iframe_unauthorized') + '<span>')
        this.errorTextMounted = false


    }

    setValue(v, options={}) {

        this.value = v

        var parser = document.createElement('a')
        parser.href = this.value

        if (parser.hostname.match(localUrlRe)) {
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
