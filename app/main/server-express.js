
var express     = require('express')(),
    path        = require('path'),
    http        = require('http'),
    server      = http.createServer(express),
    io          = require('socket.io')(),
    ioWildcard  = require('socketio-wildcard')(),
	ifaces		= require('os').networkInterfaces(),
    ipc 		= {},
	settings	= require('./settings')

express.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../browser/index-headless.html'))
})
express.get('*', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../browser' + req.path))
})


io.use(ioWildcard)


io.listen(server);

server.listen(settings.read('httpPort'))

ipc.send = function(name,data,clientId) {
    if (clientId) {
        io.to(clientId).emit(name,data)
    } else {
        io.emit(name,data)
    }
}

var bindCallbacks = function(callbacks) {
    io.on('connection', function(socket) {
        socket.on('*', function(e){
            var name = e.data[0],
                data = e.data[1]

			if ((name=='sendOsc' && data.sync!==false) || name=='syncOsc') {
				// synchronize all other connected clients
				socket.broadcast.emit('receiveOsc',data)
			}
			if (name=='sessionOpened') {
				// synchronize all other connected clients
				socket.broadcast.emit('stateSend',data)
			}

            if (callbacks[name]) callbacks[name](data,socket.id)
        });
    });
}

var appAddresses = []

Object.keys(ifaces).forEach(function (ifname) {
	for (i=0;i<ifaces[ifname].length;i++) {
		if (ifaces[ifname][i].family == 'IPv4') {
			appAddresses.push('http://' + ifaces[ifname][i].address + ':' + settings.read('httpPort'))
		}
	}
})


console.log('App available at ' + appAddresses.join(' & '))

module.exports =  {
	ipc:ipc,
	bindCallbacks:bindCallbacks
}
