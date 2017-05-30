var _widgets_base = require('../common/_widgets_base'),
    autolayout = require('autolayout/dist/autolayout.min.js'),
    editObject = function(){editObject = require('../../editor/edit-objects').editObject; editObject(...arguments)}


module.exports = class Panel extends _widgets_base {

    static defaults() {

        return {
            type:'panel',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            scroll:true,
            color:'auto',
            css:'',

            _layout:'layout',

            layout:'',
            spacing:0,

            _children:'children',

            widgets:[],
            tabs:[]
        }

    }

    constructor(props) {


        var widgetHtml = `
            <div class="panel">
            </div>
        `

        super(...arguments, widgetHtml)

        if (!this.getProp('scroll')) this.widget.addClass('noscroll')
        if (this.getProp('tabs').length) this.widget.addClass('has-tabs')


        var parsers = require('../../parser'),
            parsewidgets = parsers.widgets,
            parsetabs = parsers.tabs

        if (this.getProp('tabs').length) {
            parsetabs(this.getProp('tabs'),this.widget)
        } else {
            parsewidgets(this.getProp('widgets'),this.widget)
        }

        this.children = this.widget.find('> .widget')

        if (this.getProp('layout') != '') {
            try {

                var layout = this.getProp('layout').replace(/\$([0-9])+/g, (m)=>{
                    return this.children[m.replace('$','')].abstract.this.getProp('id')
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
    }
    applyLayout(){
        this.widget.find('> .widget').each((i,widget)=>{
            var id = widget.abstract.this.getProp('id')
            if (!this.layout.subViews[id]) return
            var $widget = $(widget).addClass('absolute-position').css({'min-height':'auto','min-width':'auto'})
            for (var prop of ['height', 'width', 'top', 'left']) {
                delete widget.abstract.props[prop]
                $widget.css(prop, this.layout.subViews[id][prop] + 'px')
            }
            if ($widget.hasClass('editing')) editObject($widget,widget.abstract.props,true)
            $(window).resize()
        })
    }

}
