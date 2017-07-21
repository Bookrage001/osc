var Panel = require('./panel')

module.exports = class Strip extends Panel {

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
            color:'auto',
            css:'',

            _strip: 'strip',

            horizontal:false,
            stretch:false,
            border:true,
            spacing:0,

            _children:'children',

            variables:'@{parent.variables}',

            widgets:[]
        }

    }

    constructor(options) {

        var defaults = Panel.defaults()
        for (var k in defaults) {
            if (!options.props.hasOwnProperty(k))
                options.props[k] = defaults[k]
        }

        super(options)

        this.widget[0].style.setProperty('--spacing', this.getProp('spacing'))

        this.container.addClass(this.getProp('horizontal') ? 'horizontal' : 'vertical')
        this.container.addClass(this.getProp('stretch') ? 'stretch' : '')

        delete this.setValue

    }


}
