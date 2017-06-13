var _widgets_base = require('../common/_widgets_base')

module.exports = class _matrices_base extends _widgets_base {

    constructor(options) {

        super({...options, html: '<div class="matrix"></div>'})

        this.value = []

        this.start = parseInt(this.getProp('start'))

        this.widget.on('sync',(e)=>{

            if (e.id==this.getProp('id')) return
            this.value[e.widget.parent().index()] = e.widget.abstract.getValue()
            this.widget.trigger({type:'sync',id:this.getProp('id'),widget:this.widget,options:e.options})

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
