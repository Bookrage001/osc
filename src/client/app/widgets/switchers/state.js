var Widget = require('../common/widget'),
    Push = require('../buttons/push'),
    pushDefaults = Push.defaults()._props(),
    html = require('nanohtml'),
    stateManager = require('../../managers/state'),
    widgetManager = require('../../managers/widgets'),
    {deepCopy} = require('../../utils'),
    osc = require('../../osc')


class State extends Widget {

    static description() {

        return 'Save and recall the state of other widgets.'

    }

    static defaults() {

        return super.defaults({

            _state: 'state',

            filter: {type: 'string|array', value: '', help: [
                'Only save state from widgets contained in widgets designated by id. If empty, the whole session\'s state is saved. Switchers are always ignored.',
                '- widget id `string`',
                '- `array` of widget id strings'
            ]},
            saveLabel: {type: 'string', value: 'Save', help: 'Label for save button'},
            loadLabel: {type: 'string', value: 'Load', help: 'Label for load button'},
            horizontal: {type: 'boolean', value: false, help: 'Set to `true` to display buttons horizontally'},

        }, [], {

            value: {type: 'object|string', value: '', help: [
                '- `object`: `"widget_id": VALUE` pairs',
                '- `string`: `"save"` (trigger save action), `"load"` (trigger load action) or `""` (reset value)',
                '',
                'Note: the widget\'s actual value is never `"save"` or `"load"`, it\'s either an empty string or an object.'
            ]}

        })

    }


    constructor(options) {

        super({...options, html: html`<div class="switch"></div>`})

        this._isSwitcher = true

        if (this.getProp('horizontal')) this.widget.classList.add('horizontal')

        this.saveButton = new Push({props: {...pushDefaults, type: 'push', label: this.getProp('saveLabel')}, parent: this, container: true})
        this.loadButton = new Push({props: {...pushDefaults, type: 'push', label: this.getProp('loadLabel')}, parent: this, container: true})

        this.saveButton.container.classList.add('not-editable', 'value')
        this.loadButton.container.classList.add('not-editable', 'value', 'disabled')

        this.saveButton.sendValue = this.loadButton.sendValue = ()=>{}

        this.widget.appendChild(this.saveButton.container)
        this.widget.appendChild(this.loadButton.container)

        this.on('change', (e)=>{

            var {widget} = e
            if (widget === this) return

            e.stopPropagation = true

            if (widget.active) this.setValue(widget === this.saveButton ? 'save' : 'load', {sync: true, send: true})

        })

        this.filter = this.getProp('filter') ? Array.isArray(this.getProp('filter')) ? this.getProp('filter') : [this.getProp('filter')] : false
        this.value = ''

    }

    save() {

        var filter = (widget)=>{
            return !widget._isSwitcher
        }

        if (this.filter) {
            var containers = this.filter.map(x=>widgetManager.getWidgetById(x)).reduce((a,b)=>a.concat(b), [])
            if (!containers.length) return
            filter = (widget)=>{
                return !widget._isSwitcher && containers.some(x=>x.contains(widget) || x === widget)
            }
        }

        if (!this.value) this.loadButton.container.classList.remove('disabled')

        this.value = deepCopy(stateManager.get(filter))

    }

    load(send) {

        if (this.value) stateManager.set(this.value, send)

    }

    setValue(v,options={}) {

        var valid

        if (v === 'save') {

            this.save()
            valid = true

        } else if (v === 'load') {

            this.load(options.send)
            valid = true

        } else if (v === '') {

            if (this.value) this.loadButton.container.classList.add('disabled')
            this.value = ''

        } else if (typeof v === 'object' && !Array.isArray(v)) {

            if (!this.value) this.loadButton.container.classList.remove('disabled')
            this.value = v
            valid = true

        }

        if (valid) {
            if (options.sync) this.changed(options)
            if (options.send) this.sendValue()
        }

    }

    sendValue() {

        osc.sync({
            h:this.hash,
            v:this.value
        })

    }

    onRemove() {

        this.saveButton.onRemove()
        this.loadButton.onRemove()
        super.onRemove()

    }
}

module.exports = State
