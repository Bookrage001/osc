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

            _layout:'layout',

            layout:'',
            spacing:0,

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

        this.parentScroll = [0,0]

    }

    setValue(v) {

        this.value = v ? true : false

        this.fixScrolling()

        this.container.toggleClass('on', this.value)
        this.widget.toggleClass('on', this.value)
        this.light.toggleClass('on', this.value)

        if (this.value) $(window).resize()

        this.fixStacking()

    }

    fixScrolling(){
        if (this.value) {
            var c = this.container.parents('.tab').first()
            this.parentScroll = [c.scrollLeft(), c.scrollTop()]
            c.scrollTop(0).scrollLeft(0).css('overflow','hidden')
        } else {
            this.container.parents('.tab').first().css('overflow','').scrollLeft(this.parentScroll[0]).scrollTop(this.parentScroll[1])
        }
    }

    fixStacking() {
        if (this.value) {
            this.container.parents('.widget').css('z-index','initial')
        } else {
            this.container.parents('.widget').css('z-index','')
        }
    }

}
