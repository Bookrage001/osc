var io = require('socket.io-client/dist/socket.io.slim.js')


var Ipc = class Ipc {

    constructor() {

        this.socket = io.connect('/', {transports: ['websocket'], upgrade: false})
        this.socket.compress(false)

    }


    send(event, data) {

        this.socket.emit(event, data)

    }

    on(name, fn) {


        this.socket.on(name, fn)

    }

    init() {

        var callbacks = require('./callbacks')

        for (let i in callbacks) {
            let callback = callbacks[i]
            this.on(i, (data)=>{
                callback(data)
            })
        }

    }
}


var ipc = new Ipc()

module.exports = ipc
