var {mapToScale} = require('../utils'),
    _plots_base = require('./_plots_base')

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
    origin: 'auto',
    logScaleX: false,
    logScaleY: false,

    separator3:'osc',

    path:'auto',
    preArgs:[],

}

var Plot = module.exports.Plot = function(widgetData) {

    _plots_base.call(this,widgetData)

    if (typeof widgetData.points=='string') {

        this.linkedWidgets.push(widgetData.points)

    } else if (typeof widgetData.points=='object') {

        for (i in widgetData.points) {
            for (j in widgetData.points[i]) {
                if (typeof widgetData.points[i][j] == 'string') {
                    this.linkedWidgets.push(widgetData.points[i][j])
                }
            }
        }
    }

    this.updateData = function(){
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

        if (data.length) this.data = data
    }
}

Plot.prototype = Object.create(_plots_base.prototype)

Plot.prototype.constructor = Plot

module.exports.create = function(widgetData) {
    var plot = new Plot(widgetData)
    return plot.widget
}
