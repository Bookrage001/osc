var actions = require('../actions'),
    sidepanelCreateToggle = require('../sidepanel').createToggle,
    editObject = function(){editObject = require('./edit-objects').editObject; editObject(...arguments)},
    purgeStores = require('./purge'),
    {iconify} = require('../utils'),
    {widgetManager} = require('../managers'),
    parser = require('../parser'),
    parsewidgets = parser.widgets,
    parsetabs = parser.tabs

var getObjectData = function(obj){
    var path = []

    if (obj.hasClass('widget')) {
        return obj[0].abstract.props
    } else {
        return obj.closest('.widget')[0].abstract.props
    }

}

var updateDom = function(container,data, remote) {

    // save state
    var scroll = $('#sidepanel').scrollTop(),
        state = actions.stateGet(),
        parentContainer = container[0].abstract.parentNode,
        purge = container[0].abstract.hashes || [container[0].abstract.hash]

    // widget
    var newContainer = parsewidgets([data], parentContainer, container[0].abstract.parent)
    container.replaceWith(newContainer)

    if (data.type == 'tab') newContainer.trigger('tab-created')

    $('.editor-root').attr('data-widget', $('.root-container').attr('data-widget'))
    sidepanelCreateToggle()

    newContainer.trigger('resize')

    purgeStores(purge)

    // restore state
    actions.stateSet(state,false)

    if (!remote) {
        editObject(newContainer,data,true)
    }

    $('#sidepanel').scrollTop(scroll)


    // return updated node
    return newContainer

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
    getObjectData:getObjectData,
    incrementWidget:incrementWidget
}
