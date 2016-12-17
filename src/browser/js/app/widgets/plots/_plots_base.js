var {mapToScale} = require('../utils'),
    _canvas_base = require('../common/_canvas_base'),
    {widgetManager} = require('../../managers')

module.exports = class _plots_base extends _canvas_base {

    constructor(widgetData) {

        var widgetHtml = `
            <div class="plot">
                <canvas></canvas>
            </div>
        `

        super(...arguments, widgetHtml)

        this.data = []
        this.linkedWidgets = []
        this.rangeX = widgetData.rangeX || {min:0,max:1}
        this.rangeY = widgetData.rangeY || {min:0,max:1}
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


        $('body').on('sync',this.syncHandleProxy.bind(this))

    }

    syncHandleProxy() {

        this.syncHandle(...arguments)

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

        this.draw_data()

        this.ctx.lineWidth = 1*PXSCALE
        this.ctx.strokeStyle = this.colors.custom
        this.ctx.stroke()



        if (this.widgetData.origin !== false) {

            var origin = mapToScale(this.widgetData.origin||this.rangeY.min,[this.rangeY.min,this.rangeY.max],[this.height,0],0,this.widgetData.logScaleY,true)

            this.ctx.globalAlpha = 0.1
            this.ctx.fillStyle = this.colors.custom
            this.ctx.lineTo(this.width,origin)
            this.ctx.lineTo(0,origin)
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.globalAlpha = 1

        }


        this.ctx.font = PXSCALE * 10 + 'px sans-serif'
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

    draw_data() {

        var first = true
        var point = []
        for (i in this.data) {

            if (this.data[i][1]>this.rangeY.max || this.data[i][1]<this.rangeY.min ||
                this.data[i][0]>this.rangeX.max || this.data[i][0]<this.rangeX.min) continue

            var newpoint = this.data[i].length?
                    [
                        mapToScale(this.data[i][0],[this.rangeX.min,this.rangeX.max],[0,this.width],0,this.widgetData.logScaleX,true),
                        mapToScale(this.data[i][1],[this.rangeY.min,this.rangeY.max],[this.height-PXSCALE,PXSCALE],0,this.widgetData.logScaleY,true),
                    ]
                    :
                    [
                        mapToScale(i,[0,this.data.length-1],[0,this.width],0,this.widgetData.logScaleX,true),
                        mapToScale(this.data[i],[this.rangeY.min,this.rangeY.max],[this.height-PXSCALE,PXSCALE],0,this.widgetData.logScaleY,true),
                    ]


            if (first) {
                this.ctx.moveTo(newpoint[0],newpoint[1])
                this.ctx.lineTo(newpoint[0],newpoint[1])
                first = false
            } else {
                // this.ctx.moveTo(point[0],point[1])
                this.ctx.lineTo(newpoint[0],newpoint[1])
            }
            point = newpoint
        }

    }

    setValue(v) {

        this.data = v
        this.draw()

    }

    updateData() {

        // update the coordinates to draw

    }

}
