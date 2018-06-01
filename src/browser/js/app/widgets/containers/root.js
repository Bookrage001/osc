var Panel = require('./panel'),
    {iconify} = require('../../ui/utils')

module.exports = class Root extends Panel {

    static defaults() {

        return {

            type:'root',
            id: 'root',
            linkId:'',

            _style:'style',

            color:'auto',
            css:'',

            _value: 'value (tab selection)',
            default: '',
            value: '',

            _osc:'osc (tab selection)',

            precision:0,
            address:'/root',
            preArgs:[],
            target:[],
            bypass:false,

            _children:'children',

            variables:{},

            tabs:[]
        }

    }

    constructor(options) {

        options.root = true
        options.props.id = 'root'
        options.props.scroll = true
        options.props.label = false

        super(options)

        this.widget.classList.add('root')

        this.disabledProps.push('id')

        DOM.each(this.widget, '> .navigation', (el)=>{
            el.classList.add('main')
        })

    }

    createNavigation() {

        super.createNavigation()

        this.navigation.appendChild(DOM.create(`
            <li class="not-editable">
                <a id="open-toggle" class="${DOM.get('#sidepanel')[0].classList.contains('sidepanel-open')?'sidepanel-open':''}">${iconify('^bars')}</a>
            </li>
        `))

    }

}
