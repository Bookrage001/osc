var {mapToScale} = require('../utils'),
    Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets')

module.exports = class Led extends Widget {

    static defaults() {

        return {
            type:'led',
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

            _led:'led',

            range:{min:0,max:1},
            logScale:false,
            value:'',

            _osc:'osc',

            preArgs:[],
            address:'auto'

        }

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }

        var html = `
            <div class="led">
            </div>
        `

        super({...options, html: html})

        this.setValue(this.getProp('range').min)

    }

    setValue(v, options={}) {

        if (typeof v != 'number') return

        this.value = v
        this.widget.style.setProperty('--opacity', mapToScale(v,[this.getProp('range').min,this.getProp('range').max],[0,1],false,this.getProp('logScale'),true))

        if (options.sync) this.changed(options)

    }

}
