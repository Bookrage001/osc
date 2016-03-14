var utils = require('./utils'),
    mapToScale = utils.mapToScale

module.exports.options = {
	type:'visualizer',
	id:'auto',

	separator1:'style',

	label:'auto',
	left:'auto',
	top:'auto',
	width:'auto',
	height:'auto',
	css:'',

	separator2:'plot',

	curve:'',
    duration:1,
	range: {min:0,max:1},
    logScale: false,

}
module.exports.create = function(widgetData,container) {

	var widget = $(`
			<div class="plot">
			<canvas></canvas>
			</div>
            `),
		canvas = widget.find('canvas'),
		ctx = canvas[0].getContext('2d')

	widget.height = undefined
	widget.width = undefined
	widget.visible = false
    widget.lineColor = String(getComputedStyle(document.documentElement).getPropertyValue("--color-accent")).trim()
    widget.textColor = String(getComputedStyle(document.documentElement).getPropertyValue("--color-text-fade")).trim()
    widget.pips = {
        min: Math.abs(widgetData.range.min)>=1000?widgetData.range.min/1000+'k':widgetData.range.min,
        max: Math.abs(widgetData.range.max)>=1000?widgetData.range.max/1000+'k':widgetData.range.max
    }
    widget.length = 60*widgetData.duration
	widget.data = new Array(widget.length)

	canvas.resize(function(){
		var width = canvas.width(),
			height = canvas.height()

		if (height==100 && width==100) return

		if (!self.visible) {
			widget.visible = true
			canvas.addClass('visible')
		}

		widget.height=height
		widget.width=width

		canvas[0].setAttribute('width',width)
		canvas[0].setAttribute('height',height)

        requestAnimationFrame(widget.draw)

	})

    $('body').on('sync',function(e,id,w){
        if (widgetData.curve!=id || !document.contains(widget[0])) return

        if (widget.cancel) clearTimeout(widget.cancel)
        widget.cancel = setTimeout(function(){
            clearInterval(widget.loop)
            widget.loop = false
        },1000*widgetData.duration)

        if (widget.loop) return
        widget.loop = widget.createLoop()
    })


    widget.cancel = false
    widget.loop = false
    widget.createLoop = function(){
        return setInterval(function(){
                widget.fetchValue()
                widget.draw()
        },1000*widgetData.duration/widget.length)
    }


	widget.draw = function(){
		ctx.clearRect(0,0,widget.width,widget.height)
		ctx.beginPath()

		var first = true
        var point = []

		for (var i=widget.length-1;i>=0;i=i-1) {
			var newpoint = [
                mapToScale(i,[0,widget.length-1],[15,widget.width-15],1),
				mapToScale(widget.data[i],[widgetData.range.min,widgetData.range.max],[widget.height-15,15],1,widgetData.logScale,true),
			]
			if (first) {
				ctx.moveTo(newpoint[0],newpoint[1])
				first = false
			} else {
                if (widgetData.logScale) {
                    ctx.quadraticCurveTo(newpoint[0], point[1], newpoint[0], newpoint[1])
                } else {
                    ctx.lineTo(newpoint[0],newpoint[1])
                }

			}
            point = newpoint
		}

        ctx.lineWidth = 1.5
		ctx.strokeStyle= widget.lineColor
		ctx.stroke()

        ctx.font = '10px sans-serif'
        ctx.fillStyle = widget.textColor


        ctx.save()
        ctx.translate(0, widget.height)
        ctx.rotate(-Math.PI/2)

        ctx.textBaseline = "top"
        ctx.textAlign = 'left'
        ctx.fillText(widget.pips.min,12,2)
        ctx.textAlign = 'right'
        ctx.fillText(widget.pips.max,widget.height-10,2)
        ctx.rotate(Math.PI/2)
        ctx.restore()

	}



	widget.fetchValue = function(){
        var id = widgetData.curve
        if (!typeof id == 'string' || !WIDGETS[id] || !WIDGETS[id].length ) return

        widget.data.push(WIDGETS[id][WIDGETS[id].length-1].getValue())
        widget.data.splice(0,1)

	}

    return widget
}
