var {updateWidget, incrementWidget} = require('./data-workers'),
    {Popup} = require('../ui/utils'),
    {widgets, categories} = require('../widgets/'),
    widgetManager = require('../managers/widgets'),
    editor = require('./')

var mod = (navigator.platform || '').match('Mac') ? 'metaKey' : 'ctrlKey'


class ContextMenu {

    constructor(){

        this.menu = null
        this.event = 'fast-click'
        this.root = document.body

    }

    open(e, actions, parent) {

        var menu = DOM.create('<div class="context-menu"></div>')

        for (let label in actions) {

            if (typeof actions[label] == 'object') {

                var item = DOM.create(`<div class="item has-sub" tabIndex="1">${label}</div>`)
                menu.appendChild(item)

                this.open(e,actions[label],item)


            } else {

                var item = DOM.create(`<div class="item">${label}</div>`)
                menu.appendChild(item)
                item.addEventListener(this.event, (e)=>{
                    actions[label]()
                    this.close()
                })

            }

        }

        if (parent) parent.appendChild(menu)

        if (!parent) {

            this.menu = menu

            this.root.appendChild(menu)

            DOM.each(menu, '.item', (item)=>{
                item.addEventListener('mouseenter', ()=>{
                    DOM.each(item.parentNode, '.focus', (focused)=>{
                        focused.classList.remove('focus')
                    })
                    item.classList.add('focus')
                })
                item.addEventListener('mouseleave', ()=>{
                    if (!item.classList.contains('has-sub')) item.classList.remove('focus')
                })
            })

            menu.style.top = e.pageY + 'px'
            menu.style.left = e.pageX + 'px'

            this.correctPosition(menu)

            DOM.each(menu, '.context-menu', (m)=>{
                this.correctPosition(m, m.parentNode)
            })

        }


    }

    close() {

        if (this.menu) {

            this.menu.parentNode.removeChild(this.menu)
            this.menu = null

        }

    }

    correctPosition(menu, parent) {

        var position = DOM.offset(menu),
            width = menu.offsetWidth,
            height = menu.offsetHeight,
            totalWidth = this.root.offsetWidth,
            totalHeight = this.root.offsetHeight

        if (width + position.left > totalWidth) {
            menu.style.right = parent ? '100%' : '0'
            menu.style.left = 'auto'
            menu.style.marginRight = '2rem'
        }

        if (height + position.top > totalHeight) {
            menu.style.top = 'auto'
            menu.style.bottom = '2rem'
        }

    }

}

var contextMenu = new ContextMenu()

var handleClick = function(event) {

    if (!EDITING) return

    if (contextMenu.menu && !contextMenu.menu.contains(event.target)) contextMenu.close()

    if (!event.detail.ctrlKey && event.type !== 'fast-right-click' && (
        event.target.classList.contains('ui-resizable-handle') ||
        event.target.classList.contains('ui-draggable-handle')
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
        editor.select(widget, {multi: event.detail[mod]})
    }

    // right-click menu
    if (event.type !== 'fast-right-click') return

    if (!event.detail.ctrlKey && editor.selectedWidgets.length <= 1) {
        editor.select(widget, {multi: event.detail[mod]})
    }

    if (!editor.selectedWidgets.length) return

    var index = editor.selectedWidgets.map((w) => DOM.index(w.container)).sort((a,b)=>{return b-a}),
        data = editor.selectedWidgets.map((w) => w.props),
        type = editor.selectedWidgets[0].props.type == 'tab' ? 'tab' : 'widget',
        parent = editor.selectedWidgets[0].parent

    // case root: only "add tab" option
    if (parent === widgetManager) {
        contextMenu.open(eventData,{
            '<i class="fa fa-plus"></i> Add tab': function(){
                data[0].tabs.push({})
                updateWidget(widget)
            }
        })

        return
    }

    // case !root

    var actions = {},
        clickX = Math.round((eventData.offsetX + eventData.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
        clickY = Math.round((eventData.offsetY + eventData.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH

    actions['<i class="fa fa-object-group"></i> Edit parent'] = ()=>{
        editor.select(parent)
    }

    if (type === 'widget')  {

        actions['<i class="fa fa-copy"></i> Copy'] = ()=>{
            CLIPBOARD = JSON.stringify(data)
        }

        actions['<i class="fa fa-cut"></i> Cut'] = ()=>{
            CLIPBOARD = JSON.stringify(data)
            for (var i of index) {
                parent.props.widgets.splice(i,1)
            }
            editor.select(updateWidget(parent, {preventSelect: true}))
        }

        actions['<i class="fa fa-box"></i> Wrap in'] = {}
        for (let c of categories.Containers) {
            if (c === 'clone') continue
            actions['<i class="fa fa-box"></i> Wrap in'][c] = ()=>{
                var wrap =  {type: c, widgets:[]}

                wrap.widgets = data

                var minTop = Math.min(...data.map(x => isNaN(x.top) ? x.top == 'auto' ? 0 : Infinity : x.top))
                var minLeft = Math.min(...data.map(x => isNaN(x.left) ? x.left == 'auto' ? 0 : Infinity : x.left))

                wrap.top = minTop === Infinity ? data[0].top : minTop
                wrap.left= minLeft === Infinity ? data[0].left : minLeft

                for (var w of wrap.widgets) {
                    if (!isNaN(w.top)) w.top = Math.max(w.top - minTop, 0)
                    if (!isNaN(w.left)) w.left = Math.max(w.left - minLeft, 0)
                }

                for (var i of index) {
                    parent.props.widgets.splice(i,1)
                }
                parent.props.widgets.push(wrap)
                editor.select(updateWidget(parent, {preventSelect: true}))
            }
        }

    }


    if (data.length == 1 && (!data[0].tabs || !data[0].tabs.length) && (data[0].widgets)) {

        if (CLIPBOARD !== null) {

            function paste(increment) {

                var pastedData = JSON.parse(CLIPBOARD),
                    minTop = Infinity,
                    minLeft = Infinity

                for (var i in pastedData) {
                    if (increment) pastedData[i] = incrementWidget(pastedData[i])
                    if (!isNaN(pastedData[i]).top && pastedData[i].top < minTop) {
                        minTop = pastedData[i].top
                    }
                    if (!isNaN(pastedData[i]).left && pastedData[i].left < minLeft) {
                        minLeft = pastedData[i].left
                    }
                }

                var keepPosition = eventData.target.classList.contains('tablink')
                for (var i in pastedData) {

                    if (!keepPosition) {
                        if (!isNaN(pastedData[i].top)) pastedData[i].top  = pastedData[i].top - minTop + clickY
                        if (!isNaN(pastedData[i].left)) pastedData[i].left = pastedData[i].left - minLeft + clickX
                    }

                }

                data[0].widgets = data[0].widgets || []
                data[0].widgets = data[0].widgets.concat(pastedData)

                updateWidget(editor.selectedWidgets[0])

            }

            actions['<i class="fa fa-paste"></i> Paste'] = {
                '<i class="fa fa-plus-circle"></i> ID + 1': ()=>{
                    paste(true)
                },
                '<i class="fa fa-clone"></i> Clone': ()=>{
                    paste()
                }
            }

        }

        actions['<i class="fa fa-plus"></i> Add widget'] = {}

        for (let category in categories) {

            actions['<i class="fa fa-plus"></i> Add widget'][category] = {}

            for (let t in categories[category]) {

                let type = categories[category][t]

                actions['<i class="fa fa-plus"></i> Add widget'][category][type] = ()=>{

                    var newData = {type: type}

                    if (!eventData.target.classList.contains('tablink')) {
                        newData.top = clickY
                        newData.left= clickX
                    }

                    data[0].widgets = data[0].widgets || []
                    data[0].widgets.push(newData)
                    updateWidget(editor.selectedWidgets[0])
                }

            }

        }

    }

    if (data.length == 1 && (!data[0].widgets || !data[0].widgets.length) && (data[0].tabs)) {

        actions['<i class="fa fa-plus"></i> Add tab'] = ()=>{
            data[0].tabs = data[0].tabs || []
            data[0].tabs.push({})
            updateWidget(editor.selectedWidgets[0])
        }

    }

    actions['<i class="fa fa-trash"></i> Delete'] = ()=>{

        var popup = new Popup({
            title: 'Are you sure ?',
            content:`
                <div class="actions">
                    <a class="btn warning confirm-delete">DELETE</a>
                    <a class="btn cancel-delete">CANCEL</a>
                </div>`,
            closable: false,
            escKey: true,
            enterKey: function(){DOM.get(this.html, '.confirm-delete')[0].click()}
        })

        DOM.get(popup.html, '.confirm-delete')[0].addEventListener('click', ()=>{

            popup.close()

            if (type === 'widget') {
                for (var i of index) {
                    parent.props.widgets.splice(i,1)
                }
            } else {
                for (var i of index) {
                    parent.props.tabs.splice(i,1)
                }
            }

            editor.select(updateWidget(parent, {preventSelect: true}))

        })

        DOM.get(popup.html, '.cancel-delete')[0].addEventListener('click', function(){
            popup.close()
        })

    }

    contextMenu.open(eventData, actions)

}

document.addEventListener('fast-right-click', handleClick, true)
document.addEventListener('fast-click', handleClick, true)
