var {Fader} = require('../sliders/fader')

var _fake_fader = module.exports = function(widgetData, cancelDraw){

    this.noDraw = true

    Fader.apply(this, arguments)
}

_fake_fader.prototype = Object.create(Fader.prototype)

_fake_fader.prototype.constructor = _fake_fader

_fake_fader.prototype.sendValue = function(){}
