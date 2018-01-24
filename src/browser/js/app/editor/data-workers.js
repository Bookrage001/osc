var editObject = function(){editObject = require('./edit-objects').editObject; editObject(...arguments)},
    {iconify} = require('../ui/utils'),
    widgetManager = require('../managers/widgets'),
    resize = require('../events/resize'),
    stateManager = require('../managers/state'),
    parser = require('../parser')

var updateWidget = function(widget, options = {}) {

    // save state
    var sidepanel = DOM.get('#sidepanel')[0],
        scroll = sidepanel.scrollTop,
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

    widgetManager.removeWidgets(oldWidgets)

    // widget
    var newWidget = parser.parse([widget.props], widget.parentNode, widget.parent)

    widget.container.parentNode.replaceChild(newWidget.container, widget.container)

    if (newWidget.getProp('type') == 'tab') newWidget.parent.trigger('tab-created', [{widget: widget}])
    if (newWidget.getProp('id') == 'root') DOM.get('.editor-root')[0].setAttribute('data-widget', DOM.get('.root-container')[0].getAttribute('data-widget'))


    resize.check(newWidget.container)


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

    sidepanel.scrollTop = scroll


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
    updateWidget:updateWidget,
    incrementWidget:incrementWidget
}
