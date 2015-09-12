parsetabs = function(tabs,parent,sub){
    if (!sub) {
        var nav = $(document.createElement('div')).addClass('main navigation'),
            navtabs = $(document.createElement('ul')).addClass('tablist'),
            content = $(document.createElement('div')).addClass('content');
        nav.append(navtabs)
        $('#container').append(nav).append(content);
    } else {
        var nav = $(document.createElement('div')).addClass('sub navigation'),
            navtabs = $(document.createElement('ul')).addClass('tablist'),
            content = $(document.createElement('div')).addClass('content hastabs');
        nav.append(navtabs);
        parent.append(nav).append(content);

    }

    for (i in tabs) {
        var tabData = tabs[i],
            id = parent?parent.attr('id')+tabData.id:tabData.id
            label= tabData.label||tabData.id

        navtabs.append('<li><a data-tab="#'+id+'"><span>'+label+'</span></a></li>');

        var tabContent = $(document.createElement('div')).addClass('tab').attr('id',id);

        if (tabData.tabs) {
            parsetabs(tabData.tabs,parent=tabContent,sub=true);
        } else {
            parsewidgets(tabData.widgets,tabContent)
        }

        content.append(tabContent);
        // console.log('OK parsing tab ' + title )

    }
}

__widgets__ = {}
__widgetsIds__ = {}

parsewidgets = function(widgets,parent) {

    for (i in widgets) {
        var widgetData = widgets[i],
            id = widgetData.id,
            label = widgetData.label || id,
            type = widgetData.type || 'fader',
            path = widgetData.path || '/' + id,
            color = '',
            accentclass = '';

        widgetData.path = path

        if (widgetData.color && widgetData.color=='accent') {
            accentclass = 'accent'
        } else if (widgetData.color) {
            color = 'style="color:'+widgetData.color+'"'
        }

        var widget = $('\
            <div class="widget '+type+'-container" widgetType="'+type+'" widgetId="'+id+'" path="'+path+'">\
                <div class="label '+accentclass+'" '+color+'>'+label+'</div>\
            </div>\
        ');

        // create widget
        var widgetInner = createWidget[type](widgetData,parent)
        widgetInner.type =  type
        widget.find('.label').data('papers',widgetData)

        // store widget reference for cross widget sync
        widget.append(widgetInner)
        if (__widgets__[id]==undefined) {
            __widgets__[id] = []
        }
        __widgets__[id].push(widgetInner)

        // store path vs widget id for faster cross-app sync
        __widgetsIds__[widgetData.path ] = id

        parent.append(widget);
    }
}
