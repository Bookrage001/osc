
ipc.on('receiveOsc',function(event,data){
    var data = data || event

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

ipc.on('stateLoad',function(event,data){
    var data = data || event
    stateSet(data,true)
    stateQuickSave(data)
})

ipc.on('sessionList',function(event,data){
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
        ipc.send('sessionOpen',{path:$(this).data('session')})
    })
    $('#lobby a span').click(function(e){
        e.stopPropagation()
        ipc.send('removeSessionFromHistory',$(this).parent().data('session'))
        $(this).parents('li').hide()
    })
    $('#lobby .browse').click(function(e){
        e.stopPropagation()
        sessionBrowse()
    })
    $('#lobby .new').click(function(e){
        e.stopPropagation()
        $('#lobby').remove()
        setTimeout(function(){
            init([{}],function(){$('#open-toggle').click()})
        },25)
    })
})

ipc.on('sessionOpen',function(event,data){
    var data = data || event
    var session = JSON.parse(data)

    $('#lobby').remove()
    $('#container').append('<div id="loading"><div class="spinner"></div></div>')
    setTimeout(function(){
        init(session,function(){$('#loading').hide()})
    },25)

})

ipc.on('error',function(event,data){
    var data = data || event
    
    createPopup(icon('warning')+'&nbsp;'+data.title,data.text)
})
