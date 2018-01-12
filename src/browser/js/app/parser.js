var widgetManager = require('./managers/widgets'),
    stateManager = require('./managers/state'),
    {iconify} = require('./utils')

var Parser = class Parser {

    constructor() {

        this.iterators = {}
        this.widgets = {}

    }

    init() {
        this.widgets = require('./widgets/').widgets
    }

    getIterator(id) {

        this.iterators[id] = (this.iterators[id] || 0) + 1
        return this.iterators[id]

    }

    reset() {

        this.iterators = {}
        widgetManager.reset()

    }

    parse(data, parentNode, parentWidget, tab) {

        for (let i in data) {

            var props = data[i]

            // Set default widget type
            props.type =  tab ? 'tab' : props.type || 'fader'

            // Backward compatibility patches
            if (props.path) props.address = props.path
            if (props.noPip) props.pips = !props.noPip

            // Safe copy widget's options
            let defaults = this.widgets[props.type].defaults()

            // Set widget's undefined options to default
            for (let i in defaults) {
                if (i.indexOf('_')!=0 && props[i]===undefined) props[i] = defaults[i]
            }

            // Genrate widget's id, based on its type
            if (props.id=='auto' || !props.id ) {
                var id
                while (!id || widgetManager.getWidgetById(id).length) {
                    id=props.type+'_'+this.getIterator(props.type)
                }
                props.id = id
            }

            // Generate default address
            props.address = props.address == 'auto' ? '/' + props.id : props.address

            // Delete unrecognized options
            for (let i in props) {
                if (defaults[i]===undefined && i!='type') {delete props[i]}
            }

            // create container
            var widgetContainer = $(`
                <div class="widget ${props.type}-container">
                <div class="label"></div>
                </div>
                `)

            // create widget
            var widgetInner = new this.widgets[props.type]({props:props, container:widgetContainer, parent:parentWidget, parentNode:parentNode})

            widgetContainer[0].appendChild(widgetInner.widget[0])

            widgetManager.addWidget(widgetInner)

            widgetContainer[0].setAttribute('data-widget', widgetInner.hash)

            widgetInner.created()

            // dimensions / coordinates can't be < 0
            for (let t of ['width', 'height', 'top', 'left']) {
                if (props.hasOwnProperty(t))
                props[t] = `${props[t]}`.indexOf('-')!=-1?0:props[t]
            }

            // convert dimensions / coordinates to rem
            var geometry = {}
            for (var d of ['width', 'height', 'left', 'top']){
                let val = widgetInner.getProp(d)
                if (val !== undefined)
                    geometry[d] = `${val}`.indexOf('-') != -1 ? 0 :
                        parseFloat(val) == val ?
                        parseFloat(val)+'rem' : val
            }

            // dimensions / coordinates css
            var styleW = widgetInner.getProp('width') && widgetInner.getProp('width') != 'auto' ? `width: ${geometry.width}; min-width:${geometry.width};` : '',
                styleH = widgetInner.getProp('height') && widgetInner.getProp('height') != 'auto' ? `height: ${geometry.height}; min-height:${geometry.height};` : '',
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

                widgetContainer.find('> .label').html(label)
            }

            // parse css
            var css = ';' + widgetInner.getProp('css'),
                scopedCss = ''

            // parse scoped css
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
                widgetInner.setValue(widgetInner.getProp('value'), {sync:true})
                stateManager.push(widgetInner.getProp('id'), undefined)
            }

            // Append the widget to its parent
            parentNode[0].appendChild(widgetContainer[0])
        }

        // Editor needs to get the container object
        if (data && data.length==1) return widgetInner

    }

}

var parser = new Parser()

module.exports = parser
