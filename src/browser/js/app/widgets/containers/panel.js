var _widgets_base = require('../common/_widgets_base')

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

    }

}
