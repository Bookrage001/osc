var utils = require('./utils'),
    mapToScale = utils.mapToScale

module.exports.options = {
	type:'plot',
	id:'auto',

	separator1:'style',

	label:'auto',
	left:'auto',
	top:'auto',
	width:'auto',
	height:'auto',
	css:'',

	separator2:'plot',

	points:[],
	rangeX: {min:0,max:1},
	rangeY: {min:0,max:1},
    logScaleX: false,
    logScaleY: false

}
module.exports.create = function(widgetData,container) {

	var widget = $(`
			<div class="plot">
			<canvas></canvas>
			</div>
            `),
		canvas = widget.find('canvas'),
		ctx = canvas[0].getContext('2d')

	widget.data = []
	widget.height = undefined
	widget.width = undefined
    widget.linkedWidgets = []
	widget.visible = false
    widget.lineColor = String(getComputedStyle(document.documentElement).getPropertyValue("--color-accent")).trim()
    widget.textColor = String(getComputedStyle(document.documentElement).getPropertyValue("--color-text-fade")).trim()
    widget.pips = {
        x : {
            min: Math.abs(widgetData.rangeX.min)>=1000?widgetData.rangeX.min/1000+'k':widgetData.rangeX.min,
            max: Math.abs(widgetData.rangeX.max)>=1000?widgetData.rangeX.max/1000+'k':widgetData.rangeX.max
        },
        y : {
            min: Math.abs(widgetData.rangeY.min)>=1000?widgetData.rangeY.min/1000+'k':widgetData.rangeY.min,
            max: Math.abs(widgetData.rangeY.max)>=1000?widgetData.rangeY.max/1000+'k':widgetData.rangeY.max
        }
    }

    for (i in widgetData.points) {
        for (j in widgetData.points[i]) {
            if (typeof widgetData.points[i][j] == 'string') {
                widget.linkedWidgets.push(widgetData.points[i][j])
            }
        }
    }


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

        widget.fetchValues()
        requestAnimationFrame(widget.draw)

	})

    $('body').on('sync',function(e,id,w){
        widget.trigger('draw',[id,w])

    })
    widget.on('draw',function(e,id,w){
        if (widget.linkedWidgets.indexOf(id)==-1) return
        widget.fetchValues()
        requestAnimationFrame(widget.draw)
    })

	widget.draw = function(){


		ctx.clearRect(0,0,widget.width,widget.height)
		ctx.beginPath()

		var first = true
        var point = []

		for (i in widget.data) {
			var newpoint = [
				mapToScale(widget.data[i][0],[widgetData.rangeX.min,widgetData.rangeX.max],[15,widget.width-15],0,widgetData.logScaleX,true),
				mapToScale(widget.data[i][1],[widgetData.rangeY.min,widgetData.rangeY.max],[widget.height-15,15],0,widgetData.logScaleY,true),
			]
			if (first) {
				ctx.moveTo(newpoint[0],newpoint[1])
				first = false
			} else {
                ctx.moveTo(point[0],point[1])
                if (widgetData.logScaleX&&!widgetData.logScaleY) {
                    ctx.quadraticCurveTo(point[0], newpoint[1], newpoint[0], newpoint[1])
                } else if (widgetData.logScaleY&&!widgetData.logScaleX) {
                    ctx.quadraticCurveTo(newpoint[0], point[1], newpoint[0], newpoint[1])
                } else {
                    ctx.lineTo(newpoint[0],newpoint[1])
                }

			}
            ctx.arc(newpoint[0],newpoint[1],1,0,2*Math.PI)
            point = newpoint
		}

        ctx.lineWidth = 1.5
		ctx.strokeStyle= widget.lineColor
		ctx.stroke()

        ctx.font = '10px sans-serif'
        ctx.fillStyle = widget.textColor


        ctx.textBaseline = "bottom"
        ctx.textAlign = 'left'
        ctx.fillText(widget.pips.x.min,12,widget.height)
        ctx.textAlign = 'right'
        ctx.fillText(widget.pips.x.max,widget.width-10,widget.height)

        ctx.save()
        ctx.translate(0, widget.height)
        ctx.rotate(-Math.PI/2)

        ctx.textBaseline = "top"
        ctx.textAlign = 'left'
        ctx.fillText(widget.pips.y.min,12,2)
        ctx.textAlign = 'right'
        ctx.fillText(widget.pips.y.max,widget.height-10,2)
        ctx.rotate(Math.PI/2)
        ctx.restore()

	}



	widget.fetchValues = function(){
		var data = []
		for (i in widgetData.points) {
			data[i] = []
			var point = widgetData.points[i]
			if (point.length==2) {
				for (k in [0,1]) {
					if (typeof point[k] == 'string') {
						if (WIDGETS[point[k]] && WIDGETS[point[k]].length)
							data[i][k] = WIDGETS[point[k]][WIDGETS[point[k]].length-1].getValue()
					} else {
						data[i][k] = point[k]
					}
				}
			} else if (point.length==1){
				if (typeof point[0] == 'string') {
					if (WIDGETS[point[0]] && WIDGETS[point[0]].length) {
						var v = WIDGETS[point[0]][WIDGETS[point[0]].length-1].getValue()
						data[i][0] = v[0]
						data[i][1] = v[1]
					}
				} else {
					data[i][0] = point[0]
					data[i][1] = point[0]
				}
			}
		}

        if (!data<widget.data && !data>widget.data) return
        widget.data = data
	}

    widget.getValue = function(){return}
    widget.setValue = function(){return}
    return widget
}
