var {mapToScale} = require('../utils'),
    Widget = require('../common/widget')

module.exports = class Led extends Widget {

    static defaults() {

        return {
            type:'image',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            // color:'auto',
            css:'',

            _image:'image',

            size: 'cover',
            position: 'center',
            repeat: 'no-repeat',
            border: true,
            cache: true,

            _value: 'value',
            default: '',
            value: '',

            _osc:'osc',

            preArgs:[],
            address:'auto'

        }

    }

    constructor(options) {

        var html = `
            <div class="image"></div>
        `

        super({...options, html: html})

        if (!this.getProp('border')) this.container.classList.add('noborder')

        this.widget.style.setProperty('background-size', this.getProp('size'))
        this.widget.style.setProperty('background-position', this.getProp('position'))
        this.widget.style.setProperty('background-repeat', this.getProp('repeat'))


    }

    setValue(v, options={}) {

        var s = v==null ? '' : '' + v,
            cache_query = ''

        if (!s.length) {

            this.value = this.getProp('value')

        } else if (s != 'reload') {

            if (s.length > 1) this.value = s

        }

        if (typeof this.value === 'string' && this.value.length) {

            cache_query = this.getProp('cache') || this.value.indexOf('base64') != -1 ?
                            '' : (this.value.indexOf('?') != -1 ? '&' : '?') + Date.now()

        }

        this.widget.style.setProperty('background-image', `url(${this.value}${cache_query})`)

        if (options.sync) this.changed(options)

    }

}
