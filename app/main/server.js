var express     = require('express')(),
    path        = require('path'),
    http        = require('http'),
    server      = http.createServer(express),
    io          = require('socket.io')(server, {transports:['websocket']}),
    ipc 		= {},
	settings	= require('./settings'),
    zeroconf = require('./zeroconf'),
    appAddresses = settings.read('appAddresses'),
    clients = {}

express.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../browser/index.html'))
})

express.get('*', function(req, res){
    if (req.path.indexOf('theme.css') != -1) {
        res.set('Content-Type', 'text/css');
        if (settings.read('theme')) {
            res.send(new Buffer(settings.read('theme')))
        } else {
            res.send('')
        }
    } else if (req.path.indexOf('browser/') != -1){
        res.sendFile(path.resolve(__dirname + '/..' + req.path))
    } else {
        res.sendFile(path.resolve(req.path))
    }
})

server.listen(settings.read('httpPort'))

zeroconf.publish({
	name: settings.read('appName') + (settings.read('instanceName') ? ' (' + settings.read('instanceName') + ')' : ''),
	type: 'http',
	port: settings.read('httpPort')
}).on('error', (e)=>{
    console.error(`Error: Zeroconf: ${e.message}`)
 })

ipc.send = function(name,data,clientId) {
    if (clientId) {
        io.to(clientId).emit(name,data)
    } else {
        io.emit(name,data)
    }
}

var bindCallbacks = function(callbacks) {
    io.on('connection', function(socket) {

        clients[socket.id] = socket

        for (let name in callbacks) {
            socket.on(name, (data)=>{
                callbacks[name](data,socket.id)
            })
        }

        socket.on('disconnect', function() {

            callbacks.removeClientWidgets(socket.id)

        })

    })
}



console.log('App available at ' + appAddresses.join(' & '))

module.exports =  {
	ipc:ipc,
	bindCallbacks:bindCallbacks,
    clients:clients
}
