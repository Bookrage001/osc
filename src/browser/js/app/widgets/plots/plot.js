var {mapToScale} = require('../utils'),
    _plots_base = require('./_plots_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Plot extends _plots_base {

    static defaults() {

        return {
            type:'plot',
            id:'auto',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _plot:'plot',

            points:[],
            rangeX: {min:0,max:1},
            rangeY: {min:0,max:1},
            origin: 'auto',
            bars: false,
            logScaleX: false,
            logScaleY: false,
            smooth: false,
            pips:true,

            _osc:'osc',

            address:'auto',
            preArgs:[],

        }

    }

    constructor(options) {

        super(options)

        if (typeof this.getProp('points')=='string') {

            this.linkedWidgets.push(this.getProp('points'))

        } else if (typeof this.getProp('points')=='object') {

            for (let i in this.getProp('points')) {
                for (let j in this.getProp('points')[i]) {
                    if (typeof this.getProp('points')[i][j] == 'string') {
                        this.linkedWidgets.push(this.getProp('points')[i][j])
                    }
                }
            }
        }

    }

    updateData() {

        var data = [],
            points = this.getProp('points'),
            widget = widgetManager.getWidgetById(points)

        if (typeof points=='string' && widget.length) {

            data = widget[widget.length-1].getValue()

        } else if (typeof points=='object') {

            for (let i in points) {

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
