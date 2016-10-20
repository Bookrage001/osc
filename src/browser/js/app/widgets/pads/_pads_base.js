var Fader = require('../sliders/fader')
var _canvas_base = require('../common/_canvas_base')

var _pads_base = module.exports = function(){

    this.widget = $(`
        <div class="pad">
            <div class="wrapper">
                <canvas></canvas>
            </div>
        </div>
    `)
    this.wrapper = this.widget.find('.wrapper')
    _canvas_base.apply(this, arguments)


}

_pads_base.prototype = Object.create(_canvas_base.prototype)

_pads_base.prototype.constructor = _pads_base


_pads_base.prototype.setValue = function(v,options={}) {
    if (typeof v != 'number') return

}
