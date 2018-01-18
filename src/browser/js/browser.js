
require('./app/globals')
require('./app/sourcemap')

var ipc = require('./app/ipc/'),
    osc = require('./app/osc'),
    parser = require('./app/parser'),
    {loading} = require('./app/ui/utils')

ipc.init()
osc.init()
parser.init()

document.addEventListener("DOMContentLoaded", function(event) {

    DOM.init()
    LOADING = loading('Connecting server...')
    require('./app/ui/init')
    ipc.send('ready')

})
