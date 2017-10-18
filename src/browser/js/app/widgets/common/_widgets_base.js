var osc = require('../../osc'),
    shortid = require('shortid'),
    widgetManager = require('../../managers/widgets'),
    updateDom = function(){ updateDom = require('../../editor/data-workers').updateDom; updateDom(...arguments)}


module.exports = class _widgets_base {

    static defaults() {

        throw 'Calling unimplemented static defaults() method'

    }

    static createHash() {

        return shortid.generate()
    }

    constructor(options={}) {

        this.container = options.container
        this.widget = $(options.html)
        this.props = options.props
        this.parent = options.parent
        this.parentNode = options.parentNode
        this.hash = _widgets_base.createHash()

        // Turn preArgs into array
        if (this.props.preArgs !== undefined && !Array.isArray(this.resolveProp('preArgs', undefined, false))) {
            this.props.preArgs = [this.props.preArgs]
        }

        // Turn preArgs into array
        if (this.props.target !== undefined && !Array.isArray(this.resolveProp('target', undefined, false))) {
            this.props.target = [this.props.target]
        }

        // strip parent ? no position
        if (this.parent && this.parent.props.type == 'strip') {
            delete this.props.top
            delete this.props.left
            delete this.props[this.parent.getProp('horizontal') ? 'height' : 'width']
        }


        // @{props} links lists
        this.linkedPropsWidgets = []
        this.linkedProps = []


        // cache props (resolve @{props})
        this.cachedProps = {}

        for (var k in this.props) {
            if (k != 'widgets' && k != 'tabs') {
                this.cachedProps[k] = this.resolveProp(k, undefined, true)
            } else {
                this.cachedProps[k] = this.props[k]
            }
        }

        $('body').on(`widget-created.${this.hash}`, (e)=>{
            var {id} = e
            if (this.linkedPropsWidgets.indexOf(id) != -1 && id != this.getProp('id')) {
                this.checkPropsChanged()
            }
        })

        $('body').trigger({type: 'widget-created', id: this.getProp('id'), widget:this})

        // cache precision
        if (this.props.precision != undefined) {
            this.precision = Math.min(20,Math.max(this.getProp('precision', undefined, false),0))
        }

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

    getValue() {

        return _widgets_base.deepCopy(this.value)

    }

    static deepCopy(obj){

        var copy = obj,
            key

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (let key in obj) {
                copy[key] = _widgets_base.deepCopy(obj[key])
            }
        }

        return copy

    }

    resolveProp(key, opt, storeLinks=true, originalWidget, originalKey) {

        var opt = opt !== undefined ? opt : _widgets_base.deepCopy(this.props[key]),
            originalWidget = originalWidget || this,
            originalKey = originalKey || key,
            obj

        if (typeof opt == 'string' && opt.indexOf('@{') != -1) {
            opt = opt.replace(/@\{([^\}]+)\}/g, (m)=>{
                let id = m.substr(2, m.length - 3).split('.'),
                    k = id.pop(),
                    subk = undefined

                if (id.length > 1) {
                    subk = k
                    k = id.pop()
                }

                id = id.join('.')

                var widgets = id == 'parent' && this.parent ?
                    [this.parent] : id == 'this' ? [this] :
                        widgetManager.getWidgetById(id)


                for (var i in widgets) {
                    if (widgets[i].props.hasOwnProperty(k)) {

                        if (originalKey == k && widgets[i].props.id == originalWidget.props.id) {
                            throw `Circular property reference for ${originalWidget.props.id}.${originalKey}`
                        }

                        if (id != 'this' && id != 'parent' && storeLinks) {
                            this.linkedProps.push(key)
                            this.linkedPropsWidgets.push(id)
                        }

                        var r = widgets[i].resolveProp(k, undefined, storeLinks, originalWidget, originalKey)
                        if (subk !== undefined) r = r[subk]
                        if (typeof r != 'string') r = JSON.stringify(r)
                        return r

                    }
                }
            })

            try {
                opt = JSON.parse(opt)
            } catch (err) {}

        } else if (opt != null && typeof opt == 'object') {
            for (var k in opt) {
                opt[k] = this.resolveProp(key, opt[k], storeLinks, originalWidget, originalKey)
            }
        }

        return opt


    }

    getProp(key){
        return this.cachedProps[key]
    }

    checkPropsChanged(){
        for (var key of this.linkedProps) {
            if (JSON.stringify(this.cachedProps[key]) != JSON.stringify(this.resolveProp(key, undefined, false))) {
                return this.reCreateWidget()
            }
        }
    }

    reCreateWidget(){
        updateDom(this.container, this.props, true)
    }

    onRemove(){
        $('body').off(`widget-created.${this.hash}`)
    }

}
