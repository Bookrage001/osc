var Fader = require('../sliders/fader')

module.exports = class _fake_fader extends Fader {

    constructor(widgetData, cancelDraw) {

        super(widgetData, false)

        if (cancelDraw) this.noDraw = true
    }

    sendValue() {
        // disabled
    }

}
