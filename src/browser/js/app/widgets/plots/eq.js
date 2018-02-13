var {mapToScale, clip} = require('../utils'),
    _biquad_response = require('./_biquad_response'),
    _plots_base = require('./_plots_base'),
    widgetManager = require('../../managers/widgets')

module.exports = class Eq extends _plots_base {

    static defaults() {

        return {
            type:'eq',
            id:'auto',
            linkId:'',

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
            resolution:128,
            rangeY: {min:-20,max:20},
            origin: 'auto',
            logScaleX: false,
            smooth: false,
            value: '',

            _osc:'osc',

            address:'auto',
            preArgs:[],

        }

    }

    constructor(options) {

        // backward compat
        if (options.props.filters && options.props.filters.length) {
            options.props.value = options.props.filters
            delete options.props.filters
        }

        super(options)

        this.rangeX = {min:20,max:22050}
        this.pips.x.min = '20'
        this.pips.x.max = '22k'

        this.resolution = clip(this.getProp('resolution'),[64,1024])

    }

    setValue(v, options={}) {

        if (typeof v == 'string') {
            try {
                v = JSON.parseFlex(v)
            } catch(err) {}
        }

        if (typeof v == 'object' && v !== null) {

            var filters = v,
                eqResponse = []

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

            if (eqResponse.length) super.setValue(eqResponse, options)

        }

    }

}
