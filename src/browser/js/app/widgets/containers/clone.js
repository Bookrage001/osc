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

        // we need to listen globally if some kind of widgets gets created with the right id
        widgetManager.on(`widget-created.${this.hash}`, (e)=>{
            var {id, widget} = e
            if(this.cloneTarget !== null || !this.isValidCloneTarget(widget))return
            //console.log('cb',id,",",this.getProp('id'))
            // we could put getParentWithId inside widget class
            function getParentWithId(ob,tid,includeThis){
                let parent = includeThis?ob:ob.parent
                while(parent && parent.getProp && parent.parent !== widgetManager){
                    if(parent.getProp('id')===tid){return parent}
                    parent = parent.parent
                }
            }
            // if some Child is created inside a container with the widgetId, we surely need to create the clone
            const potentialTarget = id===this.getProp('widgetId')?widget:getParentWithId(widget,this.getProp('widgetId'))
            if (potentialTarget) {
                this.cloneTarget = potentialTarget
                this.createClone()
                resize.check(this.container)
            }
        })
    }

    getCloneTarget() {

        const widgets = widgetManager.getWidgetById(this.getProp('widgetId'))
                                   .filter(el=>this.isValidCloneTarget(el))
        if(widgets.length===0){return}
        if(widgets.length==1){
            this.cloneTarget = widgets[0];
            return;
         }

        // when duplicating clones pointing to an object with a static id,
        // each clone will recreate an object with the same id internally
        // we try to get the original one if there is more than 2 clone pointing to the same id (avoiding cloning the clone)
        
        function isCreatedByAClone(wi){
            const parent = wi.parent;
            return parent && parent.cachedProps.type==="clone"
        }
        this.cloneTarget = widgets[0]
        for (const w of widgets) {
            if(!isCreatedByAClone(w) ){
                this.cloneTarget = w
                break;
            }
        }
        
        // we may want to remove this warning
        if(isCreatedByAClone(this.cloneTarget)){
            console.warn('no deduped clone found : ',this.getProp('widgetId'))
        }
    }

    isValidCloneTarget(widget) {

        return !(widget.contains(this) || this.contains(widget))

    }

    cleanClone() {

        if (!this.childrenHashes.length) return
        //console.log('clear clone',this.getProp('id'))
        widgetManager.removeWidgets(this.childrenHashes)
        this.widget.innerHTML = ''
        this.childrenHashes = []
        this.container.classList.remove(...this.cloneClass)
        this.container.classList.add('clone-container', 'empty')
        this.cloneClass = []
        if (this.cloneTarget) widgetManager.off(`widget-removed.${this.hash}`)

    }

    createClone() {

        if (this.cloneLock) {
            //console.warn('clone locked',this.id)
            return
        }
        //console.log('create clone',this.getProp('id'))
        this.cloneLock = true

        this.cleanClone()

        this.cloneClass = [...this.cloneTarget.container.classList].filter(i=>excludedCloneClasses.indexOf(i) === -1)
        this.container.classList.remove('empty')
        this.container.classList.add(...this.cloneClass)
        let clonedProps = deepCopy(this.cloneTarget.props)
        function resetAutoIds(ob){
            if(ob.widgets)
                for (const o of ob.widgets){resetAutoIds(o)}
            if( ob.id && ob.id.startsWith(ob.type+'_')){
                ob.id = "auto"
            }
        }
        resetAutoIds(clonedProps)
        var clone = parser.parse([{...clonedProps, ...this.getProp('props')}], this.widget, this)

        if (clone.getProp('id') === this.cloneTarget.getProp('id')) {
            widgetManager.trigger('change.*', [{
                widget: this.cloneTarget,
                id: this.cloneTarget.getProp('id'),
                linkId: this.cloneTarget.getProp('linkId'),
                options: {}
            }])
        }


        DOM.each(this.widget, '.widget', (el)=>{el.classList.add('not-editable')})

        // will react to any widget deletion
        // widget-removed are only triggered from the manager from now
        // TODO : we could avoid useless callbacks if widgets were to trigger widget-removed events
        widgetManager.on(`widget-removed.${this.hash}`, (e)=>{
            var { widget} = e
            // a clone should not react on its target's nested clones widgets
            // this mechanism is handled by the inner clones
            function containsNonCloned(self,wi){
                let insp = wi.parent;
                while(insp && insp.parent!==widgetManager){
                    if(insp===self){return true}
                    if(insp.cachedProps.type==="clone"){return false}
                    insp = insp.parent
                }
                return false
            }
            if(this.cloneTarget && containsNonCloned(this.cloneTarget,widget)){
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
        this.cleanClone();
        this.cloneTarget = null;
        widgetManager.off(`widget-removed.${this.hash}`)
        super.onRemove()

    }

}

Clone.dynamicProps = Clone.prototype.constructor.dynamicProps.concat(
    'widgetId'
)

module.exports = Clone
