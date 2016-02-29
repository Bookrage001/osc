var init = require('./init'),
    actions = require('./actions'),
    utils = require('./utils'),
    icon = utils.icon

module.exports = {

    receiveOsc: function(event,data){
        var data = data || event

        // fetch id
        var path = data.path
        var id = WIDGETS_ID_BY_PATH[path]

        // update
        if (WIDGETS[id]!=undefined) {
            for (i in WIDGETS[id]){
                 WIDGETS[id][i].setValue(data.args,false,false)
            }
        }

    },

    stateLoad: function(event,data){
        var data = data || event
        actions.stateSet(data,true)
        actions.stateQuickSave(data)
    },

    sessionList: function(event,data){
        var data = data || event
        $('#lobby').append('\
            <div class="main">\
                <div class="header">\
                    Session selection\
                </div>\
                <div class="list"></div>\
            </div>')

        for (i in data) {
            $('#lobby .list').append('<li><a class="btn load" data-session="'+data[i]+'">'+data[i]+'<span>'+icon('remove')+'</span></a></li>')
        }
        $('#lobby .list').append('<a class="btn browse">...</a>')
        $('#lobby .list').append('<a class="btn new">New</a>')
        $('#lobby .load').click(function(e){
            e.stopPropagation()
            IPC.send('sessionOpen',{path:$(this).data('session')})
        })
        $('#lobby a span').click(function(e){
            e.stopPropagation()
            IPC.send('sessionRemoveFromHistory',$(this).parent().data('session'))
            $(this).parents('li').hide()
        })
        $('#lobby .browse').click(function(e){
            e.stopPropagation()
            actions.sessionBrowse()
        })
        $('#lobby .new').click(function(e){
            e.stopPropagation()
            $('#lobby').remove()
            setTimeout(function(){
                init([{}],function(){$('#open-toggle, .enable-editor, .editor-root').click()})
            },25)
        })
    },

    sessionOpen: function(event,data){
        var data = data || event
        var session = JSON.parse(data)

        $('#lobby').remove()
        $('#container').empty().append('<div id="loading"><div class="spinner"></div></div>')
        setTimeout(function(){
            init(session,function(){$('#loading').hide()})
        },25)

    },

    error: function(event,data){
        var data = data || event

        utils.createPopup(icon('warning')+'&nbsp;'+data.title,data.text)
    }

}
