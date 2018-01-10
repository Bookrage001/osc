var _widgets_base = require('./_widgets_base')

var drawQueue = {},
    flushDrawQueue = ()=>{
        for (var h in drawQueue) {
            drawQueue[h].draw()
        }
        drawQueue = {}
    },
    drawQueueLoop = ()=>{
        requestAnimationFrame(flushDrawQueue)
        setTimeout(drawQueueLoop, 1000 / 60)
    }

drawQueueLoop()



module.exports = class _canvas_base extends _widgets_base {

    constructor(options) {

        super(options)

        this.canvas = this.widget.find('canvas')
        this.ctx = this.canvas[0].getContext('2d')

        this.height = undefined
        this.width = undefined
        this.scaling = 1

        this.clearRect = []

        this.visible = false

        this.colors = {}
        this.textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-fade')

        this.canvas.on('resize',this.resizeHandleProxy.bind(this))

        this.ctx.arc = (x, y, r, s, e, c)=>{

            CanvasRenderingContext2D.prototype.arc.call(this.ctx, x, y, Math.max(0,r), s, e, c)

        }

    }

    resizeHandleProxy() {

        this.resizeHandle(...arguments)

    }

    resizeHandle(e, width, height, checkColors){

        var width = width,
            height = height,
            ratio = CANVAS_SCALING * this.scaling

        if (width && height) {

            this.height=height
            this.width=width

            this.canvas[0].setAttribute('width',width * ratio)
            this.canvas[0].setAttribute('height',height * ratio)

            this.clearRect = []

            if (ratio != 1) {
                this.ctx.setTransform(1, 0, 0, 1, 0, 0)
                this.ctx.scale(ratio, ratio)
            }

        }

        var style =  getComputedStyle(this.widget[0])

        if (!this.visible || checkColors) {
            this.visible = true
            this.colors.custom = style.getPropertyValue('--color-custom')
            this.colors.text = style.getPropertyValue('--color-text')
            this.colors.raised = style.getPropertyValue('--color-raised')
            this.colors.bg = style.getPropertyValue('--color-bg')
            this.colors.fg = style.getPropertyValue('--color-fg')
            this.colors.faded = style.getPropertyValue('--color-faded')
            this.colors.light = style.getPropertyValue('--color-light')
            this.fontFamily = style.getPropertyValue("font-family")
            this.textAlign = style.getPropertyValue("text-align")
        }

        this.fontSize = parseFloat(style.getPropertyValue("font-size"))
        this.fontWeight = parseFloat(style.getPropertyValue("font-weight"))
        this.ctx.font = this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontFamily
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = this.textAlign

        requestAnimationFrame(this.draw.bind(this))

    }

    clear() {

        if (!this.clearRect.length) {
            this.ctx.clearRect(0, 0, this.width, this.height)
            return
        }

        if (typeof this.clearRect[0] == 'object') {
            for (let i in this.clearRect) {
                this.ctx.clearRect(...this.clearRect[i])
            }
            return
        }

        this.ctx.clearRect(...this.clearRect)

    }

    batchDraw() {
        drawQueue[this.hash] = this
    }

    draw(){
        throw 'Calling unimplemented draw() method'
    }

}
