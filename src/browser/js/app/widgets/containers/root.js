var Panel = require('./panel'),
    Widget = require('../common/widget'),
    {iconify} = require('../../ui/utils'),
    {enableTraversingGestures, disableTraversingGestures} = require('../../events/drag')

class Root extends Panel {

    static defaults() {

        return Widget.defaults({}, ['label', '_geometry', 'left', 'top', 'width', 'height'], {

            _children:'children',

            traversing: {type: 'boolean', value: false, help: 'Set to `true` to enable traversing gestures in this widget. Set to `smart` or `auto` to limit affected widgets by the type of the first touched widget'},
            variables: {type: '*', value: {}, help: 'Defines one or more arbitrary variables that can be inherited by children widgets'},
            tabs: {type: 'array', value: [], help: 'Each element of the array must be a tab object'},
            id: {type: 'string', value: 'root', help: 'Widgets sharing the same id will act as clones and update each other\'s value(s) without sending extra osc messages' },

            value: {type: 'integer', value: '', help: [
                'Defines currently opened tab in the widget',
                'A tab can be opened only by setting its parent\'s value'
            ]},

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

        this.setTraversing()

    }

    createNavigation() {

        super.createNavigation()

        this.navigation.appendChild(DOM.create(`
            <li class="not-editable">
                <a id="open-toggle" class="${DOM.get('#sidepanel')[0].classList.contains('sidepanel-open')?'sidepanel-open':''}">${iconify('^bars')}</a>
            </li>
        `))

    }

    setTraversing(update) {

        var traversing = this.getProp('traversing')

        disableTraversingGestures(this.widget)

        if (traversing) {
            enableTraversingGestures(this.widget, {smart: typeof traversing === 'string' && traversing.match(/smart|auto/)})
        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'traversing':
                this.setTraversing()
                return

        }

    }

}

Root.dynamicProps = Root.prototype.constructor.dynamicProps.concat(
    'traversing'
)

module.exports = Root
