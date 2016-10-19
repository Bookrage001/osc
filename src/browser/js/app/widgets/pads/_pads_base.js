var Fader = require('../sliders/fader')
var _widgets_base = require('../common/_widgets_base')

var _pads_base = module.exports = function(){

    this.widget = $(`
        <div class="pad">
            <div class="wrapper">

            </div>
        </div>
    `)
    this.wrapper = this.widget.find('.wrapper')
    _widgets_base.apply(this, arguments)


}

_pads_base.prototype = Object.create(_widgets_base.prototype)

_pads_base.prototype.constructor = _pads_base


_pads_base.prototype.setValue = function(v,options={}) {
    if (typeof v != 'number') return

}

_pads_base.prototype.showValue = function() {
    this.input.val(this.value + this.unit)
}
