var Widget = require('./widget'),
    widgetManager = require('../../managers/widgets')


class Container extends Widget {

    constructor(options) {

        super(options)

        this.on('widget-created', (e)=>{

            if (e.widget.parent === this) {
                this.children.push(e.widget)
            }

        })

        this.on('widget-removed', (e)=>{

            if (e.widget.parent === this) {
                this.children.splice(this.children.indexOf(e.widget), 1)
            }

        })

    }

    onRemove() {

        super.onRemove()

    }

}


module.exports = Container
