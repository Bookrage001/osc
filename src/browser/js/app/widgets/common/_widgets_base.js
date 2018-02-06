var EventEmitter = require('../../events/event-emitter'),
    osc = require('../../osc'),
    shortid = require('shortid'),
    widgetManager = require('../../managers/widgets'),
    {math} = require('../utils'),
    updateWidget = function(){ updateWidget = require('../../editor/data-workers').updateWidget; updateWidget(...arguments)}


var fallbackContainer

DOM.ready(()=>{
    fallbackContainer = DOM.create('<div></div>')
})

module.exports = class _widgets_base extends EventEmitter {

    static defaults() {

        throw new Error('Calling unimplemented static defaults() method')

    }

    constructor(options={}) {

        super()

        this.container = options.container || fallbackContainer
        this.widget = DOM.create(options.html)
        this.props = options.props
        this.dynamicProps = ['value', 'color', 'precision', 'address', 'preArgs', 'target', 'noSync']
        this.parent = options.root ? widgetManager : options.parent
        this.parentNode = options.parentNode
        this.hash = shortid.generate()
        this.childrenHashes = []

        if (options.container) {
            this.container.setAttribute('data-widget', this.hash)
            this.container._widget_instance = this
        }

        // Turn preArgs into array
        if (this.props.preArgs !== undefined && !Array.isArray(this.resolveProp('preArgs', undefined, false))) {
            this.props.preArgs = [this.props.preArgs]
        }

        // Turn preArgs into array
        if (this.props.target !== undefined && !Array.isArray(this.resolveProp('target', undefined, false))) {
            this.props.target = [this.props.target]
        }

        // strip parent ? no position
        if (this.parent && this.parent.props && this.parent.props.type == 'strip') {
            delete this.props.top
            delete this.props.left
            delete this.props[this.parent.getProp('horizontal') ? 'height' : 'width']
        }


        // @{props} links lists
        this.linkedProps = {}
        this.linkedPropsValue = {}

        // cache props (resolve @{props})
        this.cachedProps = {}

        for (var k in this.props) {
            if (k != 'widgets' && k != 'tabs') {
                this.cachedProps[k] = this.resolveProp(k, undefined, true)
            } else {
                this.cachedProps[k] = this.props[k]
            }
        }

        if (Object.keys(this.linkedProps).length) {

            widgetManager.on(`widget-created.${this.hash}`, (e)=>{
                var {id, widget} = e
                if (widget == this) id = 'this'
                if (widget == this.parent) id = 'parent'
                if (this.linkedProps[id]) {
                    this.updateProps(this.linkedProps[id], widget)
                }
            })

            widgetManager.on(`prop-changed.${this.hash}`, (e)=>{
                let {id, widget, prop, options} = e
                if (widget == this) id = 'this'
                if (widget == this.parent) id = 'parent'
                if (this.linkedProps[id]) {
                    this.updateProps(this.linkedProps[id], widget, options)
                }
            })

        }

        if (Object.keys(this.linkedPropsValue).length) {

            widgetManager.on(`change.${this.hash}`, (e)=>{
                var {id, widget, options} = e
                if (widget == this) id = 'this'
                if (widget == this.parent) id = 'parent'
                if (this.linkedPropsValue[id]) {
                    this.updateProps(this.linkedPropsValue[id], widget, options, true)
                }
            })

        }

        // cache precision
        if (this.props.precision != undefined) {
            this.precision = Math.min(20,Math.max(this.getProp('precision', undefined, false),0))
        }

        if (this.getProp('id') == 'root' && !options.root) throw new Error('There can only be one root')

        this.on('widget-created', (e)=>{

            if (e.widget == this) return

            this.childrenHashes.push(e.widget.hash)

        })

    }

    created() {

        this.trigger(/^widget-created(\..*)?/, [{
            id: this.getProp('id'),
            widget: this
        }])

    }

    changed(options) {

        this.trigger(/^change(\..*)?/, [{
            widget: this,
            options: options,
            id: this.getProp('id'),
            linkId: this.getProp('linkId')
        }])

    }

    sendValue(overrides) {

        var data = {
            h:this.hash,
            v:this.value
        }

        if (overrides) {
            for (var k in overrides) {
                data[k] = overrides[k]
            }
        }

        osc.send(data)

    }

    setValue() {}

    getValue(withPrecision) {

        return _widgets_base.deepCopy(this.value, withPrecision ? this.precision : undefined)

    }

    static deepCopy(obj, precision){

        var copy = obj,
            key

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (let key in obj) {
                copy[key] = _widgets_base.deepCopy(obj[key], precision)
            }
        } else if (typeof obj == 'number') {
            return precision === undefined ? copy : parseFloat(copy.toFixed(precision))
        }

        return copy

    }

    resolveProp(propName, propValue, storeLinks=true, originalWidget, originalPropName) {

        var propValue = propValue !== undefined ? propValue : _widgets_base.deepCopy(this.props[propName]),
            originalWidget = originalWidget || this,
            originalPropName = originalPropName || propName,
            obj

        if (typeof propValue == 'string') {
            propValue = propValue.replace(/@\{([^\}]+)\}/g, (m)=>{
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
                    k = '_value'

                }


                var widgets = id == 'parent' && this.parent ?
                    [this.parent] : id == 'this' ? [this] :
                        widgetManager.getWidgetById(id)

                if (!widgets.length) {
                    var parent = this.parent
                    while (parent && parent != widgetManager) {
                        if (parent.getProp('id') == id) {
                            widgets.push(parent)
                            storeLinks = false
                            break
                        }
                        parent = parent.parent
                    }
                }

                if (storeLinks) {

                    if (k == '_value') {

                        if (!this.linkedPropsValue[id]) this.linkedPropsValue[id] = []
                        if (this.linkedPropsValue[id].indexOf(propName) == -1) this.linkedPropsValue[id].push(propName)

                    } else {

                        if (!this.linkedProps[id]) this.linkedProps[id] = []
                        if (this.linkedProps[id].indexOf(propName) == -1) this.linkedProps[id].push(propName)

                    }

                }

                for (var i in widgets) {

                    if (widgets[i].props.hasOwnProperty(k) || k == '_value') {

                        if (originalPropName == k && widgets[i].props.id == originalWidget.props.id) {
                            throw `Circular property reference for ${originalWidget.props.id}.${originalPropName}`
                        }

                        var r = k == '_value' ?
                                widgets[i].getValue(true) :
                                widgets[i].resolveProp(k, undefined, storeLinks, originalWidget, originalPropName)

                        if (subk !== undefined) r = r[subk]
                        if (typeof r != 'string') r = JSON.stringify(r)

                        return r

                    }

                }

            })

            try {
                propValue = propValue.replace(/#\{([^\}]+)\}/g, (m)=>{
                    let expression = m.substr(2, m.length - 3).trim(),
                        r = math.eval(expression)

                    return typeof r != 'string' ? JSON.stringify(r) : r
                })
            } catch (err) {}

            try {
                propValue = JSON.parse(propValue)
            } catch (err) {}

        } else if (propValue != null && typeof propValue == 'object') {
            for (var k in propValue) {
                propValue[k] = this.resolveProp(propName, propValue[k], storeLinks, originalWidget, originalPropName)
            }
        }

        return propValue


    }

    getProp(propName) {
        return this.cachedProps[propName]
    }

    updateProps(propNames, widget, options, _value) {

        if (propNames.indexOf('value') > 0) {
            propNames.splice(propNames.indexOf('value'), 1)
            propNames.unshift('value')
        }

        var reCreate = false,
            changedProps = []

        for (var propName of propNames) {

            let propValue = this.resolveProp(propName, undefined, false)

            if (JSON.stringify(this.getProp(propName)) !== JSON.stringify(propValue)) {

                this.cachedProps[propName] = propValue

                if (this.onPropChanged(propName, options)) {

                    reCreate = true

                } else {

                    changedProps.push(propName)

                }


            }
        }
        if (reCreate && this.childrenHashes.indexOf(widget.hash) == -1 && !(_value && widget == this)) {

            this.reCreateWidget()

        } else if (changedProps.length) {

            widgetManager.trigger(/^prop-changed(\..*)?/, [{
                id: this.getProp('id'),
                props: changedProps,
                widget: this,
                options: options
            }])

        }

    }

    onPropChanged(propName, options) {

        switch(propName) {

            case 'value':
                this.setValue(this.getProp('value'), {sync: true, send: options && options.send})
                return

            case 'color':
                this.container.style.setProperty('--color-custom', this.getProp('color') != 'auto' ? this.getProp('color') : 'initial')
                return

            case 'precision':
            case 'address':
            case 'preArgs':
            case 'target':
            case 'noSync':
                if (propName == 'precision') this.precision = Math.min(20,Math.max(this.getProp('precision', undefined, false),0))
                var data = {}
                data[propName] = this.getProp(propName)
                widgetManager.registerWidget(this, data)
                return

        }

        return this.dynamicProps.indexOf(propName) == -1


    }

    reCreateWidget(){

        updateWidget(this, {remote: true})

    }

    onRemove(){
        widgetManager.off(`widget-created.${this.hash}`)
        widgetManager.off(`prop-changed.${this.hash}`)
        widgetManager.off(`change.${this.hash}`)
    }

}
