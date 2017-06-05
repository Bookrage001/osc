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

            _children:'children',

            variables:{},

            widgets:[]
        }

    }

    constructor(options) {

        options.props = {...Panel.defaults(), ...options.props}

        super(options)

        this.container.addClass(this.getProp('horizontal') ? 'horizontal' : 'vertical')
        this.container.addClass(this.getProp('stretch') ? 'stretch' : '')


    }


}
