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

            _children:'children',

            variables:'@{parent.variables}',
        }

    }

    constructor(options) {

        options.props.label = false

        super({...options, html: '<div class="clone"></div>'})

        this.cloneHash = [0]
        this.cloneLock = false
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
        purge(this.cloneHash)

        var widgets = widgetManager.getWidgetById(this.getProp('widgetId'))

        if (widgets.length) {

            for (var i in widgets) {

                if (this.cloneHash.indexOf(widgets[i].hash) == -1) {

                    this.originalHash = widgets[i].hash

                    var c = parsewidgets([_widgets_base.deepCopy(widgets[i].props)], this.widget, this)

                    this.widget.find('.widget').addClass('not-editable')
                    this.container[0].style.setProperty('--color-border', getComputedStyle(c[0]).getPropertyValue('--color-border'))

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
