__widgets__ = {}
__widgetsIds__ = {}


iterator = {}
getIterator = function(type){
    if (iterator[type]==undefined) iterator[type] = 0
    iterator[type] += 1
    return iterator[type]
}

session = []

parsetabs = function(tabs,parent){

    var main = parent.hasClass('tab')
    if (main) session = tabs

    var main = main?'main ':'',
        nav = $(document.createElement('div')).addClass(main + 'navigation'),
        navtabs = $(document.createElement('ul')).addClass('tablist'),
        content = $(document.createElement('div')).addClass('content')

    nav.append(navtabs)
    parent.append(nav).append(content)


    for (i in tabs) {
        var tabData = tabs[i]


        var id = 'tab_'+getIterator('tab')
            label= tabData.label||tabData.id||id


        navtabs.append(`<li><a data-tab="#${id}"><span>${label}</span></a></li>`)

        var tabContent = $('<div></div>').addClass('tab').attr('id',id)
        tabContent.data(tabData)

        if (tabData.stretch) tabContent.addClass('stretch')

        if (tabData.tabs) {
            parsetabs(tabData.tabs,parent=tabContent)
        } else {
            parsewidgets(tabData.widgets,tabContent)
        }

        content.append(tabContent)

    }
}



parsewidgets = function(widgets,parent) {

    for (i in widgets) {
        var widgetData = widgets[i]

        widgetData.type =  widgetData.type || 'fader'

        for (i in widgetOptions[widgetData.type]) {
            if (widgetData[i]===undefined) widgetData[i] = widgetOptions[widgetData.type][i]
        }


        widgetData.id = widgetData.id=='auto'?widgetData.type+'_'+getIterator(widgetData.type):widgetData.id.replace(' ','_')
        widgetData.label = widgetData.label=='auto'?widgetData.id:widgetData.label
        widgetData.path = widgetData.path=='auto'?'/' + widgetData.id:widgetData.path
        widgetData.target = widgetData.target?(Array.isArray(widgetData.target)?widgetData.target:[widgetData.target]):false

        for (i in widgetData) {
            if (widgetOptions[widgetData.type][i]===undefined && i!='type') {delete widgetData[i]}
        }

        var width = parseInt(widgetData.width)==widgetData.width?parseInt(widgetData.width)+'rem' : widgetData.width,
            style = widgetData.width!='auto'?`width:${width};min-width:${width}`:''





        var widgetContainer = $(`
            <div class="widget ${widgetData.type}-container" widgetType="${widgetData.type}" widgetId="${widgetData.id}" path="${widgetData.path}" style="${style}">
                <div class="label"><span>${widgetData.label}</span></div>
            </div>
        `)


        if (widgetData.label===false) widgetContainer.addClass('nolabel')

        // create widget
        var widgetInner = createWidget[widgetData.type](widgetData,widgetContainer)
        widgetInner.type =  widgetData.type

        widgetContainer.data(widgetData)

        widgetContainer.append(widgetInner)

        // store widget reference for cross widget sync
        if (__widgets__[widgetData.id]==undefined) {
            __widgets__[widgetData.id] = []
        }
        __widgets__[widgetData.id].push(widgetInner)


        // store path vs widget id for faster cross-app sync
        __widgetsIds__[widgetData.path ] = widgetData.id

        parent.append(widgetContainer)
    }

    if (widgets.length==1) return widgetContainer

}
