require('./app/globals')
require('./app/sourcemap')

var {loading} = require('./app/ui/utils')

document.addEventListener("DOMContentLoaded", function(event) {

    DOM.init()

    LOADING = loading('Connecting server...')

    setTimeout(()=>{

        var ipc = require('./app/ipc/'),
            osc = require('./app/osc'),
            parser = require('./app/parser')

        ipc.init()
        osc.init()
        parser.init()

        require('./app/ui/init')
        ipc.send('ready')


    }, 50)

})
