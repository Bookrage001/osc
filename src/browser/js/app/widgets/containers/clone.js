var Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets'),
    resize = require('../../events/resize'),
    parser = require('../../parser')

module.exports = class Clone extends Widget {

    static defaults() {

        return {
            type:'clone',
            id:'auto',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            css:'',

            _clone:'clone',

            widgetId:'',

            _overrides:'overrides',

            props:{},
        }

    }

    constructor(options) {

        options.props.label = ''
        options.props.variables = '@{parent.variables}'

        super({...options, html: '<div class="clone"></div>'})

        this.cloneLock = false
        this.cloneTarget = null
        this.cloneClass = []

        this.container.classList.add('empty')
        
        this.getCloneTarget()
        if (this.cloneTarget) this.createClone()

        widgetManager.on(`widget-created.${this.hash}`, (e)=>{
            var {id, widget} = e
            if (
                this.cloneTarget === null &&
                id === this.getProp('widgetId') &&
                this.isValidCloneTarget(widget)
            ) {
                this.cloneTarget = widget
                this.createClone()
                resize.check(this.container)
            }
        })

        widgetManager.on(`widget-removed.${this.hash}`, (e)=>{
            if (this.cloneTarget === e.widget) {
                this.cloneTarget = null
                this.cleanClone()
            }
        })

    }

    getCloneTarget() {

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
        for (var i in widgets) {
            if (
                this.isValidCloneTarget(widgets[i])
            ) {

                this.cloneTarget = widgets[i]
                break
            }
        }

    }

    isValidCloneTarget(widget) {

        if (widget.contains(this) || this.contains(widget)) return false

        var parent = widget.parent
        while (parent && parent !== widgetManager) {
            if (parent.getProp('type') === 'clone') return false
            parent = parent.parent
        }

        return true
    }

    cleanClone() {

        if (!this.childrenHashes.length) return

        widgetManager.removeWidgets(this.childrenHashes)
        this.widget.innerHTML = ''
        this.childrenHashes = []
        this.container.classList.remove(...this.cloneClass)
        this.container.classList.add('clone-container', 'empty')
        this.cloneClass = []

    }

    createClone() {

        if (this.cloneLock) return
        this.cloneLock = true

        this.cleanClone()

        this.cloneClass = this.cloneTarget.container.classList
        this.container.classList.remove('empty')
        this.container.classList.add(...this.cloneClass)

        parser.parse([{...Widget.deepCopy(this.cloneTarget.props), ...this.getProp('props')}], this.widget, this)

        DOM.each(this.widget, '.widget', (el)=>{el.classList.add('not-editable')})

        this.cloneTarget.once(`widget-created.${this.hash}`, (e)=>{
            this.createClone(this.cloneTarget)
            resize.check(this.container)
        })

        this.cloneLock = false

    }

    onRemove(){

        if (this.cloneTarget) this.cloneTarget.off(`widget-created.${this.hash}`)
        widgetManager.off(`widget-removed.${this.hash}`)
        super.onRemove()

    }

}
