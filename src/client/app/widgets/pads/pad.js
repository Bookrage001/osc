var Canvas = require('../common/canvas'),
    html = require('nanohtml')

class Pad extends Canvas {

    constructor(options) {

        super({...options, html: html`
            <div class="pad">
                <div class="wrapper">
                    <canvas></canvas>
                </div>
            </div>
        `})

        this.wrapper = DOM.get(this.widget, '.wrapper')[0]

        this.pointSize = parseInt(this.getProp('pointSize'))
        this.widget.style.setProperty('--pointSize', this.pointSize + 'rem')

    }

    cacheCanvasStyle(style) {

        style = style || window.getComputedStyle(this.canvas)

        super.cacheCanvasStyle(style)

        this.colors.pips = style.getPropertyValue('--color-pips') || this.colors.custom
        this.colors.pipsOpacity = style.getPropertyValue('--pips-opacity')
        this.colors.pointOpacity = style.getPropertyValue('--point-opacity')

    }

}

Pad.dynamicProps = Pad.prototype.constructor.dynamicProps.filter(n => n !== 'precision')

module.exports = Pad
