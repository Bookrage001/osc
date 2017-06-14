var Panel = require('./panel'),
    {icon} = require('../../utils'),
    doubletabreset = require('../mixins/double_tap_reset')


module.exports = class Modal extends Panel {

    static defaults() {

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

            _popup:'popup',

            doubleTap: false,
            popupWidth:'100%',
            popupHeight:'100%',

            _layout:'layout',

            layout:'',
            spacing:0,

            _osc:'osc',

            value:'',
            precision:0,
            address:'auto',
            preArgs:[],
            target:[],

            _chidlren:'children',

            variables:'@{parent.variables}',

            widgets:[],
        }

    }

    constructor(options) {

        options.props.tabs = []

        super(options)

        this.popup = $(`
            <div class="popup">
                <div class="popup-wrapper">
                    <div class="popup-title closable"><span class="popup-label"></span><span class="closer">${icon('remove')}</span></div>
                    <div class="popup-content"></div>
                </div>
            </div>
        `)

        this.popup.appendTo(this.container).hide()


        // convert dimensions / coordinates to rem
        var width = parseFloat(this.getProp('popupWidth'))==this.getProp('popupWidth')?parseFloat(this.getProp('popupWidth'))+'rem' : this.getProp('popupWidth'),
            height = parseFloat(this.getProp('popupHeight'))==this.getProp('popupHeight')?parseFloat(this.getProp('popupHeight'))+'rem' : this.getProp('popupHeight')

        this.popup[0].style.setProperty('--width', width)
        this.popup[0].style.setProperty('--height', height)

        this.popup.find('.closer').on('fake-click',(e)=>{
            this.setValue(0, {sync:true, send:true})
        })

        this.light = $('<div class="light"></div>').appendTo(this.container)

        if (this.getProp('doubleTap')) {
            doubletabreset(this.light, ()=>{
                this.setValue(1, {sync:true, send:true})
            })
        } else {
            this.light.on('fake-click',(e)=>{
                this.setValue(1, {sync:true, send:true})
            })
        }

        this.parentScroll = [0,0]
        this.value = false
        this.init = false

    }

    setValue(v, options={}) {

        this.value = v ? 1 : 0

        if (!this.init) {
            this.popup.find('.popup-title .popup-label').html(this.container.find('> .label span').html())
            this.widget.detach().appendTo(this.popup.find('.popup-content'))
        }

        this.popup.toggle(this.value)
        this.container.toggleClass('on', this.value)

        this.fixScrolling()

        if (this.value) {
            $(window).resize()
        }

        if (!this.init || this.value == true) this.fixStacking()
        if (!this.init) this.init = true

        if (options.send) this.sendValue()
        if (options.sync) this.light.trigger({type:'sync',id:this.getProp('id'),widget:this.widget, linkId:this.getProp('linkId'), options})

    }

    fixScrolling(){
        if (this.value) {
            var c = this.container.parents('.tab, .modal-container > .panel').first()
            this.parentScroll = [c.scrollLeft(), c.scrollTop()]
            c.scrollTop(0).scrollLeft(0).css('overflow','hidden')
        } else {
            this.container.parents('.tab, .modal-container > .panel').first().css('overflow','').scrollLeft(this.parentScroll[0]).scrollTop(this.parentScroll[1])
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
