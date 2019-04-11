var Widget = require('../common/widget'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw'),
    {remoteBrowse, icon} = require('../../ui/utils')

module.exports = class Input extends Widget {

    static description() {

        return 'File selector (server-side).'

    }

    static defaults() {

        return super.defaults({

            _input:'input',

            directory: {type: 'string', value: 'auto', help: 'Default browsing directory'},
            extension: {type: 'string', value: '*', help: 'Only display files with this extension'},
            hidePath: {type: 'boolean', value: false, help: 'Set to `true` to only display the filename (the whole path will still be used as value)'}

        })

    }

    constructor(options) {

        super({...options, html: html`
            <div class="file btn">${raw(icon('folder-open'))}<span></span></div>
        `})

        this.text = DOM.get(this.widget, 'span')[0]
        this.widget.addEventListener('fast-click', (e)=>{

            if (e.capturedByEditor === true) return

            remoteBrowse({
                extension: this.getProp('extension').replace(/^\.?(.*)$/, '$1'),
                directory: this.getProp('directory') === 'auto' ? undefined : this.getProp('directory')
            }, (path)=>{

                this.setValue(path.join(path[0][0] === '/' ? '/' : '\\'), {
                    sync: true,
                    send: true
                })

            })
        })

    }


    setValue(v, options={}) {

        this.value = v

        this.text.textContent = this.getProp('hidePath') ?
            v.split(v[0] === '/' ? '/' : '\\').pop() : v

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }




}
