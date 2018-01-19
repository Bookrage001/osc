var {updateWidget, incrementWidget} = require('./data-workers'),
    {editObject, editClean} = require('./edit-objects'),
    {Popup} = require('../ui/utils'),
    {widgets, categories} = require('../widgets/'),
    widgetManager = require('../managers/widgets'),
    ContextMenu = require('./context-menu')


var menu = new ContextMenu()

var handleClick = function(event) {

    if (!EDITING) return

    menu.close()

    var eventData = event.detail,
        widget = widgetManager.getWidgetByElement(eventData.target, ':not(.not-editable)')

    if (!widget) return

    var container = widget.container,
        index = DOM.index(container),
        data = widget.props,
        type = widget.props.type == 'tab' ? 'tab' : 'widget'

    editObject(widget)

    if (event.type!='fast-right-click') return

    if (container.classList.contains('root-container')) {
        menu.open(eventData,{
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
        actions['<i class="fa fa-object-group"></i> Edit parent'] = function(){editObject(widget.parent)}
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

    menu.open(eventData, actions)

}

document.addEventListener('fast-right-click', handleClick)
document.addEventListener('fast-click', handleClick)
