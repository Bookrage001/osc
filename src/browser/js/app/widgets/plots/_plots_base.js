var {mapToScale} = require('../utils'),
    Widget = require('../common/widget'),
    Canvas = require('../common/canvas'),
    widgetManager = require('../../managers/widgets')

module.exports = class _plots_base extends Canvas {

    constructor(options) {

        var html = `
            <div class="plot">
                <canvas></canvas>
            </div>
        `

        super({...options, html: html})

        this.data = []
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

    }

    resizeHandle() {

        this.updateData()
        super.resizeHandle(...arguments)

    }

    draw() {

        this.ctx.clearRect(0,0,this.width,this.height)

        if (this.getProp('bars')) {
            this.draw_bars()
        } else {
            var points = this.draw_line()
            if (this.getProp('dots')) {
                this.draw_dots(points)
            }
        }

        if (this.getProp('pips')) this.draw_pips()

    }

    draw_pips() {

        this.ctx.globalAlpha = 1
        this.ctx.fillStyle = this.colors.text

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

    draw_line() {

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

        if (points.length < 4) return points

        this.ctx.beginPath()

        this.ctx.curve(points, this.smooth, Math.round(this.width/(points.length/2 - 1)))

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

        return points

    }

    draw_dots(points) {

        this.ctx.globalAlpha = 1
        this.ctx.fillStyle = this.colors.custom
        this.ctx.strokeStyle = this.colors.track
        this.ctx.lineWidth = 2 * PXSCALE
        for (var i = 0; i < points.length; i += 2) {
            this.ctx.beginPath()
            this.ctx.arc(points[i], points[i + 1], 4 * PXSCALE, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }

    }

    draw_bars() {

        var points = [],
            barWidth = Math.round(this.width / this.data.length),
            offset = Math.round((this.width - barWidth * this.data.length) / 2)

        var origin = mapToScale(this.getProp('origin') || this.rangeY.min,[this.rangeY.min,this.rangeY.max],[this.height,0],0,this.getProp('logScaleY'),true)

        this.ctx.beginPath()

        for (let i in this.data) {
            var y = mapToScale(this.data[i].length ? this.data[i][1] : this.data[i],[this.rangeY.min,this.rangeY.max],[this.height-2*PXSCALE,2*PXSCALE],0,this.logScaleY,true)
            this.ctx.rect(offset + i * barWidth, Math.min(y, origin), barWidth - PXSCALE, Math.abs(Math.min(y - origin)))

        }

        this.ctx.globalAlpha = 0.4
        this.ctx.fillStyle = this.colors.custom
        this.ctx.fill()

    }

    setValue(v, options={}) {

        if (typeof v == 'string') {
            try {
                v = JSON.parseFlex(v)
            } catch(err) {}
        }

        if (typeof v == 'object' && v !== null) {

            if (Array.isArray(v)) {

                this.data = v

            } else {

                for (var i in v) {
                    if (!isNaN(i)) this.data[i] = v[i]
                }

            }

            this.batchDraw()

            if (options.sync) this.changed(options)

        }


    }

    getValue() {

        return Widget.deepCopy(this.data)

    }

    updateData() {

        // update the coordinates to draw

    }

}
