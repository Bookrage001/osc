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
        for (let i in TABS) {
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


    for (let i in data) {
        var tabData = data[i]


        var label = tabData.label||tabData.id||'Unnamed',
            hash = hashCode(label),
            id = 'tab_'+hash+'_'+getIterator('tab'+hash,'tab')

        tabData.id = tabData.id || ''
        tabData.label = iconify(label)

        navtabs.append(`<li data-tab="#${id}" data-id="${tabData.id}"><a><span>${tabData.label}</span></a></li>`)

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

    for (let i in data) {
        var widgetData = data[i]

        // Set default widget type
        widgetData.type =  widgetData.type || 'fader'

        // Safe copy widget's options
        var tmpWidgetOptions = JSON.parse(JSON.stringify(widgetOptions))

        // Set widget's undefined options to default
        for (let i in tmpWidgetOptions[widgetData.type]) {
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
        for (let i in widgetData) {
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

        // create container
        var widgetContainer = $(`
            <div class="widget ${widgetData.type}-container">
                <div class="label"><span></span></div>
            </div>
        `)

        // create widget
        var widgetInner = createWidget[widgetData.type](widgetData,widgetContainer)

        widgetContainer[0].appendChild(widgetInner.widget[0])

        widgetManager.addWidget(widgetInner)

        // dimensions / coordinates can't be < 0
        for (let t in {width:'',height:'',top:'',left:''}) {
            widgetData[t] = `${widgetData[t]}`.indexOf('-')!=-1?0:widgetData[t]
        }

        // convert dimensions / coordinates to rem
        var width = parseFloat(widgetInner.getOption('width'))==widgetInner.getOption('width')?parseFloat(widgetInner.getOption('width'))+'rem' : widgetInner.getOption('width'),
            height = parseFloat(widgetInner.getOption('height'))==widgetInner.getOption('height')?parseFloat(widgetInner.getOption('height'))+'rem' : widgetInner.getOption('height'),
            left = parseFloat(widgetInner.getOption('left'))==widgetInner.getOption('left')?parseFloat(widgetInner.getOption('left'))+'rem' : widgetInner.getOption('left'),
            top = parseFloat(widgetInner.getOption('top'))==widgetInner.getOption('top')?parseFloat(widgetInner.getOption('top'))+'rem' : widgetInner.getOption('top')

        var geometry = {}
        for (var d of ['width', 'height', 'left', 'top']){
            if (widgetData[d])
            geometry[d] = `${widgetData[d]}`.indexOf('-') != -1 ? 0 :
                            parseFloat(widgetData[d]) == widgetData[d] ?
                                parseFloat(widgetData[d])+'rem' : widgetData[d]
        }

        // dimensions / coordinates css
        var styleW = widgetInner.getOption('width') && widgetInner.getOption('width') != 'auto' ? `width: ${geometry.width}; min-width:auto;` : '',
            styleH = widgetInner.getOption('height') && widgetInner.getOption('height') != 'auto' ? `height: ${geometry.height}; min-height:auto;` : '',
            styleL = widgetInner.getOption('left') && widgetInner.getOption('left') != 'auto'|| widgetInner.getOption('left') == 0 ?`left: ${geometry.left};` : '',
            styleT = widgetInner.getOption('top') && widgetInner.getOption('top') != 'auto'|| widgetInner.getOption('top') == 0 ? `top: ${geometry.top};` : ''

        if (styleL.length || styleT.length) widgetContainer.addClass('absolute-position')

        // Hide label if false
        if (widgetInner.getOption('label')===false) {
            widgetContainer.addClass('nolabel')
        } else {
            // Generate label, iconify if starting with "icon:"
            var label = widgetInner.getOption('label') == 'auto'?
                            widgetInner.getOption('id'):
                            iconify(widgetInner.getOption('label'))

            widgetContainer.find('> .label span').html(label)
        }

        // parse scoped css
        var css = ';' + widgetInner.getOption('css'),
            scopedCss = ''

        css = css.replace(/[;\}\s]*([^;\{]*\{[^\}]*\})/g, (m)=>{
            m = m.replace(/^[;\}\s]*/,'')
            if (m[0]=='&') {
                scopedCss += m
            } else {
                scopedCss += '& ' + m
            }
            return ''
        })

        // apply styles
        widgetContainer[0].setAttribute('style', styleW + styleH + styleL + styleT + css)

        // apply scoped css
        if (scopedCss.length) {
            widgetContainer.attr('id', 'widget-' + widgetInner.hash)
            scopedCss = scopedCss.split('&').join('#widget-' + widgetInner.hash)
            widgetContainer.prepend(`<style>${scopedCss}</style>`)
        }

        // Set custom css color variable
        if (widgetInner.getOption('color') && widgetInner.getOption('color')!='auto') widgetContainer[0].style.setProperty('--color-custom',widgetInner.getOption('color'))

        // set widget's initial state
        if (widgetInner.getOption('value') !== '' && widgetInner.setValue) {
            widgetInner.setValue(widgetInner.getOption('value'))
        }

        // Append the widget to its parent
        parent[0].appendChild(widgetContainer[0])
    }

    // Editor needs to get the container object
    if (data && data.length==1) return widgetContainer

}
