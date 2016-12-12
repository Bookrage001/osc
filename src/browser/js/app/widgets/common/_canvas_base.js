var _widgets_base = require('./_widgets_base')

var _canvas_base = module.exports = function() {

    _widgets_base.apply(this,arguments)

    this.canvas = this.widget.find('canvas')
    this.ctx = this.canvas[0].getContext('2d')

    this.height = undefined
    this.width = undefined

    this.visible = false

    this.colors = {}
    this.textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-fade')


    this.canvas.on('resize',this.resizeHandleProxy.bind(this))

    this.ctx.arc = (x, y, r, s, e, c)=>{

        CanvasRenderingContext2D.prototype.arc.call(this.ctx, x, y, Math.max(0,r), s, e, c)

    }

}


_canvas_base.prototype = Object.create(_widgets_base.prototype)

_canvas_base.prototype.constructor = _canvas_base

_canvas_base.prototype.resizeHandleProxy = function() {
    this.resizeHandle.apply(this,arguments)
}

_canvas_base.prototype.resizeHandle = function(e, width, height, checkColors){

    var width = width,
        height = height

    if (width && height) {

        this.height=height
        this.width=width

        this.canvas[0].setAttribute('width',width)
        this.canvas[0].setAttribute('height',height)

    }

    if (!this.visible || checkColors) {
        this.visible = true
        this.colors.custom = getComputedStyle(this.widget[0]).getPropertyValue('--color-custom')
        this.colors.text = getComputedStyle(this.widget[0]).getPropertyValue('--color-text')
        this.colors.raised = getComputedStyle(this.widget[0]).getPropertyValue('--color-raised')
        this.colors.bg = getComputedStyle(this.widget[0]).getPropertyValue('--color-bg')
        this.colors.fg = getComputedStyle(this.widget[0]).getPropertyValue('--color-fg')
        this.colors.faded = getComputedStyle(this.widget[0]).getPropertyValue('--color-faded')
    }

    requestAnimationFrame(this.draw.bind(this))

}

_canvas_base.prototype.draw = function(){
    //
}
