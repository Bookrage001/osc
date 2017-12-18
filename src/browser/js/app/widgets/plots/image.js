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


    }

    setValue(v) {

        var s = '' + v

        this.value = s

        if (this.value.length) {

            var cache_query = this.getProp('cache') || s.indexOf('base64') != -1 ? '' : (s.indexOf('?') != -1 ? '&' : '?') + Date.now()
            this.widget[0].style.setProperty('background-image', `url(${s}${cache_query})`)

        } else {

            this.widget[0].style.setProperty('background-image', '')

        }
    }

}
