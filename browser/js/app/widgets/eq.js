var utils = require('./utils'),
    mapToScale = utils.mapToScale,
    clip = utils.clip,
    calcBiquad = require('./filter')

module.exports.options = {
	type:'eq',
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

	filters:[],
    resolution:128,
	rangeX: {min:20,max:22050},
	rangeY: {min:-20,max:20},
    logScaleX: false,
    // logScaleY: false,

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
            min: '20',
            max: '22k'
        },
        y : {
            min: Math.abs(widgetData.rangeY.min)>=1000?widgetData.rangeY.min/1000+'k':widgetData.rangeY.min,
            max: Math.abs(widgetData.rangeY.max)>=1000?widgetData.rangeY.max/1000+'k':widgetData.rangeY.max
        }
    }

    widgetData.resolution = clip(widgetData.resolution,[64,1024])

    for (i in widgetData.filters) {

            for (j in widgetData.filters[i]) {
                if (typeof widgetData.filters[i][j]=='string') {
                    widget.linkedWidgets.push(widgetData.filters[i][j])
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

            if (widget.data[i][1]>widgetData.rangeY.max || widget.data[i][1]<widgetData.rangeY.min) continue

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
                ctx.lineTo(newpoint[0],newpoint[1])
			}
            point = newpoint
		}

        ctx.lineWidth = 1.5*PXSCALE
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
		var filterparams = [],
            filters = widgetData.filters,
            data = []


        for (i in filters) {
            var filter = filters[i]

            filterparams[i] = {}

            for (j in filter) {

                if (typeof filter[j]=='string' && WIDGETS[filter[j]]) {

                    filterparams[i][j] = WIDGETS[filter[j]][WIDGETS[filter[j]].length-1].getValue()

                } else {

                    filterparams[i][j] = filter[j]

                }

            }

        }

        for (i in filterparams) {

            if (!filterparams[i].type) filterparams[i].type = "peak"
            
            if (!filterparams[i].on) {
                filterPoints = calcBiquad({type:"peak",freq:1,gain:0,q:1},!widgetData.logScaleX,widgetData.resolution)
            } else {
                filterPoints = calcBiquad(filterparams[i],!widgetData.logScaleX,widgetData.resolution)
            }
            for (k in filterPoints) {
                if (data[k]===undefined) {
                    data[k]=[0,0]
                }

                data[k] = [filterPoints[k][0], data[k][1]+filterPoints[k][1]]
            }
        }
        if (data.length) widget.data = data

	}

    // widget.setValue = function(v) {
    //     widget.data = v
    //     requestAnimationFrame(widget.draw)
    // }

    return widget
}
