var Widget = require('../common/widget'),
    Push = require('../buttons/push'),
    pushDefaults = Push.defaults()._props(),
    html = require('nanohtml'),
    stateMananer = require('../../managers/state'),
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

        }, ['_value', 'default', 'value'])

    }


    constructor(options) {

        super({...options, html: html`<div class="switch"></div>`})

        this._isSwitcher = true

        this.saveButton = new Push({props: {...pushDefaults, type: 'push', label: 'save'}, parent: this, container: true})
        this.loadButton = new Push({props: {...pushDefaults, type: 'push', label: 'load'}, parent: this, container: true})

        this.saveButton.container.classList.add('not-editable')
        this.loadButton.container.classList.add('not-editable')
        this.loadButton.container.classList.add('disabled')

        this.widget.appendChild(this.saveButton.container)
        this.widget.appendChild(this.loadButton.container)

        this.on('change', (e)=>{

            var {widget} = e
            if (widget === this) return

            if (widget.active) this.setValue(widget === this.saveButton ? 'save' : 'load', {sync: true, send: true})

        })

        this.filter = this.getProp('filter') ? Array.isArray(this.getProp('filter')) ? this.getProp('filter') : [this.getProp('filter')] : false
        this.value = null

    }

    save() {

        var filter
        if (this.filter) {
            var containers = this.filter.map(x=>widgetManager.getWidgetById(x)).reduce((a,b)=>a.concat(b), [])
            if (!containers.length) return
            filter = (widget)=>{
                return !widget.isSwitcher && containers.some(x=>x.contains(widget) || x === widget)
            }
        }

        if (!this.value) this.loadButton.container.classList.remove('disabled')

        this.value = deepCopy(stateMananer.get(filter))

    }

    load(send) {

        stateMananer.set(this.value, send)

    }

    setValue(v,options={}) {

        var valid

        if (v === 'save') {

            this.save()
            valid = true

        } else if (v === 'load') {

            this.load(options.send)
            valid = true

        } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {

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
