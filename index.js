// dependencies
var app = require('express')()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , osc = require("osc");

// static files serving
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/lib-dev/index.html');
});

// localhost:1337 
server.listen(1337)

// osc event listener
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 6666
});



udpPort.open();



// IO socket between node server and web app
io.sockets.on('connection', function (socket) {
    socket.on('sendOsc', function (data) {
        udpPort.send({
            address: data.path,
            args: data.args
        }, data.host, data.port);


    });
    
    udpPort.on("message", function (data) {
        socket.emit('receiveOsc',data);
    });
    
    
    
});





