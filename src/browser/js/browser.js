require('./app/globals')
require('./app/sourcemap')

var callbacks = require('./app/callbacks'),
    ipc = require('./app/ipc'),
    osc = require('./app/osc'),
    parser = require('./app/parser'),
    {loading} = require('./app/utils')

ipc.registerCallbacks(callbacks)
osc.init()
parser.init()

$(document).ready(function(){
    LOADING = loading('Connecting server...')
    require('./app/ui')
    ipc.send('ready')
})
