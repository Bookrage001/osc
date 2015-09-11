
ipc.on('receiveOsc',function(data){
    // fetch id
    var path = data.address;
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
        $('#lobby .list').append('<li><a class="btn" data-session="'+i+'">'+data[i]+'<span>'+icon('remove')+'</span></a></li>')
    }
    $('#lobby .list').append('<a class="btn" data-session="browse">...</a>')
    $('#lobby a').click(function(){
        ipc.send('loadSession',$(this).data('session'))
    })
    $('#lobby a span').click(function(e){
        ipc.send('removeSessionFromHistory',$(this).parent().data('session'))
        $(this).parents('li').hide()
        e.stopPropagation()
    })
})


ipc.on('openSession',function(data){
    TABS=false
    require(data)
    if (TABS!=false) {
        $('#lobby').hide()
        $('#container').append('<div id="loading"><div class="spinner"></div></div>')
        setTimeout(function(){
            init(function(){$('#loading').hide()});
        },1)

    } else {
        console.log('ERROR: invalid session file (TABS must be defined)')
    }
})
