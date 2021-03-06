var Widget = require('../common/widget'),
    doubletab = require('../mixins/double_tap'),
    osc = require('../../osc'),
    html = require('nanohtml')

class Push extends Widget {

    static defaults() {


        return super.defaults({

            _push: 'push',

            doubleTap: {type: 'boolean', value: false, help: 'Set to `true` to make the button require a double tap to be pushed instead of a single tap'},
            on: {type: '*', value: 1, help: [
                'Set to `null` to send send no argument in the osc message',
                'Can be an `object` if the type needs to be specified (see preArgs)'
            ]},
            off: {type: '*', value: 0, help: [
                'Set to `null` to send send no argument in the osc message',
                'Can be an `object` if the type needs to be specified (see preArgs)'
            ]},
            norelease: {type: 'boolean', value: false, help: 'Set to `true` to prevent sending any osc message when releasing the button'},

        }, ['default'])

    }

    constructor(options) {

        super({...options, html: html`<div class="toggle"></div>`})

        this.state = 0
        this.active = null
        this.lastChanged = 'state'

        if (this.getProp('doubleTap')) {

            doubletab(this.widget, ()=>{
                if (this.active) return
                this.setValuePrivate(this.getProp('on'),{send:true,sync:true})
            })

        } else {

            this.on('draginit',()=>{
                if (this.active) return
                this.setValuePrivate(this.getProp('on'),{send:true,sync:true})
            }, {element: this.widget})

        }

        this.on('dragend',()=>{
            if (!this.active) return
            this.setValuePrivate(this.getProp('off'),{send:true,sync:true})
        }, {element: this.widget})

        this.value = this.getProp('off')


    }

    updateValue(){

        this.value = this[this.lastChanged] ?
            this.getProp('on') != null && this.getProp('on').value !== undefined ? this.getProp('on').value : this.getProp('on')
            :
            this.getProp('off') != null && this.getProp('off').value !== undefined ? this.getProp('off').value : this.getProp('off')

    }

    setValuePrivate(v,options={}) {

        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getProp('on') || (this.getProp('on') != null && v === this.getProp('on').value && v !== undefined)) {
            this.widget.classList.add('active')
            this.container.classList.add('active')
            this.active = options
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue()
            if (options.sync) this.changed(options)
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v === this.getProp('off').value && v !== undefined)) {
            this.widget.classList.remove('active')
            this.container.classList.remove('active')
            this.active = null
            this.lastChanged = 'active'
            this.updateValue()
            if (options.send) this.sendValue(null, {syncOnly: this.getProp('norelease')})
            if (options.sync) this.changed(options)
        }

    }

    setValue(v,options={}) {

        if (!options.fromExternal) {
            if (!options.fromState) this.setValuePrivate(v,options)
            return
        }
        
        if (typeof v == 'object' && v !== null) v = v.value
        if (v===this.getProp('on') || (this.getProp('on') != null && v === this.getProp('on').value && v !== undefined)) {
            this.widget.classList.add('on')
            this.container.classList.add('on')
            this.state = 1
            if (options.send) this.sendValue()
            this.lastChanged = 'state'
            if (options.sync) this.changed(options)
        } else if (v===this.getProp('off') || (this.getProp('off') != null && v === this.getProp('off').value && v !== undefined)) {
            this.widget.classList.remove('on')
            this.container.classList.remove('on')
            this.state = 0
            if (options.send) this.sendValue()
            this.lastChanged = 'state'
            if (options.sync) this.changed(options)
        }

    }

    sendValue(overrides, options={}) {

        if (!options.syncOnly) {

            super.sendValue(overrides, options)

        } else {

            osc.sync({
                h: this.hash,
                v: this.value
            })

        }

    }

    onRemove() {

        if (this.active) this.setValuePrivate(this.getProp('off'), this.active)
        super.onRemove()

    }
}

Push.dynamicProps = Push.prototype.constructor.dynamicProps.concat(
    'on',
    'off',
    'norelease'
)

module.exports = Push
