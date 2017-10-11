var {mapToScale} = require('../utils'),
    _widgets_base = require('../common/_widgets_base'),
    _canvas_base = require('../common/_canvas_base'),
    {widgetManager} = require('../../managers')

module.exports = class _plots_base extends _canvas_base {

    constructor(options) {

        var html = `
            <div class="plot">
                <canvas></canvas>
            </div>
        `

        super({...options, html: html})

        this.data = []
        this.linkedWidgets = []
        this.rangeX = this.getProp('rangeX') || {min:0,max:1}
        this.rangeY = this.getProp('rangeY') || {min:0,max:1}
        this.logScaleX = this.getProp('logScaleX')
        this.logScaleY = this.getProp('logScaleY')
        this.pips = {
            x : {
                min: Math.abs(this.rangeX.min)>=1000?this.rangeY.min/1000+'k':this.rangeX.min,
                max: Math.abs(this.rangeX.max)>=1000?this.rangeY.max/1000+'k':this.rangeX.max
            },
            y : {
                min: Math.abs(this.rangeY.min)>=1000?this.rangeY.min/1000+'k':this.rangeY.min,
                max: Math.abs(this.rangeY.max)>=1000?this.rangeY.max/1000+'k':this.rangeY.max
            }
        }
        this.smooth = this.getProp('smooth') === true ? 0.25 : this.getProp('smooth') === false ? 0 : parseFloat(this.getProp('smooth')) || 0



        $('body').on(`change.${this.hash}`,this.syncHandleProxy.bind(this))

    }

    syncHandleProxy() {

        this.syncHandle(...arguments)

    }

    onRemove() {

        $('body').off(`change.${this.hash}`)
        super.onRemove()

    }

    syncHandle(e) {

        if (this.linkedWidgets.indexOf(e.id)==-1 || !widgetManager.getWidgetById(e.id).length) return
        this.updateData()
        this.draw()

    }

    resizeHandle() {

        this.updateData()
        super.resizeHandle(...arguments)

    }

    draw() {

        this.ctx.clearRect(0,0,this.width,this.height)
        this.ctx.beginPath()

        if (!this.width) return

        this.draw_data()

        this.ctx.globalAlpha = 0.7
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.strokeStyle = this.colors.custom
        this.ctx.stroke()

        if (this.getProp('origin') !== false) {

            var origin = mapToScale(this.getProp('origin') || this.rangeY.min,[this.rangeY.min,this.rangeY.max],[this.height,0],0,this.getProp('logScaleY'),true)

            this.ctx.globalAlpha = 0.1
            this.ctx.fillStyle = this.colors.custom
            this.ctx.lineTo(this.width,origin)
            this.ctx.lineTo(0,origin)
            this.ctx.closePath()
            this.ctx.fill()

        }


        this.ctx.globalAlpha = 1
        this.ctx.font = PXSCALE * 10 + 'px sans-serif'
        this.ctx.fillStyle = this.colors.text

        if (this.getProp('pips')) {

            if (this.pips.x) {

                this.ctx.textBaseline = "bottom"
                this.ctx.textAlign = 'left'
                this.ctx.fillText(this.pips.x.min,(this.pips.y?12:2)*PXSCALE,this.height)
                this.ctx.textAlign = 'right'
                this.ctx.fillText(this.pips.x.max,this.width-2*PXSCALE,this.height)

            }

            if (this.pips.y) {

                this.ctx.save()
                this.ctx.translate(0, this.height)
                this.ctx.rotate(-Math.PI/2)

                this.ctx.textBaseline = "top"
                this.ctx.textAlign = 'left'
                this.ctx.fillText(this.pips.y.min,(this.pips.x?12:2)*PXSCALE,2*PXSCALE)
                this.ctx.textAlign = 'right'
                this.ctx.fillText(this.pips.y.max,this.height-2*PXSCALE,2*PXSCALE)
                this.ctx.rotate(Math.PI/2)
                this.ctx.restore()

            }

        }

    }

    draw_data() {

        var points = []
        for (let i in this.data) {

            if (this.data[i].length) {
                points.push(mapToScale(this.data[i][0],[this.rangeX.min,this.rangeX.max],[0,this.width],0,this.logScaleX,true))
                points.push(mapToScale(this.data[i][1],[this.rangeY.min,this.rangeY.max],[this.height-2*PXSCALE,2*PXSCALE],0,this.logScaleY,true))
            } else {
                points.push(mapToScale(i,[0,this.data.length-1],[0,this.width],0,this.logScaleX,true))
                points.push(mapToScale(this.data[i],[this.rangeY.min,this.rangeY.max],[this.height-2*PXSCALE,2*PXSCALE],0,this.logScaleY,true))
            }

        }

        this.ctx.curve(points, this.smooth, Math.round(this.width/(points.length/2 - 1)))

    }

    setValue(v) {

        this.data = v
        this.draw()

    }

    getValue() {

        return _widgets_base.deepCopy(this.data)

    }

    updateData() {

        // update the coordinates to draw

    }

}
