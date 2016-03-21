var init = require('./init'),
    actions = require('./actions'),
    utils = require('./utils'),
    icon = utils.icon

module.exports = {

    receiveOsc: function(event,data){
        var data = data || event

        // fetch ids corresponding to the osc path
        var path = data.path
        var ids = WIDGETS_ID_BY_PATH[path]

        for (i in ids) {
            var id = ids[i]
            // update
            if (WIDGETS[id]) {
                for (j in WIDGETS[id]){
                     WIDGETS[id][j].setValue(data.args,false,true)
                }
            }
        }


    },

    stateLoad: function(event,data){
        var data = data || event
        data = JSON.parse(data)
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
            init([{}],function(){$('#open-toggle, .enable-editor').click();$('.editor-root').trigger('mousedown.editor')})
        })
    },

    sessionOpen: function(event,data){
        var data = data || event
        var session = JSON.parse(data)
        init(session)

    },

    error: function(event,data){
        var data = data || event

        utils.createPopup(icon('warning')+'&nbsp;'+data.title,data.text)
    },

    applyStyle: function(event,data){
        var data = data || event
        var style = document.createElement('style');
        style.innerHTML = data;
        document.body.appendChild(style);
        if (data.indexOf('--pixel-scale')) {
            PXSCALE = data.match(/--pixel-scale\s*:\s*([^;]*)/)[1]
            INITIALZOOM = PXSCALE
        }
    }

}
