var {mapToScale, clip} = require('../utils'),
    _biquad_response = require('./_biquad_response'),
    _plots_base = require('./_plots_base'),
    {widgetManager} = require('../../managers')

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
	rangeY: {min:-20,max:20},
    origin: 'auto',
    logScaleX: false,

    separator3:'osc',

    address:'auto',
    preArgs:[],

}

var Eq = module.exports.Eq = function(widgetData) {

    _plots_base.call(this,widgetData)

    this.rangeX = {min:20,max:22050}
    this.pips.x.min = '20'
    this.pips.x.max = '22k'

    widgetData.resolution = clip(widgetData.resolution,[64,1024])

    for (i in widgetData.filters) {

            for (j in widgetData.filters[i]) {
                if (typeof widgetData.filters[i][j]=='string' && !(j=='type' && widgetData.filters[i][j].match(/peak|notch|highpass|highshelf|lowpass|lowshelf/))) {
                    this.linkedWidgets.push(widgetData.filters[i][j])
                }
            }

    }

}

Eq.prototype = Object.create(_plots_base.prototype)

Eq.prototype.constructor = Eq


Eq.prototype.updateData = function(){
    var filters = [],
        eqResponse = []


    for (i in this.widgetData.filters) {
        var filter = this.widgetData.filters[i]

        filters[i] = {}

        for (j in filter) {
            let widget = widgetManager.getWidgetById(filter[j])

            if (typeof filter[j]=='string' && widget.length) {

                filters[i][j] = widget[widget.length-1].getValue()

            } else {

                filters[i][j] = filter[j]

            }

        }

    }

    for (i in filters) {

        var filterResponse

        if (!filters[i].type) filters[i].type = "peak"

        if (!filters[i].on) {
            filterResponse = _biquad_response({type:"peak",freq:1,gain:0,q:1},!this.widgetData.logScaleX,this.widgetData.resolution)
        } else {
            filterResponse = _biquad_response(filters[i],!this.widgetData.logScaleX,this.widgetData.resolution)
        }
        for (k in filterResponse) {
            if (eqResponse[k]===undefined) {
                eqResponse[k]=[0,0]
            }

            eqResponse[k] = [filterResponse[k][0], eqResponse[k][1]+filterResponse[k][1]]
        }
    }
    if (eqResponse.length) this.data = eqResponse

}

module.exports.create = function(widgetData) {
    var eq = new Eq(widgetData)
    return eq
}
