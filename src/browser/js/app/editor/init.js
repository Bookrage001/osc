var data = require('./data-workers'),
    getObjectData = data.getObjectData,
    updateDom = data.updateDom,
    incrementWidget = data.incrementWidget,
    edit = require('./edit-objects'),
    editObject = edit.editObject,
    editSession = edit.editSession,
    createPopup = require('../utils').createPopup,
    widgetOptions = require('../widgets').widgetOptions,
    widgetCategories = require('../widgets').categories,
    menu = require('./context-menu')



var init = function(){

    $('body').off('.editor').on('fake-click fake-right-click',function(e,d){

        if (!EDITING) return

        // ignore mouse event when fired by a simulated touch event
        if (e.type=='mousedown' && e.originalEvent.sourceCapabilities.firesTouchEvents) return

        $('.context-menu').remove()

        var target = $(e.target).is('.widget:not(.not-editable), .tab, [data-tab], #container')?
                        $(e.target):
                        $(e.target).closest('.widget:not(.not-editable), .tab, [data-tab], #container')

        if (!target.length) return

        var container = target.attr('data-tab')?TABS[target.attr('data-tab')].tab:target,
            type = target.hasClass('widget')?'widget':'tab',
            parent = container.parent(),
            index = container.index(),
            data = getObjectData(container)

        if (container.attr('id')=='container') {
            editSession(container,SESSION)
        } else {
            editObject(container,data)
        }


        if (e.type!='fake-right-click') return

        if (container.attr('id')=='container') {
            menu(d,{
                '<i class="fa fa-plus"></i> Add tab': function(){
                    data.push({})
                    updateDom(container,data)
                }
            },'body')

            return
        }

        var actions = {},
            clickX = Math.round((d.offsetX + d.target.scrollLeft) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH,
            clickY = Math.round((d.offsetY + d.target.scrollTop)  / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
        // actions['<i class="fa fa-edit"></i> Edit'] = function(){editObject(container,data)}

        if (type=='widget') actions['<i class="fa fa-copy"></i> Copy'] = function(){CLIPBOARD=data}

        if (type=='widget') actions['<i class="fa fa-cut"></i> Cut'] = function(){
            CLIPBOARD=JSON.parse(JSON.stringify(data))
            var parentContainer = container.parents('.widget, .tab, #container').first()
                parentData = getObjectData(parentContainer)

            parentData.widgets.splice(container.index(),1)
            updateDom(parentContainer,parentData)
        }

        if (((type=='widget'&&widgetOptions[data.type].widgets) || (type=='tab')) && (!data.tabs||!data.tabs.length)) {

            if (CLIPBOARD!=null) {
                actions['<i class="fa fa-paste"></i> Paste'] = {
                    '<i class="fa fa-plus-circle"></i> ID + 1':function(){
                        data.widgets = data.widgets || []
                        var newData = incrementWidget(JSON.parse(JSON.stringify(CLIPBOARD)))


                        if (!target.attr('data-tab')) {
                            newData.top = clickY
                            newData.left= clickX
                        } else {
                            delete newData.top
                            delete newData.left
                        }

                        data.widgets.push(newData)
                        updateDom(container,data)
                    },
                    '<i class="fa fa-clone"></i> Clone':function(){
                        data.widgets = data.widgets || []
                        var newData = JSON.parse(JSON.stringify(CLIPBOARD))
                        if (!target.attr('data-tab')) {
                            newData.top = clickY
                            newData.left= clickX
                        } else {
                            delete newData.top
                            delete newData.left
                        }
                        data.widgets.push(newData)
                        updateDom(container,data)
                    }
                }
            }

            actions['<i class="fa fa-plus"></i> Add widget'] = {}
            for (category in widgetCategories) {
                actions['<i class="fa fa-plus"></i> Add widget'][category] = {}
                for (t in widgetCategories[category]) {
                    let wtype = widgetCategories[category][t]
                    actions['<i class="fa fa-plus"></i> Add widget'][category][wtype] =  function(){
                            data.widgets = data.widgets || []
                            var newData = {type:wtype}
                            if (!target.attr('data-tab')) {
                                newData.top = clickY
                                newData.left= clickX
                            }
                            data.widgets.push(newData)
                            updateDom(container,data)
                    }

                }
            }

        }
        if  (((type=='widget'&&widgetOptions[data.type].tabs) || (type=='tab')) && (!data.widgets||!data.widgets.length)) {

            actions['<i class="fa fa-plus"></i> Add tab'] = function(){
                data.tabs = data.tabs || []
                data.tabs.push({})
                updateDom(container,data)
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
                var parentContainer = container.parents('.widget, .tab, #container').first(),
                    parentData = getObjectData(parentContainer)


                if (type=='widget') {
                    parentData.widgets.splice(container.index(),1)
                } else if (type=='tab' && parentContainer.attr('id')!='container') {
                    parentData.tabs.splice(container.data('index'),1)
                } else {
                    parentData.splice(container.data('index'),1)
                }

                updateDom(parentContainer,parentData)
            })
            $('.cancel-delete').click(function(){
                popup.close()
            })
            $(document).on('keydown.popup', function(e){
                if (e.keyCode==13) $('.confirm-delete').click()
            })


        }

        menu(d,actions,'body')

    })

}

module.exports = init
