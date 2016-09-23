var {mapToScale} = require('../utils'),
    _canvas_base = require('../common/_canvas_base')

var _plots_base = module.exports = function(){

    this.widget = $(`
        <div class="plot">
            <canvas></canvas>
        </div>
    `)

    _canvas_base.apply(this,arguments)

    this.data = []
    this.linkedWidgets = []
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


    $('body').on('sync',this.syncHandleProxy.bind(this))

}

_plots_base.prototype = Object.create(_canvas_base.prototype)

_plots_base.prototype.constructor = _plots_base

_plots_base.prototype.syncHandleProxy = function() {
    this.syncHandle.apply(this,arguments)
}

_plots_base.prototype.syncHandle = function(e,id,w) {
    if (this.linkedWidgets.indexOf(id)==-1 || !WIDGETS[id]) return
    this.updateData()
    requestAnimationFrame(this.draw.bind(this))
}

_plots_base.prototype.resizeHandle = function(){
    this.updateData()
    _canvas_base.prototype.resizeHandle.call(this)
}

_plots_base.prototype.draw = function() {

    this.ctx.clearRect(0,0,this.width,this.height)
    this.ctx.beginPath()

    this.draw_data()

    this.ctx.lineWidth = 1*PXSCALE
    this.ctx.strokeStyle = this.colors.custom
    this.ctx.stroke()

    this.ctx.font = PXSCALE * 10 + 'px sans-serif'
    this.ctx.fillStyle = this.colors.text


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

_plots_base.prototype.draw_data = function() {
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
    requestAnimationFrame(this.draw.bind(this))
}

_plots_base.prototype.updateData = function(){
    // update the coordinates to draw
}
