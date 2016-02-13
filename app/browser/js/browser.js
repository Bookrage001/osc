webFrame = require('web-frame')

// mainProcess & renderProcess communication engine
ipc = require('ipc-renderer')

// jquery
window.$ = window.jQuery = require('./jquery/jquery.min.js')


// third-party js libraries
require('./jquery/jquery.sortable.js')
require('./jquery/jquery.drag.js')
require('./jquery/jquery.resize.js')
require('./jquery/jquery.resizable.js')

// main js
require('./app/app.js')

ipc.send('ready')
