var Panel = require('./panel'),
    Widget = require('../common/widget'),
    resize = require('../../events/resize')

module.exports = class Tab extends Panel {

    static defaults() {

        return Widget.defaults({}, ['_geometry', 'left', 'top', 'width', 'height'], {

            _children:'children',

            variables: {type: '*', value: '@{parent.variables}', help: 'Defines one or more arbitrary variables that can be inherited by children widgets'},
            widgets: {type: 'array', value: [], help: 'Each element of the array must be a widget object. A tab cannot contain widgets and tabs simultaneously'},
            tabs: {type: 'array', value: [], help: 'Each element of the array must be a tab object. A tab cannot contain widgets and tabs simultaneously'},

            value: {type: 'integer', value: '', help: [
                'Defines currently opened tab in the widget',
                'A a tab can be opened by setting its parent\'s value'
            ]},

        })

    }

    constructor(options) {

        options.props.scroll = true

        super(options)

        this.container.classList.add('show')
        this.widget.classList.add('tab')

        this.detached = false

    }

    hide() {
        if (this.detached) return
        this.container.removeChild(this.widget)
        this.container.classList.remove('show')
        this.detached = true

    }
    show() {
        if (!this.detached) return
        this.container.appendChild(this.widget)
        this.container.classList.add('show')
        this.detached = false
        resize.check(this.widget, true)
    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'label':
            case 'color':
                if (this.parent.createNavigation) this.parent.createNavigation()
                return

        }

    }

}
