var Canvas = require('../common/canvas')

module.exports = class Pad extends Canvas {

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
