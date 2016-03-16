var widgets = require('../widgets'),
    widgetOptions = widgets.widgetOptions,
    sync = widgets.sync,
    parser = require('../parser')
    parsewidgets = parser.widgets,
    parsetabs = parser.tabs,
    ui = require('../ui'),
    actions = require('../actions'),
    sidepanelCreateToggle = require('../sidepanel').createToggle,
    editObject = function(a,b){require('./edit-objects').editObject(a,b,true)},
    editSession =  function(a,b){require('./edit-objects').editSession(a,b,true)},
    purgeStores = require('./purge')


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

var updateDom = function(container,data) {

    // save state
    var scroll = $('#sidepanel').scrollTop(),
        state = actions.stateGet(),
        hadChildren = data.widgets||data.tabs||data.matrix||data.strips



    if (container.hasClass('widget')) {
        // widget
        var newContainer = parsewidgets([data],container.parent())
        container.replaceWith(newContainer)

        editObject(newContainer,data)

    } else if (container.hasClass('tab')) {
        // tab
        var newContainer = container.empty()

        if (data.widgets && data.widgets.length) parsewidgets(data.widgets,container)
        if (data.tabs && data.tabs.length) {
            parsetabs(data.tabs,container)
        }

        $(`[data-tab="#${container.attr('id')}"]`).html(`<a><span>${data.label}</span></a>`)

        editObject(newContainer,data)

    } else if (container.attr('id')=='container') {
        // session
        var newContainer = $('#container')
        container.empty()
        parsetabs(data,container,true)

        editSession(newContainer,data)
        sidepanelCreateToggle()

    }

    newContainer.find('[data-tab]:first-child').click()


    if (container.attr('id')=='container' || container.hasClass('tab') || hadChildren) purgeStores()

    // restore state
    actions.stateSet(state,false)
    sync()
    ui.scrolls()
    $('#sidepanel').scrollTop(scroll)


    // return updated node
    return newContainer

}

module.exports = {
    updateDom:updateDom,
    getObjectData:getObjectData
}
