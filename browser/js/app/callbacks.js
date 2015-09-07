ipc.on('receiveOsc',function(data){
    // fetch id
    var path = data.address;
    var id = $('[path="'+path+'"]').attr('widgetId');

    // update
    if (__widgets__[id]!=undefined) __widgets__[id][0].setValue(data.args,false,true)

})

ipc.on('load',function(preset){
    setState(preset)
})
