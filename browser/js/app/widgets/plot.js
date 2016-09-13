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
    color:'auto',
	css:'',

	separator2:'plot',

	points:[],
	rangeX: {min:0,max:1},
	rangeY: {min:0,max:1},
    logScaleX: false,
    logScaleY: false,

    separator3:'osc',

    path:'auto',
    preArgs:[],

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
    widget.textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text-fade')
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



    if (typeof widgetData.points=='string') {

        widget.linkedWidgets.push(widgetData.points)

    } else if (typeof widgetData.points=='object') {

        for (i in widgetData.points) {
            for (j in widgetData.points[i]) {
                if (typeof widgetData.points[i][j] == 'string') {
                    widget.linkedWidgets.push(widgetData.points[i][j])
                }
            }
        }
    }


	canvas.resize(function(){
		var width = canvas.width(),
			height = canvas.height()

		if (height==100 && width==100) return

		if (!self.visible) {
			widget.visible = true
            widget.lineColor = getComputedStyle(widget[0]).getPropertyValue('--color-accent')
		}


		widget.height=height
		widget.width=width

		canvas[0].setAttribute('width',width)
		canvas[0].setAttribute('height',height)

        widget.fetchValues()
        requestAnimationFrame(widget.draw)

	})


    widget.handleSync = function(e,id,w) {
        if (widget.linkedWidgets.indexOf(id)==-1 || !WIDGETS[id]) return
        widget.fetchValues()
        requestAnimationFrame(widget.draw)
    }

    $('body').on('sync',widget.handleSync)

	widget.draw = function(){


		ctx.clearRect(0,0,widget.width,widget.height)
		ctx.beginPath()

		var first = true
        var point = []

		for (i in widget.data) {
			var newpoint = widget.data[i].length?
                    [
        				mapToScale(widget.data[i][0],[widgetData.rangeX.min,widgetData.rangeX.max],[15*PXSCALE,widget.width-15*PXSCALE],0,widgetData.logScaleX,true),
        				mapToScale(widget.data[i][1],[widgetData.rangeY.min,widgetData.rangeY.max],[widget.height-15*PXSCALE,15*PXSCALE],0,widgetData.logScaleY,true),
        			]
                    :
                    [
                        mapToScale(i,[0,widget.data.length-1],[15*PXSCALE,widget.width-15*PXSCALE],0,widgetData.logScaleX,true),
                        mapToScale(widget.data[i],[widgetData.rangeY.min,widgetData.rangeY.max],[widget.height-15*PXSCALE,15*PXSCALE],0,widgetData.logScaleY,true),
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
            ctx.rect(newpoint[0]-1*PXSCALE,newpoint[1]-1*PXSCALE,2,2)
            point = newpoint
		}

        ctx.lineWidth = 1*PXSCALE
		ctx.strokeStyle= widget.lineColor
		ctx.stroke()

        ctx.font = PXSCALE * 10 + 'px sans-serif'
        ctx.fillStyle = widget.textColor


        ctx.textBaseline = "bottom"
        ctx.textAlign = 'left'
        ctx.fillText(widget.pips.x.min,12*PXSCALE,widget.height)
        ctx.textAlign = 'right'
        ctx.fillText(widget.pips.x.max,widget.width-10,widget.height)

        ctx.save()
        ctx.translate(0, widget.height)
        ctx.rotate(-Math.PI/2)

        ctx.textBaseline = "top"
        ctx.textAlign = 'left'
        ctx.fillText(widget.pips.y.min,12*PXSCALE,2*PXSCALE)
        ctx.textAlign = 'right'
        ctx.fillText(widget.pips.y.max,widget.height-10*PXSCALE,2*PXSCALE)
        ctx.rotate(Math.PI/2)
        ctx.restore()

	}



	widget.fetchValues = function(){
		var data = [],
            points = widgetData.points

        if (typeof points=='string' && WIDGETS[points]) {

            data = WIDGETS[points][WIDGETS[points].length-1].getValue()

        } else if (typeof points=='object') {

            for (i in points) {

                data[i] = []
                for (k in [0,1]) {
                    if (typeof points[i][k] == 'string' && WIDGETS[points[i][k]]) {
                        data[i][k] = WIDGETS[points[i][k]][WIDGETS[points[i][k]].length-1].getValue()
                    } else {
                        data[i][k] = points[i][k]
                    }
                }

            }

        }

        if (data.length) widget.data = data
	}

    widget.setValue = function(v) {
        widget.data = v
        requestAnimationFrame(widget.draw)
    }

    return widget
}
