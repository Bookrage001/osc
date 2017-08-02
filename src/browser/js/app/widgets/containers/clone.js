var _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers'),
    purge = require('../../editor/purge')

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

        options.props.label = false
        options.props.variables = '@{parent.variables}'

        super({...options, html: '<div class="clone"></div>'})

        this.cloneHash = [0]
        this.cloneLock = false
        this.cloneClass = ''
        this.originalHash = false
        this.createClone()

        $('body').on(`widget-created.${this.hash}`, (e)=>{
            var {id, hash} = e
            if ((id == this.getProp('widgetId') && this.cloneHash.indexOf(hash) == -1) ||
                (widgetManager.widgets[this.originalHash] && widgetManager.widgets[this.originalHash].hashes && widgetManager.widgets[this.originalHash].hashes.indexOf(hash) != -1)
            ) {
                this.createClone()
            }
        })

    }

    createClone() {

        if (this.cloneLock) return

        this.cloneLock = true

        var parsewidgets = require('../../parser').widgets

        this.widget.empty()
        this.container.removeClass(this.cloneClass)
        purge(this.cloneHash)

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))

        if (widgets.length) {

            for (var i in widgets) {

                if (this.cloneHash.indexOf(widgets[i].hash) == -1) {

                    this.originalHash = widgets[i].hash
                    this.cloneClass = widgets[i].container.attr('class').match(/[^\s]*-container/)[0]
                    this.container.addClass(this.cloneClass)

                    var c = parsewidgets([{..._widgets_base.deepCopy(widgets[i].props), ...this.getProp('props')}], this.widget, this)

                    this.widget.find('.widget').addClass('not-editable')

                    this.hashes = [this.hash]
                    if (c[0].abstract.hashes) {
                        this.hashes = this.hashes.concat(c[0].abstract.hashes)
                        this.cloneHash = c[0].abstract.hashes
                    } else {
                        this.hashes.push(c[0].abstract.hash)
                        this.cloneHash = [c[0].abstract.hash]
                    }

                    break

                }

            }

        }

        this.cloneLock = false

    }


}
