var widgets = require('../widgets'),
    widgetOptions = widgets.widgetOptions,
    parser = require('../parser')
    parsewidgets = parser.widgets,
    parsetabs = parser.tabs,
    ui = require('../ui'),
    actions = require('../actions'),
    sidepanelCreateToggle = require('../sidepanel').createToggle,
    editObject = function(a,b){require('./edit-objects').editObject(a,b,true)},
    editSession =  function(a,b){require('./edit-objects').editSession(a,b,true)},
    purgeStores = require('./purge'),
    {iconify} = require('../utils'),
    {widgetManager} = require('../managers')


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

        if (!remote) editObject(newContainer,data)

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

        $(`[data-tab="#${container.attr('id')}"]`).html(`<a><span>${iconify(data.label)}</span></a>`)

        if (!remote) editObject(newContainer,data)

    } else if (container.attr('id')=='container') {
        // session
        var newContainer = $('#container')
        container.empty()
        parsetabs(data,container,true)

        if (!remote) {
            editSession(newContainer,data)
            sidepanelCreateToggle()
        }

    }

    newContainer.find('[data-tab]:first-child').click()

    $(window).resize()

    purgeStores(purgetabs)

    // restore state
    actions.stateSet(state,false)
    ui.scrolls()
    $('#sidepanel').scrollTop(scroll)


    // return updated node
    return newContainer

}


var incrementWidget = function(data){

    if (!data) return

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
        while (widgetManager.getWidgetByAddress(addressref)) {
            address = address.replace(/([0-9]*)$/,function(m){
                var n = parseInt(m)+1
                n = isNaN(n)?1:n
                return n
            })
            addressref = data.preArgs&&data.preArgs.length?address+'||||'+data.preArgs.join('||||'):address
        }

        data.address = address

    }

    if (id) {
        while (widgetManager.getWidgetById(id)) {
            id = id.replace(/([0-9]*)$/,function(m){
                var n = parseInt(m)+1
                n = isNaN(n)?1:n
                return n
            })
        }

        data.id = id

    }


    for (i in data) {
        if (typeof data[i] == 'object') data[i] = incrementWidget(data[i])
    }

    return data

}

module.exports = {
    updateDom:updateDom,
    getObjectData:getObjectData,
    incrementWidget:incrementWidget
}
