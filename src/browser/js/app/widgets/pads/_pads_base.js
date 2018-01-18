var _canvas_base = require('../common/_canvas_base')

module.exports = class _pads_base extends _canvas_base {

    constructor(options) {

        var html = `
            <div class="pad">
                <div class="wrapper">
                    <canvas></canvas>
                </div>
            </div>
        `

        super({...options, html: html})

        this.wrapper = DOM.get(this.widget, '.wrapper')[0]

        this.pointSize = parseInt(this.getProp('pointSize'))
        this.widget.style.setProperty('--pointSize', this.pointSize + 'rem')

    }

}
