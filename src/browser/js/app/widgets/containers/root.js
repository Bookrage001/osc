var Panel = require('./panel'),
    {iconify} = require('../../utils'),
    Tab = require('./tab'),
    widgetManager = require('../../managers/widgets')



module.exports = class Root extends Panel {

    static defaults() {

        return {

            type:'root',

            _style:'style',

            color:'auto',
            css:'',

            _panel: 'panel',

            value:'',

            _osc:'osc',

            precision:0,
            address:'/root',
            preArgs:[],
            target:[],

            _children:'children',

            variables:{},

            tabs:[]
        }

    }

    constructor(options) {

        options.props.id = 'root'
        options.props.scroll = true
        options.props.label = false

        super(options)

        this.parent = widgetManager
        this.widget.addClass('root')
        this.widget.find('> .navigation').addClass('main')

    }

    createNavigation() {

        super.createNavigation()

        this.navigation.append(`<li class="not-editable"><a id="open-toggle" class="${$('#sidepanel').hasClass('sidepanel-open')?'sidepanel-open':''}">${iconify('^bars')}</a></li>`)

    }

}
