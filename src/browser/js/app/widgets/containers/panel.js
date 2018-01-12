var _widgets_base = require('../common/_widgets_base'),
    autolayout = require('autolayout/dist/autolayout.kiwi.js'),
    {iconify} = require('../../utils'),
    editObject = function(){editObject = require('../../editor/edit-objects').editObject; editObject(...arguments)},
    widgetManager = require('../../managers/widgets'),
    parser = require('../../parser')



module.exports = class Panel extends _widgets_base {

    static defaults() {

        return {
            type:'panel',
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

            _panel:'panel',

            scroll:true,
            border:true,
            layout:'',
            spacing:0,
            value:'',

            _osc:'osc',

            precision:0,
            address:'auto',
            preArgs:[],
            target:[],

            _children:'children',

            variables:'@{parent.variables}',

            widgets:[],
            tabs:[]
        }

    }

    constructor(options) {


        super({...options, html: '<div class="panel"></div>'})

        if (this.getProp('scroll') === false) this.widget.addClass('noscroll')
        if (this.getProp('border') === false) this.container.addClass('noborder')
        if (this.getProp('tabs') && this.getProp('tabs').length) this.widget.addClass('has-tabs')


        this.value = -1
        this.tabs = []

        if (this.getProp('tabs') && this.getProp('tabs').length) {

            this.navigation = $('<div class="navigation"><ul class="tablist"></ul></div>').prependTo(this.widget).find('.tablist')
            this.wrapper = $('<div class="tabs-wrapper"></div>').appendTo(this.widget)

            parser.parse(this.getProp('tabs'), this.wrapper, this, true)
            this.createNavigation()

            this.navigation.on('fake-click', (e)=>{
                if (!e.target.hasAttribute('data-widget')) return
                this.setValue($(e.target).index(), {sync: true, send:this.value != $(e.target).index()})
            })

            this.on('tab-created', (e)=>{
                this.createNavigation()
                e.stopPropagation = true
            })

            this.setValue(this.getProp('value') || 0)

        } else if (this.getProp('widgets') && this.getProp('widgets').length) {

            parser.parse(this.getProp('widgets'), this.widget, this)
            if (this.getProp('layout') != '') this.parseLayout()

        }


    }

    createNavigation() {

        this.navigation.empty()
        this.tabs = []

        var tabs = this.wrapper.find('> .widget')

        for (let tab of tabs) {
            let widget = widgetManager.getWidgetByElement(tab),
                style = widget.getProp('color') == 'auto' ? '' : `style="--color-custom:${widget.getProp('color')}"`
            this.tabs.push(widget)
            this.navigation.append(`<li class="tablink" data-widget="${widget.hash}" ${style}><a><span>${$(tab).find('> .label').html()}</span></a></li>`)
        }

        this.setValue(this.value)

    }

    parseLayout() {

        var children = this.widget.find('> .widget')

        try {

            var layout = this.getProp('layout').replace(/\$([0-9])+/g, (m)=>{
                return widgetManager.getWidgetByElement(children[m.replace('$','')]).getProp('id')
            })

            this.layout = new autolayout.View({
                constraints: autolayout.VisualFormat.parse(layout.split('\\n').join('\n').split(' ').join(''), {extended: true}),
                spacing: this.getProp('spacing')
            });

            this.widget.on('resize',(e, w, h)=>{
                if (!w) {
                    var w = this.widget.width(),
                        h = this.widget.height()
                }
                this.layout.setSize(w,h)
                this.applyLayout()
            })

        } catch(err) {
            throw `Visual Format Language error in ${this.getProp('id')}.layout: ${err.message} (line ${err.line})`
        }

    }

    applyLayout() {
        this.widget.find('> .widget').each((i,widget)=>{

            var widget = widgetManager.getWidgetByElement(widget),
                id = widget.getProp('id')

            if (!this.layout.subViews[id]) return

            widget.container.addClass('absolute-position').css({'min-height':'auto','min-width':'auto'})

            for (var prop of ['height', 'width', 'top', 'left']) {
                delete widget.props[prop]
                widget.container.css(prop, this.layout.subViews[id][prop] + 'px')
            }

            if (widget.container.hasClass('editing')) editObject(widget, {refresh:true})

            $(window).resize()

        })
    }

    setValue(v, options={}) {
        if (this.tabs.length && typeof v == 'number' && v >= 0 && v < this.tabs.length) {

            if (v != this.value) {

                for (let i in this.tabs) {

                    this.tabs[i].hide()
                }

                this.tabs[v].show()

                this.value = v

                $(window).resize()

            }

            this.navigation.find('li').removeClass('on').eq(v).addClass('on')

            if (options.send) this.sendValue()
            if (options.sync) this.changed(options)

        }
    }

    scroll(s) {

        if (!s) {
            return [this.widget.scrollLeft(), this.widget.scrollTop()]
        } else {
            this.widget.scrollLeft(s[0])
            this.widget.scrollTop(s[1])
        }

    }

}
