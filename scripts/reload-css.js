var socket = require('socket.io-client'),
    customParser= require('socket.io-msgpack-parser')

var ipc = socket.connect('http://127.0.0.1:8080', {parser:customParser})
ipc.emit('reloadCss')
setTimeout(process.exit,500)
