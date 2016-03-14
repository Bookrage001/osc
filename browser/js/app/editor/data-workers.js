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
    editSession =  function(a,b){require('./edit-objects').editSession(a,b,true)}


var getObjectData = function(obj){
    var path = []

    do {
        if (obj[0].classList.contains('widget')) {
            path.unshift(obj.index())
            path.unshift('widgets')
        } else if (obj[0].classList.contains('tab')){
            path.unshift(obj.index())
            path.unshift('tabs')
        } else if (obj[0].getAttribute('id')=='container') {
            break
        }

    } while(obj = obj.parent() )

    path.splice(0,1)

    for (var i=0,obj=SESSION, path=path, len=path.length; i<len; i++){
        obj = obj[path[i]]
    }

    return obj

}

var updateDom = function(container,data) {

    // save state
    var scroll = $('#sidepanel').scrollTop(),
        state = actions.stateGet()



    if (container.hasClass('widget')) {
        // widget
        var newContainer = parsewidgets([data],container.parent())
        container.replaceWith(newContainer)

        editObject(newContainer,data)

    } else if (container.hasClass('tab')) {
        // tab
        var newContainer = container.empty()

        if (data.widgets && data.widgets.length) parsewidgets(data.widgets,container)
        if (data.tabs && data.tabs.length)    parsetabs(data.tabs,container)

        $(`a[data-tab="#${container.attr('id')}"]`).html(`<span>${data.label}</span></a>`)

        editObject(newContainer,data)

    } else if (container.attr('id')=='container') {
        // session
        var newContainer = $('#container')
        container.empty()
        parsetabs(data,container,true)

        editSession(newContainer,data)
        sidepanelCreateToggle()

    }


    // prune widget stores
    for (i in WIDGETS) {
        for (var j=WIDGETS[i].length-1;j>=0;j--) {
            if (!document.contains(WIDGETS[i][j][0])) {
                WIDGETS[i].splice(j,1)
            }
        }
        if (!WIDGETS[i].length) {
            delete WIDGETS[i]
        }
    }
    for (i in WIDGETS_LINKED) {
        for (var j=WIDGETS_LINKED[i].length-1;j>=0;j--) {
            if (!document.contains(WIDGETS_LINKED[i][j][0])) {
                WIDGETS_LINKED[i].splice(j,1)
            }
        }
        if (!WIDGETS_LINKED[i].length) {
            delete WIDGETS_LINKED[i]
        }
    }


    // restore state
    actions.stateSet(state,false)
    sync()
    ui.tabs()
    ui.scrolls()
    $('#sidepanel').scrollTop(scroll)


    // return updated node
    return newContainer

}

module.exports = {
    updateDom:updateDom,
    getObjectData:getObjectData
}
