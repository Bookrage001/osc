var _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers'),
    {stateSet} = require('../../actions'),
    osc = require('../../osc')


module.exports = class _switchers_base extends _widgets_base {

    constructor(widgetData) {

        super(...arguments)

        this._isSwitcher = true
        this.value = {_selected:false}
        this.linkedWidgets = typeof widgetData.linkedWidgets == 'object' ? widgetData.linkedWidgets : [widgetData.linkedWidgets]

        for (var i in widgetData.values) {

            this.value[widgetData.values[i]] = {}

        }

        $('body').on(`sync.${this.hash}`,this.syncHandler.bind(this))


    }

    syncHandler(e) {

        var {id, widget} = e

        if (this.value._selected !== false && this.value[this.value._selected] && widget.abstract._isSwitcher !== true && this.isWatching(id, widget)) {

            this.value[this.value._selected][id] = JSON.parse(JSON.stringify(widget.abstract.getValue()))

        }

    }


    onRemove() {

        $('body').off(`sync.${this.hash}`)

    }

    isWatching(id, widget) {

        if (this.linkedWidgets.indexOf(id) != -1) return true

        for (var k in this.linkedWidgets) {

            let widgets = widgetManager.getWidgetById(this.linkedWidgets[k])

            for (var i in widgets) {

                if (widgets[i].widget[0].contains(widget[0])) return true

            }

        }
    }

    setValue(v, options={}) {

        let apply = false

        if (typeof v == 'object') {

            for (var k in this.value) {

                if (v.hasOwnProperty(k)) {

                    this.value[k] = v[k]
                    apply = true

                }

            }


        } else if (this.value[v] && v != '_selected') {

            this.value._selected = v
            apply = true

        }

        if (apply) this.applyState(this.value[this.value._selected], options)

    }


    applyState(state, options) {
        for (var id in state) {
            var value = state[id],
                widgets = widgetManager.getWidgetById(id)
            if (widgets.length) {
                for (var i=widgets.length-1;i>=0;i--) {
                    if (widgets[i].setValue) {
                        widgets[i].setValue(value,{sync:options.sync, send:options.send})
                    }
                }
            }
        }

        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
        if (options.send) this.sendValue()

    }

    sendValue() {

        osc.sync({
            h:this.hash,
            v:this.value
        })

    }

}
