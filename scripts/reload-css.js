var socket = require('socket.io-client')

var ipc = socket.connect('http://127.0.0.1:8080', {transports:['websocket']})
ipc.emit('reloadCss')
setTimeout(process.exit,500)
