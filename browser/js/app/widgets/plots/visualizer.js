var {mapToScale, clip} = require('../utils'),
    _plots_base = require('./_plots_base')

module.exports.options = {
	type:'visualizer',
	id:'auto',

	separator1:'style',

	label:'auto',
	left:'auto',
	top:'auto',
	width:'auto',
	height:'auto',
    color:'auto',
	css:'',

	separator2:'plot',

	widgetId:'',
    duration:1,
	range: {min:0,max:1},
    logScale: false,

    separator3:'osc',

    path:'auto',
    preArgs:[],
}

var Visualizer = function(widgetData) {

    _plots_base.call(this,widgetData)

    this.pips.y.min = Math.abs(widgetData.range.min)>=1000?widgetData.range.min/1000+'k':widgetData.range.min
    this.pips.y.max = Math.abs(widgetData.range.max)>=1000?widgetData.range.max/1000+'k':widgetData.range.max
    this.pips.x.min = ''
    this.pips.x.max = ''
    this.length = Math.round(clip(60*widgetData.duration,[8,4096]))
    this.data = new Array(this.length)
    this.value = widgetData.range.min
    this.cancel = false
    this.loop = false

}

Visualizer.prototype = Object.create(_plots_base.prototype)

Visualizer.prototype.constructor = Visualizer

Visualizer.prototype.syncHandle = function(e,id,w) {
    if (this.widgetData.widgetId!=id || !WIDGETS[id]) return
    this.startLoop()
}

Visualizer.prototype.startLoop = function(){

    if (this.cancel) clearTimeout(this.cancel)

    this.cancel = setTimeout(function(){
        clearInterval(this.loop)
        this.loop = false
        this.cancel = false
    },1000*this.widgetData.duration)

    if (this.loop) return

    this.loop = setInterval(function(){
        this.updateData()
        this.draw()
    }.bind(this),1000*this.widgetData.duration/this.length)
}


Visualizer.prototype.draw_data = function(){

    var first = true
    var point = []

    for (var i=this.length-1;i>=0;i=i-1) {
        var newpoint = [
            mapToScale(i,[0,this.length-1],[15*PXSCALE,this.width-15*PXSCALE],1),
            mapToScale(this.data[i],[this.widgetData.range.min,this.widgetData.range.max],[this.height-15*PXSCALE,15*PXSCALE],1,this.widgetData.logScale,true),
        ]
        if (first) {
            this.ctx.moveTo(newpoint[0],newpoint[1])
            first = false
        } else {
            if (this.widgetData.logScale) {
                this.ctx.quadraticCurveTo(newpoint[0], point[1], newpoint[0], newpoint[1])
            } else {
                this.ctx.lineTo(newpoint[0],newpoint[1])
            }

        }
        point = newpoint
    }

}


Visualizer.prototype.updateData = function(){
    var id = this.widgetData.widgetId

    if (typeof id == 'string' && WIDGETS[id]) {
        var v = WIDGETS[id][WIDGETS[id].length-1].getValue()
        this.data.push(v)
        this.value = v
    } else {
        this.data.push(this.value)
    }

    this.data.splice(0,1)

}

Visualizer.prototype.setValue = function(v) {
    this.value = v
    this.startLoop()
}


module.exports.create = function(widgetData,container) {
    var visualizer = new Visualizer(widgetData)
    return visualizer.widget
}
