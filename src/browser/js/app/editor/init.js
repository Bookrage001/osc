var {updateWidget, incrementWidget} = require('./data-workers'),
    {editObject, editClean} = require('./edit-objects'),
    createPopup = require('../utils').createPopup,
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
        parent = widget.parentNode,
        index = container.index(),
        data = widget.props,
        type = widget.props.type == 'tab' ? 'tab' : 'widget'

    editObject(widget)

    if (event.type!='fake-right-click') return

    if (container.hasClass('root-container')) {
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

    if (parent.hasClass('panel')) {
        actions['<i class="fa fa-object-group"></i> Edit parent'] = function(){parent.trigger('fake-click')}
    }

    if (type=='widget') actions['<i class="fa fa-copy"></i> Copy'] = function(){CLIPBOARD=JSON.stringify(data)}

    if (type=='widget') actions['<i class="fa fa-cut"></i> Cut'] = function(){
        CLIPBOARD=JSON.stringify(data)
        var parent = widget.parent,
            parentData = parent.props

        parentData.widgets.splice(index,1)
        updateWidget(parent)
    }

    if (((type=='widget' && widgets[data.type].defaults().widgets) || (type=='tab')) && (!data.tabs||!data.tabs.length)) {

        if (CLIPBOARD!=null) {
            actions['<i class="fa fa-paste"></i> Paste'] = {
                '<i class="fa fa-plus-circle"></i> ID + 1':function(){
                    data.widgets = data.widgets || []
                    var newData = incrementWidget(JSON.parse(CLIPBOARD))


                    if (!$(eventData.target).hasClass('tablink')) {
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
                    if (!$(eventData.target).hasClass('tablink')) {
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
                        if (!$(eventData.target).hasClass('tablink')) {
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
        var popup = createPopup('Are you sure ?',`
            <div class="actions">
                <a class="btn warning confirm-delete">DELETE</a>
                <a class="btn cancel-delete">CANCEL</a>
            </div>
        `)
        $('.confirm-delete').click(function(){
            popup.close()
            var parent = widget.parent,
                parentData = parent.props


            if (widget.props.type != 'tab') {
                parentData.widgets.splice(index,1)
            } else {
                parentData.tabs.splice(index,1)
            }

            updateWidget(parent)
        })
        $('.cancel-delete').click(function(){
            popup.close()
        })
        $(document).on('keydown.popup', function(e){
            if (e.keyCode==13) $('.confirm-delete').click()
        })


    }

    menu.open(eventData, actions)

}

document.addEventListener('fake-right-click', handleClick)
document.addEventListener('fake-click', handleClick)
