var Panel = require('./panel')

module.exports = class Strip extends Panel {

    static defaults() {

        return  {
            type:'strip',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _strip: 'strip',

            scroll:true,
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

        this.disabledProps = []

        if (this.getProp('spacing')) {
            var spacing = this.getProp('spacing')
            if (!isNaN(spacing)) spacing += 'rem'
            this.widget.style.setProperty('--spacing', spacing)
        }

        this.container.classList.add(this.getProp('horizontal') ? 'horizontal' : 'vertical')
        if (this.getProp('stretch')) this.container.classList.add('stretch')

    }

    setValue(){}
    getValue(){}

}
