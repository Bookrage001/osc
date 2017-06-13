var io = require('socket.io-client/dist/socket.io.slim.js'),
    customParser = require('socket.io-msgpack-parser')


var Ipc = class Ipc {

    constructor() {

        this.socket = io.connect('/', {parser:customParser})

    }


    send() {

        this.socket.emit(...arguments)

    }

    on(name, fn) {


        this.socket.on(name, fn)

    }
}


var ipc = new Ipc()

module.exports = ipc
