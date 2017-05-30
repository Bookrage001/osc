var Fader = require('../sliders/fader')

module.exports = class _fake_fader extends Fader {

    constructor(props, cancelDraw) {

        super(props, false)

        if (cancelDraw) this.noDraw = true
    }

    sendValue() {
        // disabled
    }

}
