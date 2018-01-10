var _widgets_base = require('../common/_widgets_base')

module.exports = class _matrices_base extends _widgets_base {

    constructor(options) {

        super({...options, html: '<div class="matrix"></div>'})

        this.value = []

        this.start = parseInt(this.getProp('start'))

        this.on('change',(e)=>{

            if (e.widget == this) return
            
            this.value[e.widget.container.index()] = e.widget.getValue()
            this.changed(e.options)

        })

    }

    registerHashes() {
        this.hashes = [this.hash]
        var widgets = this.widget.find('.widget')
        for (let widget of widgets) {
            if (widget.abstract.hashes) {
                this.hashes = this.hashes.concat(widget.abstract.hashes)
            } else {
                this.hashes.push(widget.abstract.hash)
            }
        }
    }

    // conflicts with switchers (double osc send)
    // setValue(v, options={}) {
    //     if (v && v.length == this.value.length) {
    //         for (var i in v) {
    //             this.widget[0].children[i].abstract.setValue(v[i], options)
    //         }
    //     }
    // }

}
