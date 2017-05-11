var socket = require('socket.io-client/dist/socket.io.slim.js')

var Ipc = function(){

    this.socket = socket.connect()

}

Ipc.prototype.send = function(){
    return this.socket.emit.apply(this.socket, arguments)
}

Ipc.prototype.on = function(){
    return this.socket.on.apply(this.socket, arguments)
}

var ipc = new Ipc()

module.exports = ipc
