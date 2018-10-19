var Container = require('../common/container'),
    widgetManager = require('../../managers/widgets'),
    resize = require('../../events/resize'),
    parser = require('../../parser'),
    {deepCopy, deepEqual} = require('../../utils'),
    diff = require('jsondiffpatch')

var excludedCloneClasses =  ['widget', 'absolute-position', 'ui-resizable', 'ui-draggable', 'not-editable']

class Clone extends Container {

    static defaults() {

        return super.defaults({

            _clone:'clone',

            widgetId: {type: 'string', value: '', help: '`id` of the widget to clone'},

            _overrides:'overrides',

            props: {type: 'object', value: {}, help: 'Cloned widget\'s properties to override'},

        }, ['label', 'color', 'linkId', '_value', 'default', 'value', '_osc', 'precision', 'address', 'preArgs', 'target', 'bypass'])

    }

    constructor(options) {

        options.props.label = ''
        options.props.variables = '@{parent.variables}'

        super({...options, html: '<div class="clone"></div>'})

        this.cloneLock = false
        this.cloneTarget = null
        this.cloneClass = []

        this.container.classList.add('empty')

        this.bindTarget(this.getCloneTarget())
        if (this.cloneTarget) this.createClone(true)

        // global listenner to catch cloneTarget's creation if no target is locked
        widgetManager.on('widget-created', (e)=>{

            var {id, widget} = e

            if (id === this.getProp('widgetId') && this.isValidCloneTarget(widget)) {

                var clone = this.children[0]

                this.unbindTarget()

                if (!clone) {

                    this.updateContainer(false)
                    this.bindTarget(widget)
                    this.createClone()

                } else {

                    this.bindTarget(widget)
                    this.updateClone()

                }

            }

        }, {context: this})

        widgetManager.on('prop-changed', (e)=>{

            if (!this.cloneTarget) return

            if (e.widget === this.cloneTarget || this.cloneTarget.contains(e.widget)) {

                this.updateClone()

            }

        }, {context: this})

    }

    getCloneTarget() {

        // attempt to acquire a cloneTarget if 'widget-created' event has not been catched
        // (the target might have been created before the clone itself)

        const widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
                                   .filter(el=>this.isValidCloneTarget(el))

        if (widgets.length === 0) return null
        if (widgets.length === 1) {
            return widgets[0]
         }

        // when duplicating clones pointing to an object with a static id,
        // each clone will recreate an object with the same id internally
        // we try to get the original one if there is more than 2 clone pointing to the same id (avoiding cloning the clone)

        function isCreatedByAClone(wi){
            const parent = wi.parent
            return parent && parent.getProp('type') === 'clone'
        }

        var target = widgets[0]
        for (const w of widgets) {
            if (!isCreatedByAClone(w)) {
                target = w
                break
            }
        }

        // we may want to remove this warning
        // if (isCreatedByAClone(this.cloneTarget)) {
        //     console.warn('no deduped clone found : ',this.getProp('widgetId'))
        // }

        return target

    }

    isValidCloneTarget(widget) {

        return !(widget.contains(this) || this.contains(widget))

    }

    createClone(init) {

        if (this.cloneLock) return

        this.cloneLock = true

        var data = {...deepCopy(this.cloneTarget.props), ...this.getProp('props')},
            clone = parser.parse({
                data: data,
                parentNode: this.widget,
                parent: this
            })

        this.updateContainer(!init)

        this.cloneLock = false

    }

    unbindTarget() {

        if (!this.cloneTarget) return

        this.cloneTarget.removeEventContext(this)

        this.cloneTarget = null

    }

    bindTarget(target) {

        if (!target) return

        this.cloneTarget = target

        // listen for cloneTarget's deletion
        // if it is just edited, its recreation will be catched by the global 'widget-created' event handler
        this.cloneTarget.on('widget-removed', (e)=>{
            if (this.cloneTarget === e.widget) {
                this.unbindTarget()
            }
        }, {context: this})

        // listen for cloneTarget's content updates
        this.cloneTarget.on('widget-created', (e)=>{

            var {widget} = e,
                parent = widget.parent

            while (parent !== this.cloneTarget && parent !== widgetManager) {
                // if updated widget is in a nested clone, ignore it:
                // it will be handled by the nested clone that targets it
                if (parent.getProp('type') === 'clone') return
                parent = parent.parent
            }

            this.updateClone()

        }, {context: this})

    }

    updateClone() {

        if (this.cloneLock) return

        this.cloneLock = true

        var data = {...deepCopy(this.cloneTarget.props), ...this.getProp('props')},
            clone = this.children[0],
            childrenChanged = false

        var delta = diff.diff(clone.props, data) || {},
            changedProps = Object.keys(delta)

        clone.props = data

        if (changedProps.some(x => !clone.constructor.dynamicProps.includes(x))) {

            clone.reCreateWidget({reuseChildren: false})
            this.updateContainer(false)

        } else {

            clone.updateProps(changedProps, this)
            this.updateContainer(true)

        }


        this.cloneLock = false

    }

    updateContainer(checkResize) {


        if (this.cloneTarget) {

            var classes = [...this.cloneTarget.container.classList].filter(i=>excludedCloneClasses.indexOf(i) === -1)

            if (!deepEqual(classes, this.cloneClass)) {
                this.container.classList.remove(...this.cloneClass)
                this.cloneClass = classes
                this.container.classList.add(...this.cloneClass)
            }

            this.container.classList.remove('empty')

            for (var w of this.getAllChildren()) {
                w.container.classList.add('not-editable')
            }

            if (checkResize) resize.check(this.widget)

        } else if (this.cloneClass.length) {

            this.container.classList.remove(...this.cloneClass)
            this.container.classList.add('empty')
            this.cloneClass = []
            this.widget.innerHTML = ''
            widgetManager.removeWidgets(this.getAllChildren())

        }

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'widgetId':
                this.unbindTarget()
                this.updateContainer(false)
                this.bindTarget(this.getCloneTarget())
                if (this.cloneTarget) this.createClone()
                return

        }

    }

    onRemove(){

        this.unbindTarget()
        super.onRemove()

    }

}

Clone.dynamicProps = Clone.prototype.constructor.dynamicProps.concat(
    'widgetId'
)

module.exports = Clone
