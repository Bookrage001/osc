var actions = require('./actions'),
    icon = require('./utils').icon,
    fullscreen = require('screenfull')

var data = [
    {
        actions: [
            {
                title:'Fullscreen',
                action:actions.toggleFullscreen,
                class:'fullscreenToggle'
            }

        ]
    },
    {
        title: icon('sliders') + '&nbsp; State',
        actions: [
            {
                title:'Store',
                action:actions.stateQuickSave
            },
            {
                title:'Recall',
                action:actions.stateQuickLoad,
                class:'disabled quickload'
            },
            {
                title:'Send All',
                action:actions.stateSend
            },
            {
                title:'Import',
                action:actions.stateLoad
            },
            {
                title:'Export',
                action:actions.stateSave
            }
        ]
    },
    {
        title: icon('magic') + '&nbsp; Traversing gestures',
        actions: [
            {
                title:'On',
                action:actions.traversingEnable,
                class:'traversingEnable'
            },
            {
                title:'Off',
                action:actions.traversingDisable,
                class:'traversingDisable on'
            }
        ]
    },
    {
        title: icon('edit') + '&nbsp; Editor',
        class:'editor-menu',
        actions: [
            {
                title:'On',
                action:actions.editorEnable,
                class:'enable-editor'
            },
            {
                title:'Off',
                action:actions.editorDisable,
                class:'on disable-editor'
            },
            {
                title:'Root',
                class:'editor-root disabled'
            },
            {
                title:'Load',
                action:actions.sessionBrowse
            },
            {
                title:'Save',
                action:actions.sessionSave
            }
        ]
    },
]

var sidepanel = function(data){

    var bindAction = function(el,callback) {
        el.click(function(){callback()})
    }

    var  html = $('<ul id="options"></ul>')

    for (let i in data) {
        var itemData = data[i]

        var item = $('<li></li>'),
            inner = $(`<div class="${itemData.class || ''}"></div>`).appendTo(item),
            wrapper = $('<div class="actions"></div>').appendTo(inner)

        if (itemData.title) $(`<div class="title">${itemData.title}</div>`).prependTo(wrapper)

        for (let j in itemData.actions) {
            var actionData = itemData.actions[j]
            var el = $(`<a class="btn ${actionData.class || ''}">${actionData.title}</a>`).appendTo(wrapper)
            if (actionData.action) bindAction(el, actionData.action)

        }
        item.appendTo(html)

    }

    return html

}

var toggle = function(){
    var t = $('#open-toggle').parent().off('fake-click').on('fake-click', function(e){
        var t = (!$('#sidepanel').hasClass('sidepanel-open')) ? 250 : 0


        setTimeout(function(){
            $('#open-toggle, #sidepanel').toggleClass('sidepanel-open')
        }, 25)

        setTimeout(function(){
            $('#container').toggleClass('sidepanel-open')
            $(window).resize()
        },t + 25)

    })

    // in case where are hot loading a session
    if ($('#sidepanel').hasClass('sidepanel-open')) {
        $('#open-toggle, #container').addClass('sidepanel-open')
    }

    $(document).off('keydown.sidepanel').on('keydown.sidepanel', function(e){
        if (e.keyCode==121) t.trigger('fake-click')
    })
}

module.exports = {
    init:function(){
        $('#sidepanel').empty()
        $('#sidepanel').append(`
            <div class="navigation"><ul><li><a>${PACKAGE.productName.toUpperCase()}</a></li></ul></div>
        `)
        $('#sidepanel').append(sidepanel(data))
        $('#sidepanel').append('<div id="editor"></div>')

        var fsToggle = $('#sidepanel').find('.fullscreenToggle')
        if (fullscreen.enabled) {
            fullscreen.off('change')
            fullscreen.on('change', ()=>{
                fsToggle.toggleClass('on', fullscreen.isFullScreen)
            })
        } else {
            fsToggle.addClass('disabled')
        }

        toggle()
    },
    createToggle:toggle
}
