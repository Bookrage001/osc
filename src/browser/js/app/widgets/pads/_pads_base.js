var _canvas_base = require('../common/_canvas_base'),
    osctouchstate = require('../mixins/osc_touch_state')

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

        this.wrapper = this.widget.find('.wrapper')

        this.pointSize = parseInt(this.getProp('pointSize'))
        this.widget[0].style.setProperty('--pointSize', this.pointSize + 'rem')

        if (this.getProp('touchAddress') && this.getProp('touchAddress').length)
            osctouchstate(this, this.wrapper)

    }

}
