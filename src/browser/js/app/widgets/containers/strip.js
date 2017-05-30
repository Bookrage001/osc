var _widgets_base = require('../common/_widgets_base')

module.exports = class Strip extends _widgets_base {

    static defaults() {

        return  {
            type:'strip',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            horizontal:false,
            color:'auto',
            css:'',

            _children:'children',

            widgets:[]
        }

    }

    constructor(props, container) {

        var widgetHtml = `
            <div class="strip"></div>
        `

        super(...arguments, widgetHtml)

        var parsewidgets = require('../../parser').widgets

        if (this.getProp('horizontal')) {
            container.addClass('horizontal')
        } else {
            container.addClass('vertical')
        }

        parsewidgets(this.getProp('widgets'),this.widget)

    }


}
