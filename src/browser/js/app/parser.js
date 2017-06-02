/*
    Session File Parser
*/

var {widgetManager} = require('./managers')

var {widgets} = require('./widgets'),
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

module.exports.tabs = function(data,parent,main){

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
        tabData.label = label

        navtabs.append(`<li data-tab="#${id}" data-id="${tabData.id}"><a><span>${iconify(tabData.label)}</span></a></li>`)

        let tabContent = $(`<div class="tab ${tabData.tabs&&tabData.tabs.length?'has-tabs':''}" id="${id}" data-index="${i}"></div>`)
        tabContent.data(tabData)


        if (tabData.tabs && tabData.tabs.length) {
            module.exports.tabs(tabData.tabs,tabContent,false)
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



module.exports.widgets = function(data, parentNode, parentWidget) {

    for (let i in data) {
        var props = data[i]

        // Set default widget type
        props.type =  props.type || 'fader'

        // Safe copy widget's options
        let defaults = widgets[props.type].defaults()

        // Set widget's undefined options to default
        for (let i in defaults) {
            if (i.indexOf('_')!=0 && props[i]===undefined) props[i] = defaults[i]
        }

        // Genrate widget's id, based on its type
        if (props.id=='auto') {
            var id
            while (!id || widgetManager.getWidgetById(id).length) {
                id=props.type+'_'+getIterator(props.type,'widget')
            }
            props.id = id
        }

        // Backward compatibility patch: path -> address
        if (props.path) props.address = props.path

        // Generate default address
        props.address = props.address == 'auto' ? '/' + props.id : props.address

        // Delete unrecognized options
        for (let i in props) {
            if (defaults[i]===undefined && i!='type') {delete props[i]}
        }

        // create container
        var widgetContainer = $(`
            <div class="widget ${props.type}-container">
                <div class="label"><span></span></div>
            </div>
        `)

        // create widget
        var widgetInner = new widgets[props.type]({props:props, container:widgetContainer, parent:parentWidget})

        widgetContainer[0].appendChild(widgetInner.widget[0])

        widgetManager.addWidget(widgetInner)

        // dimensions / coordinates can't be < 0
        for (let t in {width:'',height:'',top:'',left:''}) {
            props[t] = `${props[t]}`.indexOf('-')!=-1?0:props[t]
        }

        // convert dimensions / coordinates to rem
        var width = parseFloat(widgetInner.getProp('width'))==widgetInner.getProp('width')?parseFloat(widgetInner.getProp('width'))+'rem' : widgetInner.getProp('width'),
            height = parseFloat(widgetInner.getProp('height'))==widgetInner.getProp('height')?parseFloat(widgetInner.getProp('height'))+'rem' : widgetInner.getProp('height'),
            left = parseFloat(widgetInner.getProp('left'))==widgetInner.getProp('left')?parseFloat(widgetInner.getProp('left'))+'rem' : widgetInner.getProp('left'),
            top = parseFloat(widgetInner.getProp('top'))==widgetInner.getProp('top')?parseFloat(widgetInner.getProp('top'))+'rem' : widgetInner.getProp('top')

        var geometry = {}
        for (var d of ['width', 'height', 'left', 'top']){
            if (props[d]!==undefined)
            geometry[d] = `${props[d]}`.indexOf('-') != -1 ? 0 :
                            parseFloat(props[d]) == props[d] ?
                                parseFloat(props[d])+'rem' : props[d]
        }

        // dimensions / coordinates css
        var styleW = widgetInner.getProp('width') && widgetInner.getProp('width') != 'auto' ? `width: ${geometry.width}; min-width:auto;` : '',
            styleH = widgetInner.getProp('height') && widgetInner.getProp('height') != 'auto' ? `height: ${geometry.height}; min-height:auto;` : '',
            styleL = widgetInner.getProp('left') && widgetInner.getProp('left') != 'auto'|| widgetInner.getProp('left') == 0 ?`left: ${geometry.left};` : '',
            styleT = widgetInner.getProp('top') && widgetInner.getProp('top') != 'auto'|| widgetInner.getProp('top') == 0 ? `top: ${geometry.top};` : ''

        if (styleL.length || styleT.length) widgetContainer.addClass('absolute-position')

        // Hide label if false
        if (widgetInner.getProp('label')===false) {
            widgetContainer.addClass('nolabel')
        } else {
            // Generate label, iconify if starting with "icon:"
            var label = widgetInner.getProp('label') == 'auto'?
                            widgetInner.getProp('id'):
                            iconify(widgetInner.getProp('label'))

            widgetContainer.find('> .label span').html(label)
        }

        // parse scoped css
        var css = ';' + widgetInner.getProp('css'),
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
        if (widgetInner.getProp('color') && widgetInner.getProp('color')!='auto') widgetContainer[0].style.setProperty('--color-custom',widgetInner.getProp('color'))

        // set widget's initial state
        if (widgetInner.getProp('value') !== '' && widgetInner.setValue) {
            widgetInner.setValue(widgetInner.getProp('value'))
        }

        // Append the widget to its parent
        parentNode[0].appendChild(widgetContainer[0])
    }

    // Editor needs to get the container object
    if (data && data.length==1) return widgetContainer

}
