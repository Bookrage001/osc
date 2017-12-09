var Panel = require('./panel'),
    {icon, iconify} = require('../../utils'),
    doubletab = require('../mixins/double_tap')


module.exports = class Modal extends Panel {

    static defaults() {

        return  {
            type:'modal',
            id:'auto',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _modal:'modal',

            doubleTap: false,
            popupLabel:'',
            popupWidth:'80%',
            popupHeight:'80%',
            layout:'',
            spacing:0,
            value:'',

            _osc:'osc',

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
        options.props.scroll = true

        super(options)

        this.popup = $(`
            <div class="popup">
                <div class="popup-wrapper">
                    <div class="popup-title closable"><span class="popup-label"></span><span class="closer">${icon('times')}</span></div>
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

        this.light = $('<div class="toggle"></div>').appendTo(this.container)

        if (this.getProp('doubleTap')) {
            doubletab(this.light, ()=>{
                this.setValue(1, {sync:true, send:true})
            })
        } else {
            this.light.on('fake-click',(e)=>{
                this.setValue(1, {sync:true, send:true})
            })
        }

        this.popup.on('fake-click',(e)=>{
            if (e.target == this.popup[0] && this.value == 1) {
                this.setValue(0, {sync:true, send:true})
            }
        })

        this.parentScroll = [0,0]
        this.value = 0
        this.init = false

    }

    setValue(v, options={}) {

        this.value = v ? 1 : 0

        if (!this.init && this.value) {
            var label = this.getProp('popupLabel') ? iconify(this.getProp('popupLabel')) : this.container.find('> .label').html()
            this.popup.find('.popup-title .popup-label').html(label)
            this.widget.detach().appendTo(this.popup.find('.popup-content'))
        }

        this.fixScrolling()

        this.popup.toggle(this.value?true:false)
        this.container.add(this.light).toggleClass('on', this.value?true:false)
        this.bindEscKey(this.value)

        if (this.value) {
            $(window).resize()
        }

        if (!this.init || this.value) this.fixStacking()
        if (!this.init && this.value) this.init = true

        if (options.send) this.sendValue()
        if (options.sync) this.light.trigger({type:'change',id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'), options})


    }

    bindEscKey(set) {

        if (set) {
            $(document).on('keydown.' + this.hash, (e)=>{
                if (e.keyCode==27) this.setValue(0, {sync:true, send:true})
            })
        } else {
            $(document).off('keydown.' + this.hash)
        }

    }

    onRemove() {
        this.bindEscKey(false)
        super.onRemove()
    }

    fixScrolling() {
        if (this.value) {
            var c = this.container.parents('.panel.tab').first()
            this.parentScroll = [c.scrollLeft(), c.scrollTop()]
            c.scrollTop(0).scrollLeft(0).css('overflow','hidden')
        } else {
            this.container.parents('.panel.tab').first().css('overflow','').scrollLeft(this.parentScroll[0]).scrollTop(this.parentScroll[1])
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
