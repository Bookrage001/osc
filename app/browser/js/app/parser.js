__widgets__ = {}
__widgetsIds__ = {}


widgetIterator = {}
tabIterator = {}
getIterator = function(type,tab){
    var iterator = tab?tabIterator:widgetIterator
    if (iterator[type]==undefined) iterator[type] = 0
    iterator[type] += 1
    return iterator[type]
}

hashCode = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

// Global session variable
session = []


parsetabs = function(tabs,parent){

    var main = !parent.hasClass('tab')
    if (main) {
        __widgets__ = {}
        __widgetsIds__ = {}

        tabIterator = {}
        session = tabs
    }

    var main = main?'main ':'',
        nav = $(document.createElement('div')).addClass(main + 'navigation'),
        navtabs = $(document.createElement('ul')).addClass('tablist'),
        content = $(document.createElement('div')).addClass('content')

    nav.append(navtabs)
    parent.append(nav).append(content)


    for (i in tabs) {
        var tabData = tabs[i]


        var label = tabData.label||tabData.id||'Unnamed',
            hash = hashCode(label),
            id = 'tab_'+hash+'_'+getIterator('tab'+hash,true),
            on = i==0?'on':''

        tabData.label = label
        tabData.stretch = tabData.stretch || false
        delete tabData.id

        navtabs.append(`<li><a class="${on}" data-tab="#${id}"><span>${label}</span></a></li>`)

        var tabContent = $(`<div class="tab ${on}" id="${id}"></div>`)
        tabContent.data(tabData)

        if (tabData.stretch) tabContent.addClass('stretch')

        if (tabData.tabs) {
            parsetabs(tabData.tabs,parent=tabContent)
        } else if (tabData.widgets) {
            parsewidgets(tabData.widgets,tabContent)
        }

        content.append(tabContent)

    }
}



parsewidgets = function(widgets,parent) {

    for (i in widgets) {
        var widgetData = widgets[i]

        widgetData.type =  widgetData.type || 'fader'

        var tmpWidgetOptions = JSON.parse(JSON.stringify(widgetOptions))

        for (i in tmpWidgetOptions[widgetData.type]) {
            if (widgetData[i]===undefined) widgetData[i] = tmpWidgetOptions[widgetData.type][i]
        }

        widgetData.id = widgetData.id=='auto'?widgetData.type+'_'+getIterator(widgetData.type):widgetData.id.replace(' ','_')
        widgetData.label = widgetData.label=='auto'?widgetData.id:widgetData.label
        widgetData.path = widgetData.path=='auto'?'/' + widgetData.id:widgetData.path
        widgetData.target = widgetData.target?(Array.isArray(widgetData.target)?widgetData.target:[widgetData.target]):false

        for (i in widgetData) {
            if (widgetOptions[widgetData.type][i]===undefined && i!='type') {delete widgetData[i]}
        }


        // Sort widgets' properties and turn string-numbers to numbers
        for (k in widgetOptions[widgetData.type]) {
            var tmp = widgetData[k]
            if (parseFloat(tmp)==tmp) tmp=parseFloat(tmp)
            if (parseInt(tmp)==tmp) tmp=parseInt(tmp)
            delete widgetData[k]
            widgetData[k] = tmp
        }

        if (parent[0].className.match(/strip|panel/)) {
            delete widgetData.top
            delete widgetData.left
        }

        var width = parseInt(widgetData.width)==widgetData.width?parseInt(widgetData.width)+'rem' : widgetData.width,
            height = parseInt(widgetData.height)==widgetData.height?parseInt(widgetData.height)+'rem' : widgetData.height,
            left = parseInt(widgetData.left)==widgetData.left?parseInt(widgetData.left)+'rem' : widgetData.left,
            top = parseInt(widgetData.top)==widgetData.top?parseInt(widgetData.top)+'rem' : widgetData.top,
            styleW = widgetData.width&&widgetData.width!='auto'?`width:${width};min-width:${width};`:'',
            styleH = widgetData.height&&widgetData.height!='auto'?`height:${height};min-height:${height};`:'',
            styleL = widgetData.left&&widgetData.left!='auto'||widgetData.left==0?`left:${left};`:'',
            styleT = widgetData.top&&widgetData.top!='auto'||widgetData.top==0?`top:${top};`:''


        var widgetContainer = $(`
            <div class="widget ${widgetData.type}-container ${styleL.length || styleT.length?'absolute-position':''}" style="${styleW + styleH + styleL + styleT}">
                <div class="label"><span>${widgetData.label}</span></div>
            </div>
        `)


        if (widgetData.label===false) widgetContainer.addClass('nolabel')

        // create widget
        var widgetInner = createWidget[widgetData.type](widgetData,widgetContainer)

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

    if (widgets && widgets.length==1) return widgetContainer

}
