var {mapToScale, clip} = require('../utils'),
    _biquad_response = require('./_biquad_response'),
    _plots_base = require('./_plots_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Eq extends _plots_base {

    static defaults() {

        return {
            type:'eq',
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

            _eq:'eq',

            pips:true,
            filters:[],
            resolution:128,
            rangeY: {min:-20,max:20},
            origin: 'auto',
            logScaleX: false,
            smooth: false,

            _osc:'osc',

            address:'auto',
            preArgs:[],

        }

    }

    constructor(options) {

        super(options)

        this.rangeX = {min:20,max:22050}
        this.pips.x.min = '20'
        this.pips.x.max = '22k'

        this.resolution = clip(this.getProp('resolution'),[64,1024])

        for (let i in this.getProp('filters')) {

            for (let j in this.getProp('filters')[i]) {
                if (typeof this.getProp('filters')[i][j]=='string' && !(j=='type' && this.getProp('filters')[i][j].match(/peak|notch|highpass|highshelf|lowpass|lowshelf/))) {
                    this.linkedWidgets.push(this.getProp('filters')[i][j])
                }
            }

        }

    }

    updateData() {

        var filters = [],
        eqResponse = []


        for (let i in this.getProp('filters')) {
            var filter = this.getProp('filters')[i]

            filters[i] = {}

            for (let j in filter) {
                let widget = widgetManager.getWidgetById(filter[j])

                if (typeof filter[j]=='string' && widget.length) {

                    filters[i][j] = widget[widget.length-1].getValue()

                } else {

                    filters[i][j] = filter[j]

                }

            }

        }

        for (let i in filters) {

            var filterResponse

            if (!filters[i].type) filters[i].type = "peak"

            if (!filters[i].on) {
                filterResponse = _biquad_response({type:"peak",freq:1,gain:0,q:1},!this.getProp('logScaleX'), this.resolution)
            } else {
                filterResponse = _biquad_response(filters[i],!this.getProp('logScaleX'), this.resolution)
            }

            for (var k in filterResponse) {
                if (eqResponse[k]===undefined) {
                    eqResponse[k]=[0,0]
                }

                eqResponse[k] = [filterResponse[k][0], eqResponse[k][1]+filterResponse[k][1]]
            }

        }

        if (eqResponse.length) this.data = eqResponse

    }

}
