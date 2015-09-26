
// mainProcess & renderProcess communication engine
ipc = require('ipc')

// filesystem
fs = require('fs')

// jquery
window.$ = window.jQuery = require('./jquery/jquery.min.js')



// third-party js libraries
require('./jquery/jquery.event.drag-2.2.js')
require('./jquery/jquery.ba-resize.js')

// main js
require('./app/app.js')

ipc.send('ready')
