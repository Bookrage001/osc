var Fader = require('../sliders/fader')

module.exports = class _fake_fader extends Fader {

    constructor(options) {

        super(options)

        if (options.cancelDraw) this.batchDraw = ()=>{}
    }

    sendValue() {
        // disabled
    }

}
