module.exports = function(settings) {

	// Headless (noGui) mode

	    var express     = require('express')(),
	        path        = require('path'),
	        http        = require('http'),
	        server      = http.createServer(express),
	        io          = require('socket.io')(),
	        ioWildcard  = require('socketio-wildcard')(),
	        browserify  = require('browserify'),
			ipc 		= {}

	    express.get('/', function(req, res){
	        res.sendFile(path.resolve(__dirname + '/../browser/index-headless.html'))
	    })
	    express.get('*browser-headless.js', function(req, res){
	        browserify().add(path.resolve(__dirname + '/../browser' + req.path)).bundle().pipe(res);
	    })
	    express.get('*', function(req, res){
	        res.sendFile(path.resolve(__dirname + '/../browser' + req.path))
	    })


	    io.use(ioWildcard)


	    io.listen(server);

	    server.listen(settings.noGui)

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
		            if (callbacks[name]) callbacks[name](data,socket.id)
		            if (name=='sendOsc' && data.sync!==false) {
		                // synchronize all other connected clients
		                socket.broadcast.emit('receiveOsc',data)
		            }
		        });
		    });
		}


		console.log('Headless mode: app available at http://127.0.0.1:'+settings.noGui)

		return {
			ipc:ipc,
			bindCallbacks:bindCallbacks
		}

}
