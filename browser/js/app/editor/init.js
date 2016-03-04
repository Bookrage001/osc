var data = require('./data-workers'),
    getObjectData = data.getObjectData,
    updateDom = data.updateDom,
    edit = require('./edit-objects'),
    editObject = edit.editObject,
    editSession = edit.editSession,
    createPopup = require('../utils').createPopup,
    widgetOptions = require('../widgets').widgetOptions,
    menu = require('./context-menu')



var init = function(){


    $('body').off('.editor').on('mousedown.editor touchstart.editor',function(e){

        if (!EDITING) return

        $('.context-menu').remove()

        var target = $(e.target).is('.widget, .tab, [data-tab]')?
                        $(e.target):
                        $(e.target).closest('.widget, .tab, a[data-tab]')

        if (!target.length) return

        var container = target.attr('data-tab')?$(target.attr('data-tab')):target,
            type = target.hasClass('widget')?'widget':'tab',
            parent = container.parent(),
            index = container.index(),
            data = getObjectData(container)

        if (container.attr('id')=='container') {
            editSession(container,SESSION)
            return
        }

        editObject(container,data)

        if (e.button!=2) return

        var actions = {}

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

            if (CLIPBOARD!=null) actions['<i class="fa fa-paste"></i> Paste'] = function(){
                data.widgets = data.widgets || []
                data.widgets.push(JSON.parse(JSON.stringify(CLIPBOARD)))
                updateDom(container,data)
            }

            actions['<i class="fa fa-plus"></i> Add widget'] = {}
            var createFunction = function(widgetType,container,data){
                return function() {
                    data.widgets = data.widgets || []
                    data.widgets.push({type:widgetType})
                    updateDom(container,data)
                }
            }
            for (widgetType in widgetOptions) {
                actions['<i class="fa fa-plus"></i> Add widget'][widgetType] = createFunction(widgetType,container,data)
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
                    <div class="btn warning confirm-delete">DELETE</div>
                    <div class="btn cancel-delete">CANCEL</div>
                </div>
            `)
            $('.confirm-delete').click(function(){
                popup.close()
                var parentContainer = container.parents('.widget, .tab, #container').first()
                    parentData = getObjectData(parentContainer)

                if (type=='widget') {
                    parentData.widgets.splice(container.index(),1)
                } else if (type=='tab' && parentContainer.attr('id')!='container') {
                    parentData.tabs.splice(container.index(),1)
                } else {
                    parentData.splice(container.index(),1)
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

        menu(e,actions,'body')

    })

}

module.exports = init
