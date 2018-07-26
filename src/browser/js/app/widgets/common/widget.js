var EventEmitter = require('../../events/event-emitter'),
    osc = require('../../osc'),
    nanoid = require('nanoid/generate'),
    widgetManager = require('../../managers/widgets'),
    {math} = require('../utils'),
    scopeCss = require('scope-css'),
    {iconify} = require('../../ui/utils'),
    resize = require('../../events/resize'),
    OscReceiver = require('./osc-receiver'),
    updateWidget = ()=>{}


var OSCProps = [
    'precision',
    'address',
    'preArgs',
    'target',
    'bypass'
]

var dummyDOM

DOM.ready(()=>{
    dummyDOM = DOM.create('<div></div>')
})

setTimeout(()=>{
    updateWidget = require('../../editor/data-workers').updateWidget
})

class Widget extends EventEmitter {

    static defaults() {

        throw new Error('Calling unimplemented static defaults() method')

    }

    constructor(options={}) {

        super()

        this.widget = DOM.create(options.html)
        this.props = options.props
        this.errors = {}
        this.parsers = {}
        this.parent = options.root ? widgetManager : options.parent
        this.parentNode = options.parentNode
        this.hash = nanoid('abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
        this.childrenHashes = []
        this.reCreateOptions = options.reCreateOptions

        // strip parent ? no position
        if (this.parent && this.parent.props && this.parent.props.type == 'strip') {
            delete this.props.top
            delete this.props.left
            delete this.props[this.parent.getProp('horizontal') ? 'height' : 'width']
        }

        // @{props} links lists
        this.linkedProps = {}
        this.linkedPropsValue = {}

        // OSC{/path} receivers
        this.oscReceivers = {}

        // cache props (resolve @{props})
        this.cachedProps = {}

        for (var k in this.props) {
            if (k != 'widgets' && k != 'tabs') {
                this.cachedProps[k] = this.resolveProp(k, undefined, true)
            } else {
                this.cachedProps[k] = this.props[k]
            }
        }

        if (this.getProp('id') == 'root' && !options.root) {
            this.cachedProps.id = '_root'
            this.errors.id = 'There can only be one root'
        }

        if (Object.keys(this.linkedProps).length) {

            widgetManager.on(`widget-created.${this.hash}`, (e)=>{
                var {id, widget, options} = e
                if (widget == this.parent) return
                if (widget == this) id = 'this'
                if (this.linkedProps[id]) {
                    this.updateProps(this.linkedProps[id], widget, options)
                }
            })

            widgetManager.on(`prop-changed.${this.hash}`, (e)=>{
                let {id, widget, options} = e
                if (widget == this) id = 'this'
                if (widget == this.parent) id = 'parent'
                if (this.linkedProps[id]) {
                    this.updateProps(this.linkedProps[id], widget, options, e.props)
                }
            })

        }

        if (Object.keys(this.linkedPropsValue).length) {

            widgetManager.on(`change.${this.hash}`, (e)=>{
                var {id, widget, options} = e
                if (widget == this) id = 'this'
                if (widget == this.parent) id = 'parent'
                if (this.linkedPropsValue[id]) {
                    this.updateProps(this.linkedPropsValue[id], widget, options, ['value'])
                }
            })

        }

        var selfLinkedOSCProps = (this.linkedPropsValue['this'] || []).filter(i=>OSCProps.indexOf(i) > -1)
        this.selfLinkedOSCProps = selfLinkedOSCProps.length ? selfLinkedOSCProps : false


        this.disabledProps = []

        // cache precision
        if (this.props.precision != undefined) {
            this.precision = Math.min(20,Math.max(this.getProp('precision', undefined, false),0))
        }

        this.on('widget-created', (e)=>{

            if (e.widget == this) return

            this.childrenHashes.push(e.widget.hash)

        })

        if (options.container) {

            this.container = DOM.create(`
                <div class="widget ${options.props.type}-container" id="${this.hash}" data-widget="${this.hash}"></div>
            `)
            this.label = DOM.create('<div class="label"></div>')
            this.container.appendChild(this.label)
            this.container.appendChild(this.widget)
            this.container._widget_instance = this
            this.setContainerStyles()
        } else {
            this.container = dummyDOM
        }

    }

    contains(widget) {

        if (this.childrenHashes.includes(widget.hash)) {
            return true
        }

        var parent = widget.parent
        while (parent && parent !== widgetManager) {
            if (parent === this) return true
            parent = parent.parent
        }
    }

    created() {

        this.trigger('widget-created.*', [{
            id: this.getProp('id'),
            widget: this,
            options: this.reCreateOptions
        }])

    }

    changed(options) {

        this.trigger('change.*', [{
            widget: this,
            options: options,
            id: this.getProp('id'),
            linkId: this.getProp('linkId')
        }])

    }

    sendValue(overrides, options={}) {

        if (this.selfLinkedOSCProps) {
            this.updateProps(this.selfLinkedOSCProps, this)
        }

        if (this.getProp('bypass') && !options.force) return

        var data = {
            h:this.hash,
            v:this.value
        }

        if (overrides) {
            for (var k in overrides) {
                data[k] = overrides[k]
            }
        }

        if (options.syncOnly) {

            osc.sync(data)

        } else {

            osc.send(data)

        }

    }

    setValue() {}

    getValue(withPrecision) {

        return Widget.deepCopy(this.value, withPrecision ? this.precision : undefined)

    }

    static deepCopy(obj, precision){

        var copy = obj

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (let key in obj) {
                copy[key] = Widget.deepCopy(obj[key], precision)
            }
        } else if (typeof obj == 'number') {
            return precision === undefined ? copy : parseFloat(copy.toFixed(precision))
        }

        return copy

    }

    resolveProp(propName, propValue, storeLinks=true, originalWidget, originalPropName, context) {

        propValue = propValue !== undefined ? propValue : Widget.deepCopy(this.props[propName])
        originalWidget = originalWidget || this
        originalPropName = originalPropName || propName

        var variables = {},
            mathscope = context || {},
            varnumber = 0

        if (typeof propValue == 'string') {

            propValue = propValue.replace(/@\{[^{]*?(@\{.*?\})?[^{]*?\}/g, (m, nested)=>{

                if (nested) {
                    m = m.replace(nested, this.resolveProp(propName, nested, false, this))
                }

                let id = m.substr(2, m.length - 3).split('.'),
                    k, subk

                if (id.length > 1) {

                    k = id.pop()
                    subk = undefined

                    if (id.length > 1) {
                        subk = k
                        k = id.pop()
                    }

                    id = id.join('.')

                } else {

                    id = id[0]
                    k = 'value'

                }

                // backward compat
                if (k === '_value') k = 'value'

                var widgets = id == 'parent' && this.parent ?
                    [this.parent] : id == 'this' ? [this] :
                        widgetManager.getWidgetById(id)

                if (!widgets.length) {
                    var parent = this.parent
                    while (parent && parent != widgetManager) {
                        if (parent.getProp('id') == id) {
                            widgets.push(parent)
                            break
                        }
                        parent = parent.parent
                    }
                }

                if (storeLinks) {

                    if (k == 'value') {

                        if (!this.linkedPropsValue[id]) this.linkedPropsValue[id] = []
                        if (this.linkedPropsValue[id].indexOf(propName) == -1) this.linkedPropsValue[id].push(propName)

                    } else {

                        if (!this.linkedProps[id]) this.linkedProps[id] = []
                        if (this.linkedProps[id].indexOf(propName) == -1) this.linkedProps[id].push(propName)

                    }

                }

                for (var i in widgets) {

                    if (widgets[i].props[k] !== undefined || k === 'value') {

                        if (k !== 'value' && originalPropName == k && widgets[i].props.id == originalWidget.props.id) {
                            return undefined
                        }

                        var r = k == 'value' ?
                            widgets[i].getValue(true) :
                            widgets[i].resolveProp(k, undefined, storeLinks, originalWidget, originalPropName)

                        if (subk !== undefined && r !== undefined) r = r[subk]

                        var varname = 'VAR_' + varnumber
                        varnumber++

                        variables[varname] = r
                        mathscope[varname] = r

                        return varname

                    }

                }

            })

            propValue = propValue.replace(/OSC\{([^}]+)\}/g, (m)=>{
                let [address, value] = m.substr(4, m.length - 5).split(',').map(x=>x.trim()),
                    resolvedAddress = address.replace(/VAR_[0-9]+/g, (m)=>{
                        return typeof variables[m] === 'string' ? variables[m] : JSON.stringify(variables[m])
                    })

                if (!this.oscReceivers[address]) {
                    this.oscReceivers[address] = new OscReceiver(resolvedAddress, value, this, propName)
                } else {
                    this.oscReceivers[address].setAddress(resolvedAddress)
                }

                var r = this.oscReceivers[address].value

                var varname = 'VAR_' + varnumber
                varnumber++

                variables[varname] = r
                mathscope[varname] = r

                return varname
            })

            try {
                propValue = propValue.replace(/#\{(?:[^}\\]|\\.)+\}/g, (m)=>{

                    // unescape brackets
                    m = m.replace(/\\(\{|\})/g, '$1')

                    // espace multiline strings
                    m = m.replace(/`([^`]*)`/g, (m)=>{
                        return m.replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/`/g,'"')
                    })

                    if (!this.parsers[m]) this.parsers[m] = math.compile(m.substr(2, m.length - 3).trim())

                    let r = this.parsers[m].eval(mathscope)

                    if (r instanceof math.type.ResultSet && !r.entries.length) {
                        r = ''
                    } else if (typeof r === 'object' && r !== null && r.valueOf) {
                        r = r.valueOf()
                        if (Array.isArray(r) && r.length == 1) r = r[0]
                    }

                    return typeof r != 'string' ? JSON.stringify(r) : r
                })
            } catch (err) {}

            for (let k in variables) {
                var v = typeof variables[k] === 'string' ? variables[k] : JSON.stringify(variables[k])
                propValue = propValue.replace(new RegExp(k, 'g'), v)
            }

            try {
                propValue = JSON.parse(propValue)
            } catch (err) {}

        } else if (propValue != null && typeof propValue == 'object') {
            for (let k in propValue) {
                propValue[k] = this.resolveProp(propName, propValue[k], storeLinks, originalWidget, originalPropName, context)
            }
        }

        return propValue


    }

    getProp(propName) {
        return this.cachedProps[propName]
    }

    updateProps(propNames, widget, options, updatedProps = []) {

        if (propNames.includes('value')) {
            propNames.splice(propNames.indexOf('value'), 1)
            propNames.push('value')
        }

        var reCreate = false,
            changedProps = []

        for (var propName of propNames) {

            if (widget === this && updatedProps.includes(propName)) continue

            let propValue = this.resolveProp(propName, undefined, false),
                oldPropValue = this.getProp(propName)

            if (JSON.stringify(oldPropValue) !== JSON.stringify(propValue)) {


                if (!this.constructor.dynamicProps.includes(propName)) {

                    reCreate = true

                } else {

                    this.cachedProps[propName] = propValue
                    changedProps.push({propName, oldPropValue})

                }


            }
        }
        if (reCreate && this.childrenHashes.indexOf(widget.hash) == -1 && !(widget === this && updatedProps.length === 1 && updatedProps[0] === 'value')) {

            this.reCreateWidget(options)
            return true

        } else if (changedProps.length) {

            for (var i in changedProps) {
                this.onPropChanged(changedProps[i].propName, options, changedProps[i].oldPropValue)
            }

            widgetManager.trigger('prop-changed.*', [{
                id: this.getProp('id'),
                props: changedProps,
                widget: this,
                options: options
            }])

        }

    }

    onPropChanged(propName, options, oldPropValue) {

        switch(propName) {

            case 'value':
                this.setValue(this.getProp('value'), {sync: true, send: options && options.send})
                return

            case 'top':
            case 'left':
            case 'height':
            case 'width':
                this.setContainerStyles(['geometry'])
                resize.check(this.container)
                return

            case 'label':
                this.setContainerStyles(['label'])
                return

            case 'css':
                this.setContainerStyles(['css'])
                this.onPropChanged('color')
                var re = /width|height|display/
                if (re.test(oldPropValue) || re.test(this.getProp('css'))) {
                    resize.check(this.container)
                }
                return

            case 'color':
                this.setContainerStyles(['color'])
                return

            case 'precision':
            case 'address':
            case 'preArgs':
            case 'target':
            case 'noSync':
                if (propName == 'precision') this.precision = Math.min(20,Math.max(this.getProp('precision', undefined, false),0))
                var data = {},
                    oldData = {
                        preArgs: propName == 'preArgs' ? oldPropValue : this.getProp('preArgs'),
                        address: propName == 'address' ? oldPropValue : this.getProp('address')
                    }
                data[propName] = this.getProp(propName)
                widgetManager.registerWidget(this, data, oldData)
                return

        }

    }

    setContainerStyles(styles = ['geometry', 'label', 'css', 'color']) {

        if (styles.includes('geometry')) {

            // geometry
            for (let d of ['width', 'height', 'top', 'left']) {
                let val = this.getProp(d),
                    geometry

                if (val !== undefined) {
                    if (parseFloat(val) < 0) val = 0
                    geometry = parseFloat(val) == val ? parseFloat(val)+'rem' : val
                }

                if (geometry && geometry != 'auto') {
                    this.container.style[d] = geometry
                    if (d == 'width') this.container.style.minWidth = geometry
                    if (d == 'height') this.container.style.minHeight = geometry
                    if (d == 'top' || d == 'left') this.container.classList.add('absolute-position')
                }
            }

        }

        if (styles.includes('label')) {

            // label
            if (this.getProp('label') === false) {
                this.container.classList.add('nolabel')
            } else {
                var label = this.getProp('label') == 'auto'?
                    this.getProp('id'):
                    iconify(this.getProp('label'))

                this.label.innerHTML = label
            }

        }

        if (styles.includes('css')) {

            // css
            var css = String(this.getProp('css')),
                prefix = '#' + this.hash,
                scopedCss = scopeCss(css, prefix),
                unScopedCss = ''

            try {

                dummyDOM.style = css
                unScopedCss = dummyDOM.getAttribute('style') || ''

            } catch(err) {

                // fallback for browser that don't allow assigning "style" property
                css
                    .replace(/\{[^}]*\}/g, '')
                    .replace(/^[^@#.]*:.*/gm, (m)=>{
                        unScopedCss += m[m.length - 1] === ';' ? m : m + ';'
                    })

            }



            if (scopedCss.indexOf('@keyframes') > -1) scopedCss = scopedCss.replace(new RegExp(prefix + '\\s+([0-9]+%|to|from)', 'g'), ' $1')
            if (scopedCss.indexOf('&') > -1) scopedCss = scopedCss.replace(new RegExp(prefix + '\\s&', 'g'), prefix)

            var style = DOM.create(`<style>${unScopedCss ? prefix + '{' + unScopedCss + '}\n' : ''}${scopedCss}</style>`),
                oldStyle = DOM.get(this.container, '> style')[0]

            if (oldStyle) {
                this.container.replaceChild(style, oldStyle)
            } else if (scopedCss.length || unScopedCss.length){
                this.container.insertBefore(style, this.widget)
            }

        }

        if (styles.includes('color')) {

            // color
            this.container.style.setProperty('--color-custom', this.getProp('color') && this.getProp('color') != 'auto' ? this.getProp('color') : '')

        }


    }

    reCreateWidget(options){

        updateWidget(this, {remote: true, reCreateOptions:options})

    }

    onRemove(){
        widgetManager.off(`widget-created.${this.hash}`)
        widgetManager.off(`prop-changed.${this.hash}`)
        widgetManager.off(`change.${this.hash}`)
        osc.off(new RegExp('.*\\.' + this.hash))
    }

}

Widget.dynamicProps = [
    'top',
    'left',
    'height',
    'width',
    'label',
    'css',
    'value',
    'color',
    'precision',
    'address',
    'preArgs',
    'target',
    'bypass'
]

module.exports = Widget
