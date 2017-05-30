var ui = require('../ui'),
    actions = require('../actions'),
    sidepanelCreateToggle = require('../sidepanel').createToggle,
    editObject = function(){editObject = require('./edit-objects').editObject; editObject(...arguments)},
    editSession = function(){editSession = require('./edit-objects').editSession; editSession(...arguments)},
    purgeStores = require('./purge'),
    {iconify} = require('../utils'),
    {widgetManager} = require('../managers'),
    parser = require('../parser'),
    parsewidgets = parser.widgets,
    parsetabs = parser.tabs

var getObjectData = function(obj){
    var path = []

    if (obj.hasClass('tab')) {
        return TABS['#'+obj.attr('id')].data
    }

    if (obj.is('#container')) {
        return SESSION
    }

    while(true) {
        if (obj.hasClass('widget')) {
            path.unshift(obj.index())
            path.unshift('widgets')
        } else if (obj.hasClass('tab')){
            path.unshift(obj.data('index'))
            path.unshift('tabs')
        } else if (obj.is('#container')) {
            break
        }

        obj = obj.parent()
    }

    path.splice(0,1)

    for (var i=0,data=SESSION, path=path, len=path.length; i<len; i++){
        data = data[path[i]]
    }

    return data

}

var updateDom = function(container,data, remote) {

    // save state
    var scroll = $('#sidepanel').scrollTop(),
        state = actions.stateGet(),
        purgetabs = data.tabs?true:false


    if (container.hasClass('widget')) {
        // widget
        var newContainer = parsewidgets([data],container.parent())
        container.replaceWith(newContainer)

        if (!remote) editObject(newContainer,data,true)

    } else if (container.hasClass('tab')) {
        // tab
        var newContainer = container.empty()

        if (data.widgets && data.widgets.length) parsewidgets(data.widgets,container)
        if (data.tabs && data.tabs.length) {
            parsetabs(data.tabs,container,false,data.label)
            container.addClass('has-tabs')
        } else {
            container.removeClass('has-tabs')
        }

        $(`[data-tab="#${container.attr('id')}"]`).html(`<a ta><span>${iconify(data.label)}</span></a>`).attr('data-id',data.id)

        if (!remote) editObject(newContainer,data,true)

    } else if (container.attr('id')=='container') {
        // session
        var newContainer = $('#container')
        container.empty()
        parsetabs(data,container,true)

        if (!remote) {
            editSession(newContainer,data,true)
            sidepanelCreateToggle()
        }

    }

    newContainer.find('[data-tab]:first-child').trigger('fake-click')

    newContainer.trigger('resize')
    // $(window).resize()

    purgeStores(purgetabs)

    // restore state
    actions.stateSet(state,false)
    ui.scrolls()
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
