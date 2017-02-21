/*
    Session File Parser
*/

var {widgetManager} = require('./managers')

var widgets = require('./widgets'),
    widgetOptions = widgets.widgetOptions,
    createWidget = widgets.createWidget,
    {iconify} = require('./utils')

var iterators = {
        widget:{},
        tab:{}
    },
    getIterator = function(id,type){
        iterators[type][id] = (iterators[type][id] || 0) + 1
        return iterators[type][id]
    }

var hashCode = function(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
}

var $body
$(function() {
    $body = $('body')
})

module.exports.tabs = function(data,parent,main,parentLabel){

    if (main) {
        // Reset Globals
        SESSION = data
        for (i in TABS) {
            if (i!='#container') {
                TABS[i].parent.remove()
                TABS[i].tab.remove()
                delete TABS[i]
            }
        }
        TABS['#container'] = {
            tab:$('#container')
        }

        iterators.tab = {}
        iterators.widget = {}

        widgetManager.reset()

    }

    var main = main?'main ':'',
        nav = $(document.createElement('div')).addClass(main + 'navigation'),
        navtabs = $(document.createElement('ul')).addClass('tablist'),
        content = $(document.createElement('div')).addClass('content')


    for (i in data) {
        var tabData = data[i]


        var label = tabData.label||tabData.id||'Unnamed',
            hash = hashCode(label),
            id = 'tab_'+hash+'_'+getIterator('tab'+hash,'tab')

        tabData.label = iconify(label)

        delete tabData.id

        navtabs.append(`<li data-tab="#${id}"><a><span>${tabData.label}</span></a></li>`)

        let tabContent = $(`<div class="tab ${tabData.tabs&&tabData.tabs.length?'has-tabs':''}" id="${id}" data-index="${i}"></div>`)
        tabContent.data(tabData)


        if (tabData.tabs && tabData.tabs.length) {
            module.exports.tabs(tabData.tabs,tabContent,false,tabData.label)
        } else if (tabData.widgets && tabData.widgets.length) {
            module.exports.widgets(tabData.widgets,tabContent)
        }

        tabContent.on('sync.detached', (e)=>{
            if (!document.contains(tabContent[0])) $body.trigger(e)
        })

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

        // Set default widget type
        widgetData.type =  widgetData.type || 'fader'

        // Safe copy widget's options
        var tmpWidgetOptions = JSON.parse(JSON.stringify(widgetOptions))

        // Set widget's undefined options to default
        for (i in tmpWidgetOptions[widgetData.type]) {
            if (i.indexOf('_')!=0 && widgetData[i]===undefined) widgetData[i] = tmpWidgetOptions[widgetData.type][i]
        }

        // Genrate widget's id, based on its type
        if (widgetData.id=='auto') {
            var id
            while (!id || widgetManager.getWidgetById(id).length) {
                id=widgetData.type+'_'+getIterator(widgetData.type,'widget')
            }
            widgetData.id = id
        }

        // Backward compatibility patch: path -> address
        if (widgetData.path) widgetData.address = widgetData.path

        // Genrate default address
        widgetData.address = widgetData.address=='auto'?'/' + widgetData.id:widgetData.address

        // Delete unrecognized options
        for (i in widgetData) {
            if (widgetOptions[widgetData.type][i]===undefined && i!='type') {delete widgetData[i]}
        }

        if (parent.hasClass('strip')) {
            delete widgetData.top
            delete widgetData.left
        }

        // Turn preArgs into array
        if (widgetData.preArgs!=undefined) {
            widgetData.preArgs = Array.isArray(widgetData.preArgs)?widgetData.preArgs:[widgetData.preArgs]
        }

        // Turn preArgs into array
        if (widgetData.target!=undefined) {
            widgetData.target = Array.isArray(widgetData.target)?widgetData.target:[widgetData.target]
        }

        if (widgetData.precision) {
            widgetData.precision = Math.min(20,Math.max(widgetData.precision,0))
        }

        // dimensions / coordinates can't be < 0
        for (t in {width:'',height:'',top:'',left:''}) {
            widgetData[t] = `${widgetData[t]}`.indexOf('-')!=-1?0:widgetData[t]
        }

        // convert dimensions / coordinates to rem
        var width = parseFloat(widgetData.width)==widgetData.width?parseFloat(widgetData.width)+'rem' : widgetData.width,
            height = parseFloat(widgetData.height)==widgetData.height?parseFloat(widgetData.height)+'rem' : widgetData.height,
            left = parseFloat(widgetData.left)==widgetData.left?parseFloat(widgetData.left)+'rem' : widgetData.left,
            top = parseFloat(widgetData.top)==widgetData.top?parseFloat(widgetData.top)+'rem' : widgetData.top


        // dimensions / coordinates css
        var styleW = widgetData.width&&widgetData.width!='auto'?`width:${width};min-width:auto;`:'',
            styleH = widgetData.height&&widgetData.height!='auto'?`height:${height};min-height:auto;`:'',
            styleL = widgetData.left&&widgetData.left!='auto'||widgetData.left==0?`left:${left};`:'',
            styleT = widgetData.top&&widgetData.top!='auto'||widgetData.top==0?`top:${top};`:''

        // Generate label, iconify if starting with "icon:"
        var label = widgetData.label == 'auto'?
                        widgetData.id:
                        iconify(widgetData.label)



        var css = ';' + widgetData.css,
            scopedCss = ''

        css.replace(/[;\}]*([^\;\{]*\{[^\}]*\})/g, (m)=>{
            if (m[0]==';') m = m.substr(1,m.length)
            scopedCss += '${id}' + m
            return ''
        })

        // create container
        var widgetContainer = $(`
            <div class="widget ${widgetData.type}-container ${styleL.length || styleT.length?'absolute-position':''}" style="${styleW + styleH + styleL + styleT + css}">
                <div class="label"><span>${label}</span></div>
            </div>
        `)

        // Set custom css color variable
        if (widgetData.color && widgetData.color!='auto') widgetContainer[0].style.setProperty('--color-custom',widgetData.color)

        // Hide label if false
        if (widgetData.label===false) widgetContainer.addClass('nolabel')

        // create widget
        var widgetInner = createWidget[widgetData.type](widgetData,widgetContainer)

        widgetContainer[0].appendChild(widgetInner.widget[0])

        widgetManager.addWidget(widgetInner)

        if (scopedCss.length) {
            widgetContainer.addClass('css-scope-' + widgetInner.hash)
            scopedCss = scopedCss.split('${id}').join('.css-scope-' + widgetInner.hash + ' ')
            widgetContainer.append(`<style>${scopedCss}</style>`)
        }

        // set widget's initial state
        if (widgetData.value !== '' && widgetInner.setValue) {
            widgetInner.setValue(widgetData.value)
        }

        // Append the widget to its parent
        parent[0].appendChild(widgetContainer[0])
    }

    // Editor needs to get the container object
    if (data && data.length==1) return widgetContainer

}
