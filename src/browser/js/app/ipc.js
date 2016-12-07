var socket = require('socket.io-client')

var Ipc = function(){

    this.socket = socket.connect()

}

Ipc.prototype.send = function(){
    return this.socket.emit(...arguments)
}

Ipc.prototype.on = function(){
    return this.socket.on(...arguments)
}

var ipc = new Ipc()

module.exports = ipc
