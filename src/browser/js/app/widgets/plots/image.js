var {mapToScale} = require('../utils'),
    _widgets_base = require('../common/_widgets_base')

module.exports = class Led extends _widgets_base {

    static defaults() {

        return {
            type:'image',
            id:'auto',

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
            value:'',

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

        if (!this.getProp('border')) this.container.addClass('noborder')

        this.widget[0].style.setProperty('background-size', this.getProp('size'))
        this.widget[0].style.setProperty('background-position', this.getProp('position'))
        this.widget[0].style.setProperty('background-repeat', this.getProp('repeat'))


    }

    setValue(v) {

        var s = v==null ? '' : '' + v,
            cache_query = ''

        if (!s.length) {

            this.value = this.getProp('value')

        } else if (s != 'reload') {

            if (s.length > 1) this.value = s

        }

        if (this.value.length) {

            cache_query = this.getProp('cache') || this.value.indexOf('base64') != -1 ?
                            '' : (this.value.indexOf('?') != -1 ? '&' : '?') + Date.now()

        }

        this.widget[0].style.setProperty('background-image', `url(${this.value}${cache_query})`)

    }

}
