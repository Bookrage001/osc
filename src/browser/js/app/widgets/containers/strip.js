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

    constructor(options) {

        super({...options, html: '<div class="strip"></div>'})


        var parsewidgets = require('../../parser').widgets

        if (this.getProp('horizontal')) {
            this.container.addClass('horizontal')
        } else {
            this.container.addClass('vertical')
        }

        parsewidgets(this.getProp('widgets'),this.widget, this)

    }


}
