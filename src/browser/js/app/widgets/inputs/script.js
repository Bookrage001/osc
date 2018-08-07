var Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets'),
    {iconify} = require('../../ui/utils')


class Script extends Widget {

    static defaults() {

        return {
            type:'script',
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

            _script:'script',

            condition: 1,
            script:'',

            _osc:'osc',

            address:'auto',
            preArgs:[],
            target: []

        }

    }

    constructor(options) {

        var html = `
            <div class="script">
                ${iconify('^code')}
            </div>
        `

        super({...options, html: html})

    }


    static scriptSet(id, value, options) {

        var widgets = widgetManager.getWidgetById(id)

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].setValue(value, options)

        }

    }

    scriptSend(target, address, ...args) {

        var overrides = {
            address,
            v: args,
            preArgs: []
        }

        if (target) overrides.target = Array.isArray(target) ? target : [target]

        this.sendValue(overrides)

    }


    setValue(v, options={} ) {

        var context = {
            value: v,
            send: options.send ? this.scriptSend.bind(this) : ()=>{},
            set: (id, value)=>{Script.scriptSet(id, value, options)},
            log: console.log
        }

        var condition = this.resolveProp('condition', undefined, false, false, false, {value: v})

        if (condition) this.resolveProp('script', undefined, false, false, false, context)

        // if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }


}

Script.dynamicProps = Script.prototype.constructor.dynamicProps.concat(
    'condition',
    'script',
)

module.exports = Script
