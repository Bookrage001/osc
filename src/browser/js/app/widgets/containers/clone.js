var _widgets_base = require('../common/_widgets_base'),
    widgetManager = require('../../managers/widgets'),
    resize = require('../../events/resize'),
    purge = require('../../editor/purge'),
    parser = require('../../parser')

module.exports = class Clone extends _widgets_base {

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

        this.cloneHashes = []
        this.cloneLock = false
        this.cloneClass = ''
        this.createClone()

        widgetManager.on(`widget-created.${this.hash}`, (e)=>{
            var {id, widget} = e
            if (
                (id == this.getProp('widgetId') && this.cloneHashes.indexOf(widget.hash) == -1) &&
                !(widget.parent && widget.parent.getProp('type') == 'clone')
            ) {
                this.createClone(widget)
                resize.check(this.container)
            }
        })

    }

    createClone(widget) {

        if (this.cloneLock) return

        this.cloneLock = true

        this.widget.innerHTML = ''
        if (this.cloneClass) this.container.classList.remove(this.cloneClass)
        purge(this.childrenHashes)

        var widgets = widget ? [widget] : widgetManager.getWidgetById(this.getProp('widgetId'))

        if (widgets.length) {

            for (var i = widgets.length - 1; i>=0; i--) {

                if (!(widgets[i].parent && widgets[i].parent.getProp('type') == 'clone')) {

                    this.cloneClass = widgets[i].container.getAttribute('class').match(/[^\s]*-container/)[0]
                    this.container.classList.add(this.cloneClass)

                    parser.parse([{..._widgets_base.deepCopy(widgets[i].props), ...this.getProp('props')}], this.widget, this)

                    DOM.each(this.widget, '.widget', (el)=>{el.classList.add('not-editable')})

                    widgets[i].once(`widget-created.${this.hash}`, (e)=>{
                        this.createClone(widgets[i])
                        resize.check(this.container)
                    })

                    break

                }

            }

        }


        this.cloneLock = false

    }


}
