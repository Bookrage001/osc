var Container = require('../common/container'),
    {enableTraversingGestures} = require('../../events/drag')


module.exports = class _matrix_base extends Container {

    constructor(options) {

        super({...options, html: '<div class="matrix"></div>'})

        this.value = []

        this.start = parseInt(this.getProp('start'))

        this.on('change',(e)=>{

            if (e.widget == this) return

            this.value[DOM.index(e.widget.container)] = e.widget.getValue()
            this.changed(e.options)

        })

        if (this.getProp('traversing')) enableTraversingGestures(this.widget)

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'color':
                for (var w of this.children) {
                    w.onPropChanged('color')
                }
                return

        }

    }

}
