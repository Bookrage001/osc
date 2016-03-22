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

module.exports.tabs = function(data,parent,main,parentLabel){

    if (main) {
        // Reset Globals
        WIDGETS = {}
        WIDGETS_LINKED = {}
        WIDGETS_BY_PATH = {}
        SESSION = data
        TABS['#container'] = {
            tab:$('#container')
        }

        MISC.iterators.tab = {}
    }

    var main = main?'main ':'',
        nav = $(document.createElement('div')).addClass(main + 'navigation'),
        navtabs = $(document.createElement('ul')).addClass('tablist'),
        content = $(document.createElement('div')).addClass('content')


    if (parentLabel) navtabs.append(`<li class="parent"><a><span>${parentLabel}</span></a></li>`)

    for (i in data) {
        var tabData = data[i]


        var label = tabData.label||tabData.id||'Unnamed',
            hash = hashCode(label),
            id = 'tab_'+hash+'_'+getIterator('tab'+hash,'tab')

        tabData.label = label
        delete tabData.id

        navtabs.append(`<li data-tab="#${id}"><a><span>${label}</span></a></li>`)

        var tabContent = $(`<div class="tab ${tabData.tabs&&tabData.tabs.length?'has-tabs':''}" id="${id}" data-index="${i}"></div>`)
        tabContent.data(tabData)


        if (tabData.tabs && tabData.tabs.length) {
            module.exports.tabs(tabData.tabs,tabContent,false,label)
        } else if (tabData.widgets && tabData.widgets.length) {
            module.exports.widgets(tabData.widgets,tabContent)
        }

        // content.append(tabContent)
        TABS['#'+id]= {
            parent:content,
            tab:tabContent,
            data:tabData
        }

    }

    nav[0].appendChild(navtabs[0])
    parent[0].appendChild(nav[0])
    parent[0].appendChild(content[0])
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
            while (!id || WIDGETS[id]) {
                id=widgetData.type+'_'+getIterator(widgetData.type,'widget')
            }
            widgetData.id = id
        }

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

    if (widgetData.preArgs!=undefined) {
            widgetData.preArgs = Array.isArray(widgetData.preArgs)?widgetData.preArgs:[widgetData.preArgs]
        }

        var width = parseFloat(widgetData.width)==widgetData.width?parseFloat(widgetData.width)+'rem' : widgetData.width,
            height = parseFloat(widgetData.height)==widgetData.height?parseFloat(widgetData.height)+'rem' : widgetData.height,
            left = parseFloat(widgetData.left)==widgetData.left?parseFloat(widgetData.left)+'rem' : widgetData.left,
            top = parseFloat(widgetData.top)==widgetData.top?parseFloat(widgetData.top)+'rem' : widgetData.top


        var styleW = widgetData.width&&widgetData.width!='auto'?`width:${width};min-width:auto;`:'',
            styleH = widgetData.height&&widgetData.height!='auto'?`height:${height};min-height:auto;`:'',
            styleL = widgetData.left&&widgetData.left!='auto'||widgetData.left==0?`left:${left};`:'',
            styleT = widgetData.top&&widgetData.top!='auto'||widgetData.top==0?`top:${top};`:''

        var label = widgetData.label == 'auto'?widgetData.id:widgetData.label

        var widgetContainer = $(`
            <div class="widget ${widgetData.type}-container ${styleL.length || styleT.length?'absolute-position':''}" style="${styleW + styleH + styleL + styleT + widgetData.css}">
                <div class="label"><span>${label}</span></div>
            </div>
        `)


        if (widgetData.label===false) widgetContainer.addClass('nolabel')

        // create widget
        var widgetInner = createWidget[widgetData.type](widgetData,widgetContainer)

        if (widgetData.color && widgetData.color!='auto') widgetInner[0].style.setProperty('--color-accent',widgetData.color)

        widgetContainer[0].appendChild(widgetInner[0])

        // store widget reference for cross widget sync
        if (WIDGETS[widgetData.id]==undefined) WIDGETS[widgetData.id] = []
        WIDGETS[widgetData.id].push(widgetInner)

        // store widget with linkId for widgte linking
        if (widgetData.linkId && widgetData.linkId.length) {
            if (WIDGETS_LINKED[widgetData.linkId]==undefined) WIDGETS_LINKED[widgetData.linkId] = []
            WIDGETS_LINKED[widgetData.linkId].push(widgetInner)
        }

        // store path vs widget id for faster cross-app sync
        if (widgetData.path)  {
            var pathref = widgetData.preArgs&&widgetData.preArgs.length?widgetData.path+'|--|--|'+widgetData.preArgs.join('|--|--|'):widgetData.path
            if (WIDGETS_BY_PATH[pathref]==undefined) WIDGETS_BY_PATH[pathref] = []
            WIDGETS_BY_PATH[pathref].push(widgetInner)
        }

        parent[0].appendChild(widgetContainer[0])
    }

    // Editor needs to get the container object
    if (data && data.length==1) return widgetContainer

}
