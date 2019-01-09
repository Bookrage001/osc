var Panel = require('./panel'),
    Widget = require('../common/widget'),
    {icon, iconify} = require('../../ui/utils'),
    resize = require('../../events/resize'),
    doubletab = require('../mixins/double_tap'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw')

module.exports = class Modal extends Panel {

    static defaults() {

        return Widget.defaults({

            _modal:'modal',

            doubleTap: {type: 'boolean', value: false, help: 'Set to `true` to make the modal require a double tap to open instead of a single tap'},
            popupLabel: {type: 'string', value: '', help: 'Alternative label for the modal popup'},
            popupWidth: {type: 'number|percentage', value: '80%', help: 'Modal popup\'s size'},
            popupHeight: {type: 'number|percentage', value: '80%', help: 'Modal popup\'s size'},
            popupLeft: {type: 'number|percentage', value: 'auto', help: 'Modal popup\'s position'},
            popupTop: {type: 'number|percentage', value: 'auto', help: 'Modal popup\'s position'},

        }, [], {

            _chidlren:'children',

            variables: {type: '*', value: '@{parent.variables}', help: 'Defines one or more arbitrary variables that can be inherited by children widgets'},
            widgets: {type: 'array', value: [], help: 'Each element of the array must be a widget object'},
            value: {type: 'integer', value: '', help: [
                'Defines the modal\'s state:`0` for closed, `1` for opened'
            ]},

        })

    }

    constructor(options) {

        options.props.scroll = true

        super(options)

        this.disabledProps = []

        this.popup = html`
            <div class="popup">
                <div class="popup-wrapper">
                    <div class="popup-title closable"><span class="popup-label"></span><span class="closer">${raw(icon('times'))}</span></div>
                    <div class="popup-content"></div>
                </div>
            </div>
        `

        this.container.appendChild(this.popup)

        // convert dimensions / coordinates to rem
        var geometry = {}
        for (var g of ['Width', 'Height', 'Left', 'Top']) {
            geometry[g] = parseFloat(this.getProp('popup' + g)) == this.getProp('popup' + g) ? parseFloat(this.getProp('popup' + g)) + 'rem' : this.getProp('popup' + g)
        }

        this.popup.style.setProperty('--width', geometry.Width)
        this.popup.style.setProperty('--height', geometry.Height)

        if (geometry.Left !== 'auto') {
            this.popup.style.setProperty('--left', geometry.Left)
            this.popup.classList.add('x-positionned')
        }

        if (geometry.Top !== 'auto') {
            this.popup.style.setProperty('--top', geometry.Top)
            this.popup.classList.add('y-positionned')
        }

        this.light = this.container.appendChild(html`<div class="toggle"></div>`)

        if (this.getProp('doubleTap')) {
            doubletab(this.light, ()=>{
                this.setValue(1, {sync:true, send:true})
            })
        } else {
            this.light.addEventListener('fast-click',(e)=>{
                if (e.capturedByEditor === true) return
                this.setValue(1, {sync:true, send:true})
            })
        }

        var closer = DOM.get(this.popup, '.closer')[0]
        this.popup.addEventListener('fast-click',(e)=>{
            if ((e.target === this.popup || e.target === closer) && this.value == 1) {
                e.detail.preventOriginalEvent = true
                this.setValue(0, {sync:true, send:true})
            }
        })

        this.escapeKeyHandler = ((e)=>{
            if (e.keyCode==27) this.setValue(0, {sync:true, send:true})
        }).bind(this)

        this.parentScroll = [0,0]
        this.value = 0
        this.init = false

    }

    setValue(v, options={}) {

        if (this.init === undefined) return

        this.value = v ? 1 : 0

        if (!this.init && this.value) {
            var label = this.getProp('popupLabel') ? iconify(this.getProp('popupLabel')) : DOM.get(this.container, '> .label')[0].innerHTML
            DOM.get(this.popup, '.popup-title .popup-label')[0].innerHTML = label
            DOM.get(this.popup, '.popup-content')[0].appendChild(this.widget)
            this.init = true
        }

        this.popup.classList.toggle('show', this.value)
        this.container.classList.toggle('on', this.value)
        this.light.classList.toggle('on', this.value)

        this.bindEscKey(this.value)

        if (this.init) this.fixParents()

        if (this.value) {
            resize.check(this.widget, true)
        }


        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)


    }

    bindEscKey(set) {

        if (set) {
            document.addEventListener('keydown', this.escapeKeyHandler)
        } else {
            document.removeEventListener('keydown', this.escapeKeyHandler)
        }

    }

    onRemove() {
        this.bindEscKey(false)
        this.setValue(0)
        super.onRemove()
    }

    fixParents() {

        var parent = this.parent,
            scrollFixed = false

        while (parent && parent.props) {

            // scroll
            if (!scrollFixed && parent.getProp('type') == 'tab') {
                if (this.value) {
                    this.parentScroll = [parent.widget.scrollLeft, parent.widget.scrollTop]
                }
                parent.widget.scrollLeft = this.value ? 0 : this.parentScroll[0]
                parent.widget.scrollTop =  this.value ? 0 : this.parentScroll[1]
                parent.widget.style.overflow = this.value ? 'hidden' : ''
                scrollFixed = true
            }

            // stacking
            parent.container.style.zIndex = this.value ? 'initial' : ''
            parent.container.style.contain = this.value ? 'style size' : ''

            parent = parent.parent
        }

        this.container.style.contain = this.value ? 'style size' : ''


    }

}
