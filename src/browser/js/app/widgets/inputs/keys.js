var Widget = require('../common/widget'),
    {iconify} = require('../../ui/utils'),
    keyboardJS = require('keyboardjs')

class Keys extends Widget {

    static defaults() {

        return {
            type:'keys',
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

            _keys:'keys',

            binding:'',
            keydown:'',
            keyup:'',
            repeat:true,

        }

    }

    constructor(options) {

        var html = `
            <div class="keys">
                ${iconify('^keyboard')}
            </div>
        `

        super({...options, html: html})

        if (this.getProp('binding')) {

            this.widget.appendChild(DOM.create(`<span>${this.getProp('binding')}</span>`))

            this.keyDownHandler = this.keyDown.bind(this)
            this.keyUpHandler = this.keyUp.bind(this)

            keyboardJS.bind(this.getProp('binding'), this.keyDownHandler, this.keyUpHandler)

        }

    }

    onRemove() {

        super.onRemove()

        if (this.getProp('binding')) {

            keyboardJS.unbind(this.getProp('binding'), this.keyDownHandler, this.keyUpHandler)

        }

    }

    keyDown(e) {

        if (e.target.classList.contains('input')) return

        if (!this.getProp('repeat') && e) e.preventRepeat()

        if (this.getProp('keydown') !== '') {

            var context = {
                key: e.key,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                meta: e.metaKey
            }

            this.setValue(this.resolveProp('keydown', undefined, false, false, false, context), {sync: true, send: true})

        }


        this.showKeydown()

    }


    keyUp(e) {

        if (e.target.classList.contains('input')) return

        if (this.getProp('keyup') !== '') {

            var context = {
                key: e.key,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                meta: e.metaKey
            }

            this.setValue(this.resolveProp('keyup', undefined, false, false, false, context), {sync: true, send: true})

        }

        this.showKeyup()

    }

    showKeydown(){

        this.widget.style.setProperty('--opacity', 1)

    }

    showKeyup(){

        this.widget.style.setProperty('--opacity', 0.75)

    }

    setValue(v, options = {}) {

        this.value = v

        // if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

}

Keys.dynamicProps = Keys.prototype.constructor.dynamicProps.concat(
    'keydown',
    'keyup',
    'repeat'
)

module.exports = Keys
