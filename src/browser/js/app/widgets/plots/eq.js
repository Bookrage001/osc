var {clip} = require('../utils'),
    _biquad_response = require('./_biquad_response'),
    _plots_base = require('./_plots_base')

module.exports = class Eq extends _plots_base {

    static defaults() {

        return super.defaults({

            _eq:'eq',

            pips: {type: 'boolean', value: true, help: 'Set to false to hide the scale'},
            resolution: {type: 'number', value: 128, help: 'Defines the number of points used to compute the frequency response'},
            rangeY: {type: 'object', value: {min:0,max:1}, help: 'Defines the min and max values for the y axis'},
            origin: {type: 'number|boolean', value: 'auto', help: 'Defines the y axis origin. Set to `false` to disable it'},
            logScaleX: {type: 'boolean', value: false, help: 'Set to `true` to use logarithmic scale for the x axis (log10)'},
            smooth: {type: 'boolean|number', value: false, help: 'Set to `true` to make the line smooth. Float values are also acceptable (works fine between `0` and `0.5`)'},

        }, ['target', 'precision', 'bypass'], {})

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

        if (Array.isArray(v)) {

            var filters = v,
                eqResponse = []

            if (v.length === this.resolution) {

                eqResponse = v

            } else {

                for (let i in filters) {

                    var filterResponse

                    if (!filters[i].type) filters[i].type = 'peak'

                    if (!filters[i].on) {
                        filterResponse = _biquad_response({type:'peak',freq:1,gain:0,q:1},!this.getProp('logScaleX'), this.resolution)
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

            }

            if (eqResponse.length) super.setValue(eqResponse, options)

        }

    }

}
