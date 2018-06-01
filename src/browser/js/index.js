require('./app/stacktrace')

require('./app/globals')

var {loading} = require('./app/ui/utils')

document.addEventListener('DOMContentLoaded', function(event) {

    DOM.init()

    LOADING = loading('Connecting server...')

    setTimeout(()=>{

        var ipc = require('./app/ipc/')

        ipc.init()

        require('./app/ui/init')
        ipc.send('ready')


    }, 100)

})
