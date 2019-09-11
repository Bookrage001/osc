var Widget = require('../common/widget'),
    morph = require('nanomorph'),
    html = require('nanohtml'),
    sanitizeHtml = require('sanitize-html')

var sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']).filter(x=>x!=='iframe')
}

class Html extends Widget {

    static defaults() {

        return super.defaults({

            _html:'html',

            html: {type: 'string', value: '', help: [
                'Allowed HTML tags:',
                '&nbsp;&nbsp;h1-6, blockquote, p, a, ul, ol, nl, li,',
                '&nbsp;&nbsp;b, i, strong, em, strike, code, hr, br, div,',
                '&nbsp;&nbsp;table, thead, img, caption, tbody, tr, th, td, pre'
            ]},
            border: {type: 'boolean', value: true, help: 'Set to `false` to disable the borders and background-color'},

        }, ['color', 'target', 'precision', 'bypass'], {})

    }

    constructor(options) {

        super({...options, html: html`
            <div class="html">
            </div>
        `})

        if (!this.getProp('border')) this.container.classList.add('noborder')

    }

    updateHtml(){

        var newHtml = html`<div class="html"></div>`

        newHtml.innerHTML = sanitizeHtml(this.getProp('html'), sanitizeOptions)

        morph(this.widget, newHtml)

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'html':
                this.updateHtml()
                return

        }

    }


}

Html.dynamicProps = Html.prototype.constructor.dynamicProps.concat(
    'html'
)

module.exports = Html
