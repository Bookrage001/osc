var {mapToScale} = require('../utils'),
    _plots_base = require('./_plots_base'),
    {widgetManager} = require('../../managers')

module.exports = class Plot extends _plots_base {

    static options() {

        return {
            type:'plot',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _plot:'plot',

            points:[],
            rangeX: {min:0,max:1},
            rangeY: {min:0,max:1},
            origin: 'auto',
            logScaleX: false,
            logScaleY: false,

            _osc:'osc',

            address:'auto',
            preArgs:[],

        }

    }

    constructor(widgetData) {

        super(...arguments)

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

    }

    updateData() {

        var data = [],
            points = this.widgetData.points,
            widget = widgetManager.getWidgetById(points)

        if (typeof points=='string' && widget.length) {

            data = widget[widget.length-1].getValue()

        } else if (typeof points=='object') {

            for (i in points) {

                data[i] = []

                for (var k in [0,1]) {
                    let widget = widgetManager.getWidgetById(points[i][k])
                    if (typeof points[i][k] == 'string' && widget.length) {
                        data[i][k] = widget[widget.length-1].getValue()
                    } else {
                        data[i][k] = points[i][k]
                    }
                }

            }

        }

        if (data.length) this.data = data

    }

}
