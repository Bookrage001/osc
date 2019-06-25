var Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets'),
    {icon} = require('../../ui/utils'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw')


class Script extends Widget {

    static description() {

        return 'Evaluates a script each time it receives a value.'

    }

    static defaults() {

        return super.defaults({

            _script:'script',

            condition: {type: 'string', value: 1, help: [
                'When the widget receives a value, if this property return a falsy value, the script property won\'t be evaluated. If it\'s non-falsy, it will be evaluated normally. Formulas are given one extra variable in this context:',
                '- `value`: the value received by the widget'
            ]},
            script: {type: 'string', value: '', help: [
                'This property is evaluated each time the widget receives a value* if condition is non-falsy. Formulas are given extras variables in this context:',
                '- `value`: value received by the widget',
                '- `id`: id of the widget that triggered the script',
                '- `send(target, address, arg1, arg2, ...)`: function for sending osc messages (ignores the script\'s targets and the server\'s defaults unless `target` is `false`; ignores the script\'s `preArgs`)',
                '- `set(id, value)`: function for setting a widget\'s value',
                '- `get(id)`: function for getting a widget\'s value (dynamic equivalent of @{id})',
                '- `getProp(id, property)`: function for getting a widget\'s property value ((dynamic equivalent of @{id.property})',
                '',
                '* Note: `value` or `linkId` properties can be used to receive other widgets\' values. The `value` property must actually change to trigger the execution, where linked widgets via `linkId` can submit the same value over and over and trigger the execution',
            ]}

        })

    }

    constructor(options) {

        super({...options, html: html`
            <div class="script">
                ${raw(icon('code'))}
            </div>
        `})

        this.scriptLock = false

    }


    static scriptSet(id, value, options) {

        if (id == options.id) options.sync = false

        var widgets = widgetManager.getWidgetById(id)

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].setValue(value, options)

        }

    }

    static scriptGet(id) {

        var widgets = widgetManager.getWidgetById(id)

        for (var i = widgets.length - 1; i >= 0; i--) {

            if (widgets[i].getValue) {

                var v = widgets[i].getValue()
                if (v !== undefined) return v

            }

        }

    }

    static scriptGetProp(id, prop) {

        var widgets = widgetManager.getWidgetById(id)

        for (var i = widgets.length - 1; i >= 0; i--) {

            var v = widgets[i].getProp(prop)
            if (v !== undefined) return v

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

        if (this.scriptLock) return

        var context = {
            value: v,
            id: options.id,
            send: options.send ? this.scriptSend.bind(this) : ()=>{},
            set: (id, value)=>{Script.scriptSet(id, value, options)},
            get: (id)=>{return Script.scriptGet(id)},
            getProp: (id, prop)=>{return Script.scriptGetProp(id, prop)}
        }

        var condition = this.resolveProp('condition', undefined, false, false, false, {value: v})

        if (condition) {
            this.scriptLock = true
            this.resolveProp('script', undefined, false, false, false, context)
            this.scriptLock = false
        }


        // if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

}

Script.parsersContexts.condition = {
    value: ''
}

Script.parsersContexts.script = {
    value: '',
    id: '',
    send: ()=>{},
    set: ()=>{},
    get: ()=>{},
    getProp: ()=>{}
}

Script.dynamicProps = Script.prototype.constructor.dynamicProps.concat(
    'condition',
    'script'
)

module.exports = Script
