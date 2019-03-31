var {updateWidget} = require('./data-workers'),
    {categories} = require('../widgets/'),
    widgetManager = require('../managers/widgets'),
    {icon} = require('../ui/utils'),
    editor = require('./'),
    locales = require('../locales'),
    contextMenu = require('../ui/context-menu')


var multiSelectKey = (navigator.platform || '').match('Mac') ? 'metaKey' : 'ctrlKey'

var handleClick = function(event) {

    if (!EDITING) return

    if (!event.detail[multiSelectKey] && event.type !== 'fast-right-click' && (
        event.target.classList.contains('ui-resizable-handle') ||
        event.target.classList.contains('ui-draggable-handle') ||
        event.target.id === 'open-toggle'
    )) { return }

    var eventData = event.detail,
        widget = widgetManager.getWidgetByElement(eventData.target, ':not(.not-editable)')

    if (!widget) return

    // if the widget is not already selected
    if (!widget.container.classList.contains('editing')) {
        // add a flag to the original event to prevent draginit
        // and prevent any further fast-click (ie input focus)
        eventData.capturedByEditor = true
        event.capturedByEditor = true
    }


    if (event.type !== 'fast-right-click') {
        editor.select(widget, {multi: event.detail[multiSelectKey]})
    }

    // right-click menu
    if (event.type !== 'fast-right-click') return

    if (!event.detail.shiftKey && !event.detail[multiSelectKey] && editor.selectedWidgets.length <= 1) {
        editor.select(widget)
    }

    if (!editor.selectedWidgets.length) return

    var index = editor.selectedWidgets.map((w)=>DOM.index(w.container)).sort((a,b)=>{return b-a}),
        data = editor.selectedWidgets.map((w)=>w.props),
        type = editor.selectedWidgets[0].props.type == 'tab' ? 'tab' : 'widget',
        parent = editor.selectedWidgets[0].parent,
        actions = []

    // case root: only "add tab" option
    if (parent === widgetManager) {
        actions.push({
            label: icon('plus') + ' ' + locales('editor_addtab'),
            action: ()=>{
                data[0].tabs.push({})

                var indexes = {addedIndexes: [data[0].tabs.length -1]}
                updateWidget(editor.selectedWidgets[0], indexes)
                editor.pushHistory(indexes)
            }
        })
        contextMenu.open(eventData, actions)

        return
    }

    // case !root

    var clickX = Math.round((eventData.offsetX + eventData.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
        clickY = Math.round((eventData.offsetY + eventData.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH

    actions.push({
        label: icon('expand') + ' ' + locales('editor_editparent'),
        action: ()=>{
            editor.select(parent)
        }
    })

    if (type === 'widget')  {

        actions.push({
            label: icon('copy') + ' ' + locales('editor_copy'),
            action: editor.copyWidget.bind(editor)
        })

        actions.push({
            label: icon('cut') + ' ' + locales('editor_cut'),
            action: editor.cutWidget.bind(editor)
        })

        var wrapActions = []
        for (let c of categories.Containers) {
            if (c === 'clone') continue
            wrapActions.push({
                label: c,
                action: ()=>{
                    var wrap =  {type: c, widgets:[], label: c === 'modal' ? 'auto' : false}

                    wrap.widgets = data

                    var minTop = Math.min(...data.map(x=>isNaN(x.top) ? x.top == 'auto' ? 0 : Infinity : x.top))
                    var minLeft = Math.min(...data.map(x=>isNaN(x.left) ? x.left == 'auto' ? 0 : Infinity : x.left))

                    wrap.top = minTop === Infinity ? data[0].top : minTop
                    wrap.left= minLeft === Infinity ? data[0].left : minLeft

                    for (var w of wrap.widgets) {
                        if (!isNaN(w.top)) w.top = Math.max(w.top - minTop, 0)
                        if (!isNaN(w.left)) w.left = Math.max(w.left - minLeft, 0)
                    }

                    var i
                    for (i of index) {
                        parent.props.widgets.splice(i,1)
                    }

                    parent.props.widgets = parent.props.widgets.slice(0, i).concat(wrap, parent.props.widgets.slice(i, parent.props.widgets.length))

                    editor.select(updateWidget(parent, {preventSelect: true, removedIndexes: index, addedIndexes: [i]}))
                    editor.pushHistory({removedIndexes: index, addedIndexes: [i]})

                }
            })
        }

        actions.push({
            label: icon('box') + ' ' + locales('editor_wrap'),
            action: wrapActions
        })

    }


    if (data.length == 1 && (!data[0].tabs || !data[0].tabs.length) && (data[0].widgets)) {

        if (editor.clipboard !== null) {

            var pasteActions = []

            pasteActions.push({
                label: icon('paste') + ' ' + locales('editor_paste'),
                action: ()=>{
                    editor.pasteWidget(clickX, clickY)
                }
            })
            pasteActions.push({
                label: icon('plus-square') + ' ' + locales('editor_pasteindent'),
                action: ()=>{
                    editor.pasteWidget(clickX, clickY, true)
                }
            })

            if (editor.idClipboard && widgetManager.getWidgetById(editor.idClipboard).length) {
                pasteActions.push({
                    label: icon('clone') + ' ' + locales('editor_clone'),
                    action: ()=>{
                        editor.pasteWidgetAsClone(clickX, clickY)
                    }
                })
            }

            actions.push({
                label: icon('paste') + ' ' + locales('editor_paste'),
                action: pasteActions
            })

        }


        var addActions = []

        for (let category in categories) {

            var catActions = []

            for (let t in categories[category]) {

                let type = categories[category][t]

                catActions.push({

                    label: type,
                    action: ()=>{

                        var newData = {type: type}

                        if (!eventData.target.classList.contains('tablink')) {
                            newData.top = clickY
                            newData.left= clickX
                        }

                        data[0].widgets = data[0].widgets || []
                        data[0].widgets.push(newData)

                        var indexes = {addedIndexes: [data[0].widgets.length -1]}
                        updateWidget(editor.selectedWidgets[0], indexes)
                        editor.pushHistory(indexes)

                    }
                })

            }

            addActions.push({
                label: category,
                action: catActions
            })

        }

        actions.push({
            label: icon('plus') + ' ' + locales('editor_addwidget'),
            action: addActions
        })

    }

    if (data.length == 1 && (!data[0].widgets || !data[0].widgets.length) && (data[0].tabs)) {

        actions.push({
            label: icon('plus') + ' ' + locales('editor_addtab'),
            action: ()=>{
                data[0].tabs = data[0].tabs || []
                data[0].tabs.push({})

                var indexes = {addedIndexes: [data[0].tabs.length -1]}
                updateWidget(editor.selectedWidgets[0], indexes)
                editor.pushHistory(indexes)

            }
        })

    }

    actions.push({
        label: icon('trash') + ' ' + locales('editor_delete'),
        action: editor.deleteWidget.bind(editor)
    })

    contextMenu.open(eventData, actions)

}

document.body.addEventListener('fast-right-click', handleClick, true)
document.body.addEventListener('fast-click', handleClick, true)
