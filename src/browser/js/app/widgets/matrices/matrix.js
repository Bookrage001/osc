var Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets'),
    {enableTraversingGestures} = require('../../events/drag')


class Matrix extends Widget {

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

module.exports = Matrix
