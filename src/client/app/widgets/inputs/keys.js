var Widget = require('../common/widget'),
    {icon} = require('../../ui/utils'),
    keyboardJS = require('keyboardjs'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw')

class Keys extends Widget {

    static defaults() {

        return super.defaults({

            _keys:'keys',

            binding: {type: 'string|array', value: '', help: 'Key combo `string` or `array` of strings (see <a href="https://github.com/RobertWHurst/KeyboardJS">KeyboardJS</a> documentation)'},
            keydown: {type: 'string', value: '', help: [
                'This property is evaluated each time the key combo is pressed and defines the widget\'s own value. Formulas are given extras variables in this context:',
                '- `key`: pressed key name (usefull for handling multiple keys with a single keys widget)',
                '- `ctrl`: control key state',
                '- `alt`: alt key state',
                '- `shift`: shift key state',
                '- `super`: command/windows key state'
            ]},
            keyup: {type: 'string', value: '', help: 'Same as `keydown`, but evaluated when releasing the key combo'},
            repeat: {type: 'boolean', value: true, help: 'Set to `false` to prevent keydown repeats when holding the key combo pressed'},

        })


    }

    constructor(options) {

        super({...options, html: html`
            <div class="keys">
                ${raw(icon('keyboard'))}
            </div>
        `})

        if (this.getProp('binding')) {

            this.widget.appendChild(html`<span>${this.getProp('binding')}</span>`)

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

        if (e.target.classList.contains('no-keybinding')) return

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

        if (e.target.classList.contains('no-keybinding')) return

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
