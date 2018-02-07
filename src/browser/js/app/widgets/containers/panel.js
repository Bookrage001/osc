var Widget = require('../common/widget'),
    autolayout = require('autolayout/dist/autolayout.kiwi.js'),
    {iconify} = require('../../ui/utils'),
    editObject = function(){editObject = require('../../editor/edit-objects').editObject; editObject(...arguments)},
    widgetManager = require('../../managers/widgets'),
    parser = require('../../parser')


class Panel extends Widget {

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
            noSync:false,

            _children:'children',

            variables:'@{parent.variables}',

            widgets:[],
            tabs:[]
        }

    }

    constructor(options) {


        super({...options, html: '<div class="panel"></div>'})

        if (this.getProp('scroll') === false) this.widget.classList.add('noscroll')
        if (this.getProp('border') === false) this.container.classList.add('noborder')
        if (this.getProp('tabs') && this.getProp('tabs').length) this.widget.classList.add('has-tabs')

        this.value = -1
        this.tabs = []

        if (this.getProp('tabs') && this.getProp('tabs').length) {

            this.widget.appendChild(DOM.create('<div class="navigation"><ul class="tablist"></ul></div>'))
            this.navigation = DOM.get(this.widget, '.tablist')[0]

            this.wrapper = this.widget.appendChild(DOM.create('<div class="tabs-wrapper"></div>'))

            parser.parse(this.getProp('tabs'), this.wrapper, this, true)
            this.createNavigation()

            this.navigation.addEventListener('fast-click', (e)=>{
                if (!e.target.hasAttribute('data-widget')) return
                var index = DOM.index(e.target)
                this.setValue(index, {sync: true, send:this.value != index})
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

        this.navigation.innerHTML = ''
        this.tabs = []

        var html = ''
        DOM.each(this.wrapper, '> .widget', (tab)=>{

            let widget = widgetManager.getWidgetByElement(tab),
                style = widget.getProp('color') == 'auto' ? '' : `style="--color-custom:${widget.getProp('color')}"`

            this.tabs.push(widget)
            html += `<li class="tablink" data-widget="${widget.hash}" ${style}><a><span>${DOM.get(tab, '> .label')[0].innerHTML}</span></a></li>`

        })

        this.navigation.innerHTML = html

        this.setValue(this.value)

    }

    parseLayout() {

        var children = DOM.get(this.widget, '> .widget')

        try {

            var layout = this.getProp('layout').replace(/\$([0-9])+/g, (m)=>{
                return widgetManager.getWidgetByElement(children[m.replace('$','')]).getProp('id')
            })

            this.layout = new autolayout.View({
                constraints: autolayout.VisualFormat.parse(layout.split('\\n').join('\n').split(' ').join(''), {extended: true}),
                spacing: this.getProp('spacing')
            })

            this.on('resize',(event)=>{
                if (!event.width) return
                this.layout.setSize(event.width, event.height)
                this.applyLayout()
            }, {element: this.widget})

        } catch(err) {
            throw new Error(`Visual Format Language error in ${this.getProp('id')}.layout: ${err.message} (line ${err.line})`)
        }

    }

    applyLayout() {
        DOM.each(this.widget, '> .widget', (widget)=>{

            var widget = widgetManager.getWidgetByElement(widget),
                id = widget.getProp('id')

            if (!this.layout.subViews[id]) return

            widget.container.classList.add('absolute-position')
            widget.container.style.minHeight = 'auto'
            widget.container.style.minWidth = 'auto'

            for (var prop of ['height', 'width', 'top', 'left']) {
                delete widget.props[prop]
                widget.container.style[prop] = this.layout.subViews[id][prop] + 'px'
            }

            if (widget.container.classList.contains('editing')) editObject(widget, {refresh:true})

            DOM.dispatchEvent(window, 'resize')

        })
    }

    setValue(v, options={}) {
        if (this.tabs.length && typeof v == 'number' && v >= 0 && v < this.tabs.length) {

            for (let i in this.tabs) {
                if (i != v) this.tabs[i].hide()
            }

            this.value = v

            this.tabs[v].show()
            DOM.each(this.navigation, 'li', (el)=>{el.classList.remove('on')})[v].classList.add('on')

            if (options.send) this.sendValue()
            if (options.sync) this.changed(options)

        }
    }

    scroll(s) {

        if (!s) {
            return [this.widget.scrollLeft, this.widget.scrollTop]
        } else {
            this.widget.scrollLeft = s[0]
            this.widget.scrollTop = s[1]
        }

    }

    onPropChanged(propName, options) {

        var ret = super.onPropChanged(propName, options)

        switch (propName) {

            case 'color':
                for (var h of this.childrenHashes) {
                    if (widgetManager.widgets[h]) {
                        widgetManager.widgets[h].onPropChanged('color')
                    }
                }
                return

        }

        return ret

    }


    onRemove() {
        this.off('resize')
        super.onRemove()
    }

}

Panel.dynamicProps = Panel.prototype.constructor.dynamicProps.concat(
    'variables'
)

module.exports = Panel
