require('./app/stacktrace')
require('./app/globals')

var {loading} = require('./app/ui/utils'),
    locales = require('./app/locales')

document.addEventListener('DOMContentLoaded', function(event) {

    DOM.init()

    LOADING = loading(locales('loading_server'))

    setTimeout(()=>{

        var ipc = require('./app/ipc/')

        ipc.init()

        require('./app/ui/init')

        ipc.send('ready', {backupId: ARGV.backupId})


    }, 100)

})
