var Panel = require('./panel'),
    Widget = require('../common/widget'),
    {iconify} = require('../../ui/utils')

module.exports = class Root extends Panel {

    static defaults() {

        return Widget.defaults({}, ['label', '_geometry', 'left', 'top', 'width', 'height'], {

            _children:'children',

            variables: {type: '*', value: '@{parent.variables}', help: 'Defines one or more arbitrary variables that can be inherited by children widgets'},
            tabs: {type: 'array', value: [], help: 'Each element of the array must be a tab object'},
            id: {type: 'string', value: 'root', help: 'Widgets sharing the same id will act as clones and update each other\'s value(s) without sending extra osc messages' },

            _value: 'value (tab selection)',
            _osc:'osc (tab selection)'

        })

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
