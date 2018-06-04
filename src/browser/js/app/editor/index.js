var {widgets} = require('../widgets/'),
    editField = require('./edit-field'),
    {updateWidget} = require('./data-workers')

var Editor = class Editor {

    constructor() {

        this.wrapper = DOM.create(`
            <div class="editor-container">
                <div class="form" id="editor-form">
                </div>
            </div>
        `)
        this.form = DOM.get(this.wrapper, '#editor-form')[0]

        this.defaults = {}
        for (var k in widgets) {
            this.defaults[k] = widgets[k].defaults()
        }

        this.selectedWidgets = []

        this.clipboard = null
        this.idClipboard = null

        this.enabled = false
        this.enabledOnce = false
        window.onbeforeunload = ()=>{
            if (this.enabledOnce) return true
        }

    }

    enable() {

        EDITING = true
        this.enabled = true

        this.enabledOnce = true

        DOM.get('.editor-root')[0].setAttribute('data-widget', DOM.get('.root-container')[0].getAttribute('data-widget'))
        DOM.get('.editor-root')[0].classList.remove('disabled')
        DOM.get('.disable-editor')[0].classList.remove('on')
        DOM.get('.enable-editor')[0].classList.add('on')
        document.body.classList.add('editor-enabled')
        document.body.classList.toggle('no-grid', GRIDWIDTH == 1)


        GRIDWIDTH = getComputedStyle(document.documentElement).getPropertyValue('--grid-width')

        var gridForm = DOM.create(`
            <div class="form" id="grid-width-form">
                <div class="separator"><span>Grid</span></div>
                <div class="input-wrapper">
                    <label>Width</label>
                    <input class="input" type="number" id="grid-width-input" step="1" min="1" max="100" value="${GRIDWIDTH}"/>
                </div>
            </div>
        `)

        DOM.each(gridForm, '#grid-width-input', (input)=>{
            DOM.addEventListener(input, 'keyup mouseup change mousewheel', (e)=>{
                setTimeout(()=>{
                    var v = Math.max(Math.min(parseInt(input.value), 100), 1)
                    if (isNaN(v)) return
                    input.value = v
                    GRIDWIDTH = v
                    document.body.classList.toggle('no-grid', GRIDWIDTH == 1)
                    document.documentElement.style.setProperty('--grid-width', GRIDWIDTH)
                })
            })
        })

        DOM.get(document, '.editor-menu')[0].appendChild(gridForm)

    }

    disable() {

        EDITING = false
        this.enabled = false

        if (READ_ONLY) {
            this.enable = ()=>{}
            $('.editor-menu .btn').remove()
            $('.editor-menu .title').html($('.editor-menu .title').html() + ' (disabled)').addClass('disabled')
            return
        }

        this.unselect()
        this.selectedWidgets = []
        DOM.get('.editor-root')[0].classList.add('disabled')
        DOM.get('.disable-editor')[0].classList.add('on')
        DOM.get('.enable-editor')[0].classList.remove('on')
        document.body.classList.remove('editor-enabled')

        var gridForm = DOM.get('#grid-width-form')[0]
        if (gridForm) gridForm.parentNode.removeChild(gridForm)

    }

    unselect() {

        DOM.get('#editor')[0].innerHTML = ''

        this.form.innerHTML = ''

        DOM.each(document, '.editing', (element)=>{
            element.classList.remove('editing')
        })

        $('.widget.ui-resizable').resizable('destroy')
        $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()

    }

    select(widget, options={}){

        this.unselect()

        if (Array.isArray(widget)) {

            this.selectedWidgets = widget

        } else if (options.multi) {

            if (!this.selectedWidgets.includes(widget)) {

                var sameLevel = true
                for (var w of this.selectedWidgets) {
                    if (w.parent !== widget.parent) sameLevel = false
                }


                if (sameLevel) this.selectedWidgets.push(widget)

            } else {

                this.selectedWidgets.splice(this.selectedWidgets.indexOf(widget), 1)

            }

        } else {

            if (!options.refresh && (widget.container.classList.contains('editing'))) return

            this.selectedWidgets = [widget]


        }

        if (this.selectedWidgets.length > 0) {

            this.createEditForm()
            this.createSelectionBlock()

        }

    }


    createEditForm(){

        var widget = this.selectedWidgets[0],
            props = this.defaults[widget.props.type]

        this.form.appendChild(DOM.create(`
            <div class="separator">
                ${this.selectedWidgets.length > 1 ?
        '<span class="accent">Multiple Widgets</span>' :
        '<span>Widget</span>'
}
            </div>
        `))

        for (let propName in props) {

            let field,
                shared = true

            for (var w of this.selectedWidgets) {
                if (this.defaults[w.props.type][propName] === undefined) {
                    shared = false
                }
            }

            if (!shared) continue

            if (propName.indexOf('_') == 0) {

                field = DOM.create(`<div class="separator"><span>${props[propName]}</span></div>`)

            } else if (widget.props[propName] === undefined) {

                continue

            } else {

                field = editField(this, widget, propName, props[propName])
                if (!field) continue

            }

            this.form.appendChild(field)

        }

        this.wrapper.appendChild(this.form)
        DOM.get('#editor')[0].appendChild(this.wrapper)

    }

    createSelectionBlock(){

        DOM.each(document, '.editing', (element)=>{
            element.classList.remove('editing')
        })

        for (let widget of this.selectedWidgets) {
            DOM.each(document, `[data-widget="${widget.hash}"]`, (item)=>{
                item.classList.add('editing')
            })
        }

        var widget = this.selectedWidgets[0]

        if (widget.props.height !== undefined || widget.props.width !== undefined) {

            let $container = $(widget.container)
            $container.resizable({
                handles: 's, e, se',
                helper: 'ui-helper',
                resize: (event, ui)=>{
                    ui.size.height = Math.round(ui.size.height / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                    ui.size.width = Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                },
                stop: (event, ui)=>{

                    var deltaH = ui.size.height - ui.originalSize.height,
                        deltaW = ui.size.width - ui.originalSize.width

                    var newWidgets = []
                    for (var w of this.selectedWidgets) {
                        var originalW = w === widget ? ui.originalSize.width : w.container.offsetWidth,
                            originalH = w === widget ? ui.originalSize.height : w.container.offsetHeight

                        if (w.props.width !== undefined) {
                            var newWidth = Math.max((originalW + deltaW), GRIDWIDTH) / PXSCALE
                            if (typeof w.props.width === 'string' && w.props.width.indexOf('%') > -1) {
                                w.props.width = (100 * PXSCALE * newWidth / w.container.parentNode.offsetWidth).toFixed(2) + '%'
                            } else {
                                w.props.width = newWidth
                            }
                        }

                        if (w.props.height !== undefined) {
                            var newHeight = Math.max((originalH + deltaH), GRIDWIDTH) / PXSCALE
                            if (typeof w.props.height === 'string' && w.props.height.indexOf('%') > -1) {
                                w.props.height = (100 * PXSCALE * newHeight / w.container.parentNode.offsetHeight).toFixed(2) + '%'
                            } else {
                                w.props.height = newHeight
                            }
                        }

                        if (w.props.width !== undefined || w.props.height !== undefined) newWidgets.push(updateWidget(w))
                    }
                    if (newWidgets.length > 1) editor.select(newWidgets, {preventSelect: this.selectedWidgets.length > 1})
                },
                grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE]
            })

        }

        if (widget.props.top !== undefined) {
            let $container = $(widget.container)
            $container.draggable({
                cursor:'-webkit-grabbing',
                drag: (event, ui)=>{
                    ui.position.top = Math.round(ui.position.top / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                    ui.position.left = Math.round(ui.position.left / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                },
                stop: (event, ui)=>{
                    event.preventDefault()

                    var deltaX = (ui.helper.position().left + $container.parent().scrollLeft()) / PXSCALE - widget.container.offsetLeft / PXSCALE,
                        deltaY = (ui.helper.position().top + $container.parent().scrollTop()) / PXSCALE - widget.container.offsetTop / PXSCALE

                    var newWidgets = []
                    for (var w of this.selectedWidgets) {

                        var newTop = w.container.offsetTop / PXSCALE + deltaY
                        if (typeof w.props.top === 'string' && w.props.top.indexOf('%') > -1) {
                            w.props.top = (100 * PXSCALE * newTop / w.container.parentNode.offsetHeight).toFixed(2) + '%'
                        } else {
                            w.props.top = newTop
                        }
                        var newLeft = w.container.offsetLeft / PXSCALE + deltaX
                        if (typeof w.props.left === 'string' && w.props.left.indexOf('%') > -1) {
                            w.props.left = (100 * PXSCALE * newLeft / w.container.parentNode.offsetWidth).toFixed(2) + '%'
                        } else {
                            w.props.left = newLeft
                        }

                        newWidgets.push(updateWidget(w, {preventSelect: this.selectedWidgets.length > 1}))
                    }
                    if (newWidgets.length > 1) editor.select(newWidgets)

                    ui.helper.remove()
                },
                handle:'.ui-draggable-handle, > .label',
                grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE],
                helper:()=>{
                    return $('<div class="ui-helper"></div>').css({height:$container.outerHeight(),width:$container.outerWidth()})
                }
            }).append('<div class="ui-draggable-handle"></div>')

        }


    }

}

var editor = new Editor()

module.exports = editor

require('./context-menu')
