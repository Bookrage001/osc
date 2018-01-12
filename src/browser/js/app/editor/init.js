var {updateDom, incrementWidget} = require('./data-workers'),
    {editObject, editClean} = require('./edit-objects'),
    createPopup = require('../utils').createPopup,
    {widgets, categories} = require('../widgets/'),
    widgetManager = require('../managers/widgets'),
    ContextMenu = require('./context-menu')


var menu = new ContextMenu()

var init = function(){

    $('body').off('.editor').on('fake-click fake-right-click',function(e,d){

        if (!EDITING) return

        menu.close()

        var widget = widgetManager.getWidgetByElement(e.target, ':not(.not-editable)')

        if (!widget) return

        var container = widget.container,
            parent = widget.parentNode,
            index = container.index(),
            data = widget.props,
            type = widget.props.type == 'tab' ? 'tab' : 'widget'

        editObject(widget)

        if (e.type!='fake-right-click') return

        if (container.hasClass('root-container')) {
            menu.open(d,{
                '<i class="fa fa-plus"></i> Add tab': function(){
                    data.tabs.push({})
                    updateDom(widget)
                }
            })

            return
        }

        var actions = {},
            clickX = Math.round((d.offsetX + d.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
            clickY = Math.round((d.offsetY + d.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH

        if (parent.hasClass('panel')) {
            actions['<i class="fa fa-object-group"></i> Edit parent'] = function(){parent.trigger('fake-click')}
        }

        if (type=='widget') actions['<i class="fa fa-copy"></i> Copy'] = function(){CLIPBOARD=JSON.stringify(data)}

        if (type=='widget') actions['<i class="fa fa-cut"></i> Cut'] = function(){
            CLIPBOARD=JSON.stringify(data)
            var parent = widget.parent,
                parentData = parent.props

            parentData.widgets.splice(index,1)
            updateDom(parent)
        }

        if (((type=='widget' && widgets[data.type].defaults().widgets) || (type=='tab')) && (!data.tabs||!data.tabs.length)) {

            if (CLIPBOARD!=null) {
                actions['<i class="fa fa-paste"></i> Paste'] = {
                    '<i class="fa fa-plus-circle"></i> ID + 1':function(){
                        data.widgets = data.widgets || []
                        var newData = incrementWidget(JSON.parse(CLIPBOARD))


                        if (!target.hasClass('tablink')) {
                            newData.top = clickY
                            newData.left= clickX
                        } else {
                            delete newData.top
                            delete newData.left
                        }

                        data.widgets.push(newData)
                        updateDom(widget)
                    },
                    '<i class="fa fa-clone"></i> Clone':function(){
                        data.widgets = data.widgets || []
                        var newData = JSON.parse(CLIPBOARD)
                        if (!target.hasClass('tablink')) {
                            newData.top = clickY
                            newData.left= clickX
                        } else {
                            delete newData.top
                            delete newData.left
                        }
                        data.widgets.push(newData)
                        updateDom(widget)
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
                            if (!target.hasClass('tablink')) {
                                newData.top = clickY
                                newData.left= clickX
                            }
                            data.widgets.push(newData)
                            updateDom(widget)
                    }

                }
            }

        }
        if  (((type=='widget' && widgets[data.type].defaults().tabs) || (type=='tab')) && (!data.widgets||!data.widgets.length)) {

            actions['<i class="fa fa-plus"></i> Add tab'] = function(){
                data.tabs = data.tabs || []
                data.tabs.push({})
                updateDom(widget)
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

                updateDom(parent)
            })
            $('.cancel-delete').click(function(){
                popup.close()
            })
            $(document).on('keydown.popup', function(e){
                if (e.keyCode==13) $('.confirm-delete').click()
            })


        }

        menu.open(d,actions)

    })

}

module.exports = init
