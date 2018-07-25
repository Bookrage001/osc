var widgetManager = require('../managers/widgets'),
    resize = require('../events/resize'),
    stateManager = require('../managers/state'),
    parser = require('../parser'),
    editor

var updateWidget = function(widget, options = {}) {

    // save state
    var sidepanel = DOM.get('#sidepanel')[0],
        scroll = sidepanel.scrollTop,
        oldWidgets = widget.childrenHashes.concat(widget.hash),
        wasSelected = editor.selectedWidgets.includes(widget),
        wScroll = {}

    stateManager.incrementQueue()

    for (let h of oldWidgets) {
        if (widgetManager.widgets[h]) {
            let id = widgetManager.widgets[h].getProp('id'),
                value = widgetManager.widgets[h].getValue(),
                valueProp = widgetManager.widgets[h].getProp('value')

            stateManager.pushValueState(id, value)
            if (valueProp !== '' && valueProp !== undefined) stateManager.pushValueOldProp(id, valueProp)
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
    var newWidget = parser.parse([widget.props], widget.parentNode, widget.parent, false, options.reCreateOptions)

    widget.container.parentNode.replaceChild(newWidget.container, widget.container)

    if (newWidget.getProp('type') == 'tab') newWidget.parent.trigger('tab-created', [{widget: widget}])
    if (newWidget.getProp('id') == 'root') DOM.get('.editor-root')[0].setAttribute('data-widget', newWidget.hash)


    resize.check(newWidget.container)


    // restore state
    stateManager.decrementQueue()


    // restore scroll states
    for (let id in wScroll) {
        for (let w of widgetManager.getWidgetById(id)) {
            if (w.scroll) w.scroll(wScroll[id])
        }
    }

    if (wasSelected && !options.preventSelect) {
        editor.select(newWidget)
    }

    sidepanel.scrollTop = scroll


    // return updated node
    return newWidget

}

var fakeStore = {}

var incrementWidget = function(data, root){

    if (!data) return

    if (root !== false) {
        fakeStore = {
            id:[],
            address:[]
        }
    }

    var id = data.id,
        address = data.address

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

editor = require('./')
