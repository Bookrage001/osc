WEBFRAME = false

// mainProcess & renderProcess communication engine
// electron's ipc module is not available here, we use socket.io as a replacement
var socket = require('socket.io-client')

IPC = socket.connect()
IPC.send = IPC.emit


require('./app')
