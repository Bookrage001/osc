var {mapToScale, clip} = require('../utils'),
    _biquad_response = require('./_biquad_response'),
    _plots_base = require('./_plots_base')

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
    logScaleX: false,

    separator3:'osc',

    path:'auto',
    preArgs:[],

}


module.exports.create = function(widgetData) {

    var eq = new _plots_base(widgetData)

    eq.rangeX = {min:20,max:22050}
    eq.pips.x.min = '20'
    eq.pips.x.max = '22k'

    widgetData.resolution = clip(widgetData.resolution,[64,1024])

    for (i in widgetData.filters) {

            for (j in widgetData.filters[i]) {
                if (typeof widgetData.filters[i][j]=='string' && !(j=='type' && widgetData.filters[i][j].match(/peak|notch|highpass|highshelf|lowpass|lowshelf/))) {
                    eq.linkedWidgets.push(widgetData.filters[i][j])
                }
            }

    }


	eq.updateData = function(){
        var filters = [],
            eqResponse = []


        for (i in widgetData.filters) {
            var filter = widgetData.filters[i]

            filters[i] = {}

            for (j in filter) {

                if (typeof filter[j]=='string' && WIDGETS[filter[j]]) {

                    filters[i][j] = WIDGETS[filter[j]][WIDGETS[filter[j]].length-1].getValue()

                } else {

                    filters[i][j] = filter[j]

                }

            }

        }

        for (i in filters) {

            var filterResponse

            if (!filters[i].type) filters[i].type = "peak"

            if (!filters[i].on) {
                filterResponse = _biquad_response({type:"peak",freq:1,gain:0,q:1},!widgetData.logScaleX,widgetData.resolution)
            } else {
                filterResponse = _biquad_response(filters[i],!widgetData.logScaleX,widgetData.resolution)
            }
            for (k in filterResponse) {
                if (eqResponse[k]===undefined) {
                    eqResponse[k]=[0,0]
                }

                eqResponse[k] = [filterResponse[k][0], eqResponse[k][1]+filterResponse[k][1]]
            }
        }
        if (eqResponse.length) eq.data = eqResponse

	}

    return eq.widget
}
