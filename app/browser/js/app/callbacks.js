
ipc.on('receiveOsc',function(data){
    // fetch id
    var path = data.path
    var id = __widgetsIds__[path]

    // update
    if (__widgets__[id]!=undefined) {
        for (i in __widgets__[id]){
             __widgets__[id][i].setValue(data.args,false,false)
        }
    }

})

ipc.on('load',function(preset){
    setState(preset)
})

ipc.on('listSessions',function(data){
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
    $('#lobby .load').click(function(e){
        e.stopPropagation()
        ipc.send('openSession',{path:$(this).data('session')})
    })
    $('#lobby a span').click(function(e){
        e.stopPropagation()
        ipc.send('removeSessionFromHistory',$(this).parent().data('session'))
        $(this).parents('li').hide()
    })
    $('#lobby .browse').click(function(e){
        e.stopPropagation()
        browseSessions()
    })
})

ipc.on('openSession',function(data){
    var session = JSON.parse(data)

    $('#lobby').remove()
    $('#container').append('<div id="loading"><div class="spinner"></div></div>')
    setTimeout(function(){
        init(session,function(){$('#loading').hide()})
    },1)

})

ipc.on('error',function(data){
    createPopup(icon('warning')+'&nbsp;'+data.title,data.text)
})
