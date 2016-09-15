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

module.exports.create = function(widgetData,container) {

    var visualizer = new _plots_base(widgetData)

    visualizer.pips.y.min = Math.abs(widgetData.range.min)>=1000?widgetData.range.min/1000+'k':widgetData.range.min
    visualizer.pips.y.max = Math.abs(widgetData.range.max)>=1000?widgetData.range.max/1000+'k':widgetData.range.max
    visualizer.pips.x.min = ''
    visualizer.pips.x.max = ''
    visualizer.length = Math.round(clip(60*widgetData.duration,[8,4096]))
	visualizer.data = new Array(visualizer.length)
    visualizer.value = widgetData.range.min
    visualizer.cancel = false
    visualizer.loop = false



    visualizer.syncHandle = function(e,id,w) {
        if (widgetData.widgetId!=id || !WIDGETS[id]) return
        visualizer.startLoop()
    }

    visualizer.startLoop = function(){

        if (visualizer.cancel) clearTimeout(visualizer.cancel)

        visualizer.cancel = setTimeout(function(){
            clearInterval(visualizer.loop)
            visualizer.loop = false
            visualizer.cancel = false
        },1000*widgetData.duration)

        if (visualizer.loop) return

        visualizer.loop = setInterval(function(){
            visualizer.updateData()
            visualizer._draw()
        },1000*widgetData.duration/visualizer.length)
    }


	visualizer.draw = function(){

		var first = true
        var point = []

		for (var i=visualizer.length-1;i>=0;i=i-1) {
			var newpoint = [
                mapToScale(i,[0,visualizer.length-1],[15*PXSCALE,visualizer.width-15*PXSCALE],1),
				mapToScale(visualizer.data[i],[widgetData.range.min,widgetData.range.max],[visualizer.height-15*PXSCALE,15*PXSCALE],1,widgetData.logScale,true),
			]
			if (first) {
				visualizer.ctx.moveTo(newpoint[0],newpoint[1])
				first = false
			} else {
                if (widgetData.logScale) {
                    visualizer.ctx.quadraticCurveTo(newpoint[0], point[1], newpoint[0], newpoint[1])
                } else {
                    visualizer.ctx.lineTo(newpoint[0],newpoint[1])
                }

			}
            point = newpoint
		}

	}


	visualizer.updateData = function(){
        var id = widgetData.widgetId

        if (typeof id == 'string' && WIDGETS[id]) {
            var v = WIDGETS[id][WIDGETS[id].length-1].getValue()
            visualizer.data.push(v)
            visualizer.value = v
        } else {
            visualizer.data.push(visualizer.value)
        }

        visualizer.data.splice(0,1)

	}

    visualizer.setValue = function(v) {
        visualizer.value = v
        visualizer.startLoop()
    }

    return visualizer.widget
}
