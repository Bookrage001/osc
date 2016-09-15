var {mapToScale} = require('../utils')

var _plots_base = module.exports = function(widgetData){

    this.widgetData = widgetData

    this.widget = $(`
            <div class="plot">
                 <canvas></canvas>
            </div>
            `)
    this.canvas = this.widget.find('canvas')
    this.ctx = this.canvas[0].getContext('2d')
    this.data = []
    this.height = undefined
    this.width = undefined
    this.linkedWidgets = []
    this.visible = false
    this.textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-fade')
    this.rangeX = this.widgetData.rangeX || {min:0,max:1}
    this.rangeY = this.widgetData.rangeY || {min:0,max:1}
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


    this.canvas.resize(this.resizeHandleProxy.bind(this))
    $('body').on('sync',this.syncHandleProxy.bind(this))

}

_plots_base.prototype.syncHandleProxy = function() {
    this.syncHandle.apply(this,arguments)
}

_plots_base.prototype.resizeHandleProxy = function() {
    this.resizeHandle.apply(this,arguments)
}


_plots_base.prototype.syncHandle = function(e,id,w) {
    if (this.linkedWidgets.indexOf(id)==-1 || !WIDGETS[id]) return
    this.updateData()
    requestAnimationFrame(this._draw.bind(this))
}


_plots_base.prototype.resizeHandle = function(){
    console.log('rg')
    var width = this.canvas.width(),
        height = this.canvas.height()

    if (height==100 && width==100) return

    if (!self.visible) {
        this.visible = true
        this.lineColor = getComputedStyle(this.widget[0]).getPropertyValue('--color-custom')
    }

    this.height=height
    this.width=width

    this.canvas[0].setAttribute('width',width)
    this.canvas[0].setAttribute('height',height)

    this.updateData()
    requestAnimationFrame(this._draw.bind(this))

}


_plots_base.prototype._draw = function() {

    this.ctx.clearRect(0,0,this.width,this.height)
    this.ctx.beginPath()

    this.draw()

    this.ctx.lineWidth = 1*PXSCALE
    this.ctx.strokeStyle = this.lineColor
    this.ctx.stroke()

    this.ctx.font = PXSCALE * 10 + 'px sans-serif'
    this.ctx.fillStyle = this.textColor


    this.ctx.textBaseline = "bottom"
    this.ctx.textAlign = 'left'
    this.ctx.fillText(this.pips.x.min,12*PXSCALE,this.height)
    this.ctx.textAlign = 'right'
    this.ctx.fillText(this.pips.x.max,this.width-10,this.height)

    this.ctx.save()
    this.ctx.translate(0, this.height)
    this.ctx.rotate(-Math.PI/2)

    this.ctx.textBaseline = "top"
    this.ctx.textAlign = 'left'
    this.ctx.fillText(this.pips.y.min,12*PXSCALE,2*PXSCALE)
    this.ctx.textAlign = 'right'
    this.ctx.fillText(this.pips.y.max,this.height-10*PXSCALE,2*PXSCALE)
    this.ctx.rotate(Math.PI/2)
    this.ctx.restore()

}

_plots_base.prototype.draw = function() {
    var first = true
    var point = []
    for (i in this.data) {

        if (this.data[i][1]>this.rangeY.max || this.data[i][1]<this.rangeY.min ||
            this.data[i][0]>this.rangeX.max || this.data[i][0]<this.rangeX.min) continue

        var newpoint = this.data[i].length?
                [
                    mapToScale(this.data[i][0],[this.rangeX.min,this.rangeX.max],[15*PXSCALE,this.width-15*PXSCALE],0,this.widgetData.logScaleX,true),
                    mapToScale(this.data[i][1],[this.rangeY.min,this.rangeY.max],[this.height-15*PXSCALE,15*PXSCALE],0,this.widgetData.logScaleY,true),
                ]
                :
                [
                    mapToScale(i,[0,this.data.length-1],[15*PXSCALE,this.width-15*PXSCALE],0,this.widgetData.logScaleX,true),
                    mapToScale(this.data[i],[this.rangeY.min,this.rangeY.max],[this.height-15*PXSCALE,15*PXSCALE],0,this.widgetData.logScaleY,true),
                ]


        if (first) {
            this.ctx.moveTo(newpoint[0],newpoint[1])
            first = false
        } else {
            this.ctx.moveTo(point[0],point[1])
            this.ctx.lineTo(newpoint[0],newpoint[1])
        }
        point = newpoint
    }
}

_plots_base.prototype.setValue = function(v) {
    this.data = v
    requestAnimationFrame(this._draw.bind(this))
}


_plots_base.prototype.updateData = function(){
    // update the coordinates to draw
}
