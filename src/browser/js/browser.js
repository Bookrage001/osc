require('./app/globals')
require('./app/sourcemap')

var callbacks = require('./app/callbacks'),
    ipc = require('./app/ipc'),
    osc = require('./app/osc')

ipc.registerCallbacks(callbacks)
osc.init()

$(document).ready(function(){
    window.LOADING = require('./app/utils').loading('Connecting server...')
    require('./app/ui')
    ipc.send('ready')
})
