var {updateWidget, incrementWidget} = require('./data-workers'),
    {Popup} = require('../ui/utils'),
    {widgets, categories} = require('../widgets/'),
    widgetManager = require('../managers/widgets'),
    editor = require('./')

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

    var eventData = event.detail,
        widget = widgetManager.getWidgetByElement(eventData.target, ':not(.not-editable)')

    if (!widget) return

    var container = widget.container,
        index = DOM.index(container),
        data = widget.props,
        type = widget.props.type == 'tab' ? 'tab' : 'widget'


    // if the widget is not already selected
    if (!widget.container.classList.contains('editing')) {
        // add a flag to the original event to prevent draginit
        // and prevent any further fast-click (ie input focus)
        eventData.capturedByEditor = true
        event.capturedByEditor = true
    }

    editor.select(widget, {multi: event.detail.ctrlKey})

    if (event.type!='fast-right-click') return

    if (container.classList.contains('root-container')) {
        contextMenu.open(eventData,{
            '<i class="fa fa-plus"></i> Add tab': function(){
                data.tabs.push({})
                updateWidget(widget)
            }
        })

        return
    }

    var actions = {},
        clickX = Math.round((eventData.offsetX + eventData.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
        clickY = Math.round((eventData.offsetY + eventData.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH

    if (widget.parent != widgetManager) {
        actions['<i class="fa fa-object-group"></i> Edit parent'] = function(){editor.select(widget.parent)}
    }

    if (type=='widget') actions['<i class="fa fa-copy"></i> Copy'] = function(){CLIPBOARD=JSON.stringify(data)}

    if (type=='widget') actions['<i class="fa fa-cut"></i> Cut'] = function(){
        CLIPBOARD=JSON.stringify(data)
        widget.parent.props.widgets.splice(index,1)
        updateWidget(widget.parent)
    }

    if (((type=='widget' && widgets[data.type].defaults().widgets) || (type=='tab')) && (!data.tabs||!data.tabs.length)) {

        if (CLIPBOARD!=null) {
            actions['<i class="fa fa-paste"></i> Paste'] = {
                '<i class="fa fa-plus-circle"></i> ID + 1':function(){
                    data.widgets = data.widgets || []
                    var newData = incrementWidget(JSON.parse(CLIPBOARD))


                    if (!eventData.target.classList.contains('tablink')) {
                        newData.top = clickY
                        newData.left= clickX
                    } else {
                        delete newData.top
                        delete newData.left
                    }

                    data.widgets.push(newData)
                    updateWidget(widget)
                },
                '<i class="fa fa-clone"></i> Clone':function(){
                    data.widgets = data.widgets || []
                    var newData = JSON.parse(CLIPBOARD)
                    if (!eventData.target.classList.contains('tablink')) {
                        newData.top = clickY
                        newData.left= clickX
                    } else {
                        delete newData.top
                        delete newData.left
                    }
                    data.widgets.push(newData)
                    updateWidget(widget)
                }
            }
        }

        actions['<i class="fa fa-plus"></i> Add widget'] = {}
        for (let category in categories) {
            actions['<i class="fa fa-plus"></i> Add widget'][category] = {}
            for (let t in categories[category]) {
                let wtype = categories[category][t]
                actions['<i class="fa fa-plus"></i> Add widget'][category][wtype] =  function(){
                        data.widgets = data.widgets || []
                        var newData = {type:wtype}
                        if (!eventData.target.classList.contains('tablink')) {
                            newData.top = clickY
                            newData.left= clickX
                        }
                        data.widgets.push(newData)
                        updateWidget(widget)
                }

            }
        }

    }
    if  (((type=='widget' && widgets[data.type].defaults().tabs) || (type=='tab')) && (!data.widgets||!data.widgets.length)) {

        actions['<i class="fa fa-plus"></i> Add tab'] = function(){
            data.tabs = data.tabs || []
            data.tabs.push({})
            updateWidget(widget)
        }

    }

    actions['<i class="fa fa-trash"></i> Delete'] = function(){
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

        DOM.get(popup.html, '.confirm-delete')[0].addEventListener('click', function(){
            popup.close()

            if (widget.props.type != 'tab') {
                widget.parent.props.widgets.splice(index,1)
            } else {
                widget.parent.props.tabs.splice(index,1)
            }

            updateWidget(widget.parent)
        })

        DOM.get(popup.html, '.cancel-delete')[0].addEventListener('click', function(){
            popup.close()
        })

    }

    contextMenu.open(eventData, actions)

}

document.addEventListener('fast-right-click', handleClick, true)
document.addEventListener('fast-click', handleClick, true)
