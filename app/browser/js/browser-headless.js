webFrame = false

// mainProcess & renderProcess communication engine
// electron's ipc module is not available here, we use socket.io as a replacement
socket = require('socket.io-client')

ipc=socket.connect();
ipc.send = ipc.emit


// jquery

window.$ = window.jQuery = require('./jquery/jquery.min.js')


// third-party js libraries
require('./jquery/jquery.drag.js')
require('./jquery/jquery.resize.js')

// main js
require('./app/app.js')

ipc.send('ready')
