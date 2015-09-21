__widgets__ = {}
__widgetsIds__ = {}

var iterator = {
        tab: 0,
        widget: 0
    },
    getIterator = function(type){
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


        tabData.id = tabData.id?tabData.id.replace(' ','_'):'tab_'+getIterator('tab')

        var id = 'tab_'+getIterator('tab')
            label= tabData.label||tabData.id


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

        widgetData.id = widgetData.id?widgetData.id.replace(' ','_'):'widget_'+getIterator('widget')

        var id = widgetData.id,
            label = widgetData.label || id,
            type = widgetData.type || 'fader',
            path = widgetData.path || '/' + id,
            style= widgetData.width?'width:'+widgetData.width*100+'rem':''

        widgetData.path = path

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
