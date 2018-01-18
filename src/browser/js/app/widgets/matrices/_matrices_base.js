var _widgets_base = require('../common/_widgets_base'),
    {enableTraversingGestures} = require('../../events/drag')


module.exports = class _matrices_base extends _widgets_base {

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

}
