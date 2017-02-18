var Panel = require('./panel'),
    _widgets_base = require('../common/_widgets_base')


module.exports = class Modal extends Panel {

    static options() {

        return  {
            type:'modal',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _osc:'osc',

            address:'auto',

            _chidlren:'chilren',

            widgets:[],
            tabs:[]
        }

    }

    constructor(widgetData, container) {

        super(...arguments)

        this.widget.removeClass('noscroll')
        this.container = container

        container.append('<div class="light"></div>')
        this.light = container.find('.light').first()

        this.modal = this.widget.detach()

        this.value = false

        this.light.on('fake-click',()=>{
            this.setValue(!this.value)
        })


    }

    setValue(v) {

        this.value = v ? true : false
        this.container.toggleClass('on', this.value)
        this.widget.toggleClass('on', this.value)
        this.light.toggleClass('on', this.value)

        if (this.value) $(window).resize()

    }

}
