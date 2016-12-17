var _canvas_base = require('../common/_canvas_base')

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

    }

}
