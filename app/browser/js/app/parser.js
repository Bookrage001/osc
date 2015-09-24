__widgets__ = {}
__widgetsIds__ = {}


iterator = {}
getIterator = function(type){
    if (iterator[type]==undefined) iterator[type] = 0
    iterator[type] += 1
    return iterator[type]
}


parsetabs = function(tabs,parent,sub){
    if (!sub) {
        var nav = $(document.createElement('div')).addClass('main navigation'),
            navtabs = $(document.createElement('ul')).addClass('tablist'),
            content = $(document.createElement('div')).addClass('content')
        nav.append(navtabs)
        $('#container').append(nav).append(content)
    } else {
        var nav = $(document.createElement('div')).addClass('sub navigation'),
            navtabs = $(document.createElement('ul')).addClass('tablist'),
            content = $(document.createElement('div')).addClass('content hastabs')
        nav.append(navtabs)
        parent.append(nav).append(content)

    }

    for (i in tabs) {
        var tabData = tabs[i]


        var id = 'tab_'+getIterator('tab')
            label= tabData.label||tabData.id||id


        navtabs.append(`<li><a data-tab="#${id}"><span>${label}</span></a></li>`)

        var tabContent = $('<div></div>').addClass('tab').attr('id',id)

        if (tabData.stretch) tabContent.addClass('stretch')

        if (tabData.tabs) {
            parsetabs(tabData.tabs,parent=tabContent,sub=true)
        } else {
            parsewidgets(tabData.widgets,tabContent)
        }

        content.append(tabContent)

    }
}



parsewidgets = function(widgets,parent) {

    for (i in widgets) {
        var widgetData = widgets[i]

        var type = widgetData.type || 'fader'
        widgetData.id = widgetData.id?widgetData.id.replace(' ','_'):type+'_'+getIterator(type)

        var id = widgetData.id,
            label = widgetData.label || id,
            path = widgetData.path || '/' + id,
            width = clip(parseInt(widgetData.width),[1,20]),
            style= widgetData.width?`width:${width*100}rem;min-width:${width*100}rem`:''

        widgetData.path = path
        widgetData.target = widgetData.target?(Array.isArray(widgetData.target)?widgetData.target:[widgetData.target]):false

        var widgetContainer = $(`
            <div class="widget ${type}-container" widgetType="${type}" widgetId="${id}" path="${path}" style="${style}">
                <div class="label"><span>${label}</span></div>
            </div>
        `)


        if (widgetData.label===false) widgetContainer.addClass('nolabel')

        // create widget
        var widgetInner = createWidget[type](widgetData,widgetContainer)
        widgetInner.type =  type
        widgetContainer.find('.label').data('papers',widgetData)

        widgetContainer.append(widgetInner)

        // store widget reference for cross widget sync
        if (__widgets__[id]==undefined) {
            __widgets__[id] = []
        }
        __widgets__[id].push(widgetInner)


        // store path vs widget id for faster cross-app sync
        __widgetsIds__[widgetData.path ] = id

        parent.append(widgetContainer)
    }
}
