var _canvas_base = require('../common/_canvas_base'),
    osctouchstate = require('../mixins/osctouchstate')

module.exports = class _pads_base extends _canvas_base {

    constructor() {

        var widgetHtml = `
            <div class="pad">
                <div class="wrapper">
                    <canvas></canvas>
                </div>
            </div>
        `

        super(...arguments, widgetHtml)

        this.wrapper = this.widget.find('.wrapper')

        if (this.getProp('touchAddress') && this.getProp('touchAddress').length)
            osctouchstate(this, this.wrapper)

    }

}
