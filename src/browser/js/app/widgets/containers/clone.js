var Widget = require('../common/widget'),
    widgetManager = require('../../managers/widgets'),
    resize = require('../../events/resize'),
    parser = require('../../parser'),
    {deepCopy} = require('../../utils')

var excludedCloneClasses =  ['widget', 'absolute-position', 'ui-resizable', 'ui-draggable', 'not-editable']

class Clone extends Widget {

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

        this.getCloneTarget()
        if (this.cloneTarget) this.createClone()

        widgetManager.on(`widget-created.${this.hash}`, (e)=>{
            var {id, widget, reCreate} = e
            function hasParentId(ob,tid){
                let parent = ob
                while(parent && parent.getProp && parent.parent !== widgetManager){
                    if( parent.getProp('id')===tid){return parent}
                    parent = parent.parent
                }
            }
            const potentialTarget = hasParentId(widget,this.getProp('widgetId'))
            if (
                this.cloneTarget === null &&
                ! this.contains(widget) && 
                potentialTarget
            ) {
                this.cloneTarget = potentialTarget
                this.createClone()
                resize.check(this.container)
            }
        })
    }

    getCloneTarget() {

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
        if(widgets.length==1){
            this.cloneTarget = widgets[0];
             return;
         }

        // when duplicating clones pointing to an object with a static id,
        // each clone will recreate an object with the same id
        // we try to get the original one if there is more than 2
        let foundDedupedClone = null;
        function isInsideClone(wi){
            let parent = wi.parent;
            return parent && parent.cachedProps.type==="clone"
        }
        for (var i in widgets) {
            if (this.isValidCloneTarget(widgets[i])) {
                this.cloneTarget = widgets[i]
                if(!isInsideClone(widgets[i]) ){
                    foundDedupedClone = widgets[i]
                    break;
                }
            }
        }
        this.cloneTarget = foundDedupedClone || this.cloneTarget
        if(this.cloneTarget && !foundDedupedClone ){
            console.warn('no deduped clone found : ',this.getProp('widgetId'))
        }
    }

    isValidCloneTarget(widget) {

        return !(widget.contains(this) || this.contains(widget))

    }

    cleanClone() {

        if (!this.childrenHashes.length) return

        widgetManager.removeWidgets(this.childrenHashes)
        this.widget.innerHTML = ''
        this.childrenHashes = []
        this.container.classList.remove(...this.cloneClass)
        this.container.classList.add('clone-container', 'empty')
        this.cloneClass = []
        if (this.cloneTarget) widgetManager.off(`widget-removed.${this.hash}`)

    }

    createClone() {

        if (this.cloneLock) return
        this.cloneLock = true

        this.cleanClone()

        this.cloneClass = [...this.cloneTarget.container.classList].filter(i=>excludedCloneClasses.indexOf(i) === -1)
        this.container.classList.remove('empty')
        this.container.classList.add(...this.cloneClass)
        const propsCopy = deepCopy(this.cloneTarget.props)
        var clone = parser.parse([{...propsCopy, ...this.getProp('props')}], this.widget, this,null,null,true)

        if (clone.getProp('id') === this.cloneTarget.getProp('id')) {
            widgetManager.trigger('change.*', [{
                widget: this.cloneTarget,
                id: this.cloneTarget.getProp('id'),
                linkId: this.cloneTarget.getProp('linkId'),
                options: {}
            }])
        }


        DOM.each(this.widget, '.widget', (el)=>{el.classList.add('not-editable')})

        // will react to any of childs deletion
        widgetManager.on(`widget-removed.${this.hash}`, (e)=>{
            var { widget} = e
            if(this.cloneTarget && this.cloneTarget.contains(widget)){
            this.cleanClone()
            this.cloneTarget = null
        }
        })

        this.cloneLock = false

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'widgetId':
                this.cleanClone()
                this.cloneTarget = null
                this.getCloneTarget()
                if (this.cloneTarget) this.createClone()
                return

        }

    }

    onRemove(){

        if (this.cloneTarget) this.cloneTarget.off(`widget-created.${this.hash}`)
        widgetManager.off(`widget-removed.${this.hash}`)
        super.onRemove()

    }

}

Clone.dynamicProps = Clone.prototype.constructor.dynamicProps.concat(
    'widgetId'
)

module.exports = Clone
