var editObject = function(){editObject = require('./edit-objects').editObject; editObject(...arguments)},
    purgeStores = require('./purge'),
    {iconify} = require('../utils'),
    widgetManager = require('../managers/widgets'),
    stateManager = require('../managers/state'),
    parser = require('../parser')

var updateDom = function(widget, options = {}) {

    var data = widget.props

    // save state
    var scroll = $('#sidepanel').scrollTop(),
        oldWidgets = widget.childrenHashes.concat(widget.hash),
        wScroll = {}

    stateManager.incrementQueue()

    for (let h of oldWidgets) {
        if (widgetManager.widgets[h] && widgetManager.widgets[h].getValue) {
            stateManager.push(widgetManager.widgets[h].getProp('id'), widgetManager.widgets[h].getValue())
        }
    }

    // save scroll states
    for (let h of widgetManager.scrollingWidgets) {
        if (widgetManager.widgets[h] && widgetManager.widgets[h].scroll) {
            wScroll[widgetManager.widgets[h].getProp('id')] = widgetManager.widgets[h].scroll()
        }
    }

    purgeStores(oldWidgets)

    // widget
    var newWidget = parser.parse([data], widget.parentNode, widget.parent)

    widget.container.replaceWith(newWidget.container)

    if (data.type == 'tab') newWidget.trigger('tab-created', [{widget: widget}])

    $('.editor-root').attr('data-widget', $('.root-container').attr('data-widget'))

    newWidget.container.trigger('resize')


    // restore state
    stateManager.decrementQueue()


    // restore scroll states
    for (let id in wScroll) {
        for (let w of widgetManager.getWidgetById(id)) {
            if (w.scroll) w.scroll(wScroll[id])
        }
    }

    if (!options.remote) {
        editObject(newWidget, {refresh: true})
    }

    $('#sidepanel').scrollTop(scroll)


    // return updated node
    return newWidget

}

var fakeStore = {}

var incrementWidget = function(data, root){

    if (!data) return

    if (root !== false) {
        fakeStore = {
            id:[],
            address:[]
        }
    }

    delete data.linkId

    var id = data.id,
        label = data.label,
        address = data.address

    if (id && id==label) {
        data.label = 'auto'
    }
    if (id && address == '/'+id) {

        data.address = 'auto'

    } else if (address){
        var addressref
        while (fakeStore.address.indexOf(address) != -1 || widgetManager.getWidgetByAddress(addressref).length) {
            address = address.replace(/([0-9]*)$/,function(m){
                var n = parseInt(m)+1
                n = isNaN(n)?1:n
                return n
            })
            addressref = widgetManager.createAddressRef(null, data.preArgs,address)
        }

        fakeStore.address.push(address)

        data.address = address

    }

    if (id) {
        while (fakeStore.id.indexOf(id) != -1 || widgetManager.getWidgetById(id).length) {
            id = id.replace(/([0-9]*)$/,function(m){
                var n = parseInt(m)+1
                n = isNaN(n)?1:n
                return n
            })
        }

        fakeStore.id.push(id)

        data.id = id

    }

    if (data.widgets && data.widgets.length) {
        for (let i in data.widgets) {
            data.widgets[i] = incrementWidget(data.widgets[i], false)
        }
    }

    if (data.tabs && data.tabs.length) {
        for (let i in data.tabs) {
            data.tabs[i] = incrementWidget(data.tabs[i], false)
        }
    }

    return data

}

module.exports = {
    updateDom:updateDom,
    incrementWidget:incrementWidget
}
