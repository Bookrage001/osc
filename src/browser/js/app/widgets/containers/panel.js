var _widgets_base = require('../common/_widgets_base'),
    autolayout = require('autolayout')

module.exports = class Panel extends _widgets_base {

    static options() {

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

            _children:'chilren',

            widgets:[],
            tabs:[]
        }

    }

    constructor(widgetData) {


        var widgetHtml = `
            <div class="panel
                        ${!widgetData.scroll?'noscroll':''}
                        ${widgetData.tabs.length?'has-tabs':''}
                        ">
            </div>
        `

        super(...arguments, widgetHtml)

        var    parsers = require('../../parser'),
            parsewidgets = parsers.widgets,
            parsetabs = parsers.tabs

        if (widgetData.tabs.length) {
            parsetabs(widgetData.tabs,this.widget)
        } else {
            parsewidgets(widgetData.widgets,this.widget)
        }

        if (widgetData.layout != '') {
            try {

                this.layout = new autolayout.View({
                    constraints: autolayout.VisualFormat.parse(widgetData.layout.split('\\n').join('\n').split(' ').join(''), {extended: true}),
                    spacing: widgetData.spacing
                });

                this.widget.on('resize',(e, w, h)=>{
                    if (!w) return
                    this.layout.setSize(w,h)
                    this.applyLayout()
                })

            } catch(err) {
                console.log('Layout parsing error: ' + err.message)
            }

        }
    }
    applyLayout(){
        this.widget.find('> .widget').each((i,widget)=>{
            var id = widget.abstract.widgetData.id
            if (!this.layout.subViews[id]) return
            var $widget = $(widget).addClass('absolute-position')
            for (var prop of ['height', 'width', 'top', 'left']) {
                delete widget.abstract.widgetData[prop]
                $widget.css(prop, this.layout.subViews[id][prop] + 'px')
            }
        })
    }

}
