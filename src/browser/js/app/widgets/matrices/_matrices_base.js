var _widgets_base = require('../common/_widgets_base')

module.exports = class _matrices_base extends _widgets_base {

    constructor(widgetData) {

        var widgetHtml = `
            <div class="matrix"></div>
        `

        super(...arguments, widgetHtml)


        this.value = []

        widgetData.start = parseInt(widgetData.start)

        this.widget.on('sync',(e)=>{

            if (e.id==widgetData.id) return
            this.value[e.widget.parent().index()] = e.widget.abstract.getValue()
            this.widget.trigger({type:'sync',id:widgetData.id,widget:this.widget})

        })

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
