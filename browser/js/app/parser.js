var widgets = require('./widgets'),
    widgetOptions = widgets.widgetOptions,
    createWidget = widgets.createWidget

var getIterator = function(id,type){
    var iterator = MISC.iterators[type]
    if (iterator[id]==undefined) iterator[id] = 0
    iterator[id] += 1
    return iterator[id]
}

var hashCode = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

module.exports.tabs = function(data,parent,main){

    if (main) {
        // Reset Globals
        WIDGETS = {}
        WIDGETS_LINKED = {}
        WIDGETS_ID_BY_PATH = {}
        SESSION = data

        MISC.iterators.tab = {}
    }

    var main = main?'main ':'',
        nav = $(document.createElement('div')).addClass(main + 'navigation'),
        navtabs = $(document.createElement('ul')).addClass('tablist'),
        content = $(document.createElement('div')).addClass('content')

    nav.append(navtabs)
    parent.append(nav).append(content)


    for (i in data) {
        var tabData = data[i]


        var label = tabData.label||tabData.id||'Unnamed',
            hash = hashCode(label),
            id = 'tab_'+hash+'_'+getIterator('tab'+hash,'tab'),
            on = i==0?'on':''

        tabData.label = label
        delete tabData.id

        navtabs.append(`<li class="${on}"><a class="${on}" data-tab="#${id}"><span>${label}</span></a></li>`)

        var tabContent = $(`<div class="tab ${on}" id="${id}"></div>`)
        tabContent.data(tabData)


        if (tabData.tabs && tabData.tabs.length) {
            module.exports.tabs(tabData.tabs,parent=tabContent)
        } else if (tabData.widgets && tabData.widgets.length) {
            module.exports.widgets(tabData.widgets,tabContent)
        }

        content.append(tabContent)

    }
}



module.exports.widgets = function(data,parent) {

    for (i in data) {
        var widgetData = data[i]

        widgetData.type =  widgetData.type || 'fader'

        var tmpWidgetOptions = JSON.parse(JSON.stringify(widgetOptions))

        for (i in tmpWidgetOptions[widgetData.type]) {
            if (i.indexOf('separator')==-1 && widgetData[i]===undefined) widgetData[i] = tmpWidgetOptions[widgetData.type][i]
        }

        if (widgetData.id=='auto') {
            var id
            while (id=widgetData.type+'_'+getIterator(widgetData.type,'widget')) {
                if (!WIDGETS.hasOwnProperty(id)) {
                    widgetData.id = id
                    break
                }
            }
        } else {
            widgetData.id = widgetData.id.replace(' ','_')
        }

        widgetData.label = widgetData.label=='auto'?widgetData.id:widgetData.label
        widgetData.path = widgetData.path=='auto'?'/' + widgetData.id:widgetData.path
        widgetData.target = widgetData.target?(Array.isArray(widgetData.target)?widgetData.target:[widgetData.target]):false

        for (i in widgetData) {
            if (widgetOptions[widgetData.type][i]===undefined && i!='type') {delete widgetData[i]}
        }


        // Sort widgets' properties and turn string-numbers to numbers
        for (k in widgetOptions[widgetData.type]) {
            if (parseFloat(widgetOptions[widgetData.type])==widgetOptions[widgetData.type]) widgetOptions[widgetData.type]=parseFloat(widgetOptions[widgetData.type])
            if (parseInt(widgetOptions[widgetData.type])==widgetOptions[widgetData.type]) widgetOptions[widgetData.type]=parseInt(widgetOptions[widgetData.type])
        }


        for (t in {width:'',height:'',top:'',left:''}) {
            widgetData[t] = `${widgetData[t]}`.indexOf('-')!=-1?0:widgetData[t]
        }

        if (parent.hasClass('strip')) {
            delete widgetData.top
            delete widgetData.left
        }

        var width = parseFloat(widgetData.width)==widgetData.width?parseFloat(widgetData.width)+'rem' : widgetData.width,
            height = parseFloat(widgetData.height)==widgetData.height?parseFloat(widgetData.height)+'rem' : widgetData.height,
            left = parseFloat(widgetData.left)==widgetData.left?parseFloat(widgetData.left)+'rem' : widgetData.left,
            top = parseFloat(widgetData.top)==widgetData.top?parseFloat(widgetData.top)+'rem' : widgetData.top


        var styleW = widgetData.width&&widgetData.width!='auto'?`width:${width};min-width:auto;`:'',
            styleH = widgetData.height&&widgetData.height!='auto'?`height:${height};min-height:auto;`:'',
            styleL = widgetData.left&&widgetData.left!='auto'||widgetData.left==0?`left:${left};`:'',
            styleT = widgetData.top&&widgetData.top!='auto'||widgetData.top==0?`top:${top};`:''


        var widgetContainer = $(`
            <div class="widget ${widgetData.type}-container ${styleL.length || styleT.length?'absolute-position':''}" style="${styleW + styleH + styleL + styleT + widgetData.css}">
                <div class="label"><span>${widgetData.label}</span></div>
            </div>
        `)


        if (widgetData.label===false) widgetContainer.addClass('nolabel')

        // create widget
        var widgetInner = createWidget[widgetData.type](widgetData,widgetContainer)

        widgetContainer.append(widgetInner)

        // store widget reference for cross widget sync
        if (WIDGETS[widgetData.id]==undefined) WIDGETS[widgetData.id] = []
        WIDGETS[widgetData.id].push(widgetInner)

        // store widget with linkId for widgte linking
        if (widgetData.linkId && widgetData.linkId.length) {
            if (WIDGETS_LINKED[widgetData.linkId]==undefined) WIDGETS_LINKED[widgetData.linkId] = []
            WIDGETS_LINKED[widgetData.linkId].push(widgetInner)
        }


        // store path vs widget id for faster cross-app sync
        WIDGETS_ID_BY_PATH[widgetData.path] = widgetData.id

        parent.append(widgetContainer)
    }

    // Editor needs to get the container object
    if (data && data.length==1) return widgetContainer

}
