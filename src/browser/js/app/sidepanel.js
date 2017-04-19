var actions = require('./actions'),
    icon = require('./utils').icon

var data = [
    {
        actions: [
            {
                title:'Fullscreen',
                action:actions.toggleFullscreen
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

    for (i in data) {
        var itemData = data[i]

        var item = $('<li></li>'),
            inner = $('<div></div>').appendTo(item),
            wrapper = $('<div class="actions"></div>').appendTo(inner)

        if (itemData.title) $('<div class="title">'+itemData.title+'</div>').prependTo(wrapper)
        if (itemData.class) inner.attr('class',itemData.class)

        for (j in itemData.actions) {
            var actionData = itemData.actions[j]
            var el = $('<a class="btn">'+actionData.title+'</a>').appendTo(wrapper)
            if (actionData.action) bindAction(el, actionData.action)

            if (actionData.class) el.addClass(actionData.class)

        }
        item.appendTo(html)

    }

    return html

}(data)

var toggle = function(){
    var t = $(`<li><a id="open-toggle">${icon('navicon')}</a></li>`).appendTo('.navigation.main ul').click(function(e){
        var t = (!$('#sidepanel').hasClass('sidepanel-open')) ? 250 : 0


        setTimeout(function(){
            $('#open-toggle, #sidepanel').toggleClass('sidepanel-open')
        }, 25)

        setTimeout(function(){
            $('#container').toggleClass('sidepanel-open')
            $(window).resize()
        },t + 25)

    }).on('mousedown touchstart',function(e){e.stopPropagation()})

    // in case where are hot loading a session
    if ($('#sidepanel').hasClass('sidepanel-open')) {
        $('#open-toggle, #container').addClass('sidepanel-open')
    }

    $(document).on('keydown.sidepanel', function(e){
        if (e.keyCode==121) t.click()
    })
}

module.exports = {
    init:function(){
        $('#sidepanel').append(`
            <div class="navigation"><ul><li><a>${PACKAGE.productName.toUpperCase()}</a></li></ul></div>
        `)
        $('#sidepanel').append(sidepanel)
        $('#sidepanel').append('<div id="editor"></div>')
        toggle()
    },
    createToggle:toggle
}
