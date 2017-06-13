var io = require('socket.io-client/dist/socket.io.slim.js'),
    customParser = require('socket.io-msgpack-parser')


var Ipc = class Ipc {

    constructor() {

        this.queue = []
        this.socket = io.connect('/', {parser:customParser})

        setInterval(this.flush.bind(this), 5)



    }


    flush() {

        if (this.queue.length) {

            for (let msg of this.queue) {

                this.socket.emit(...msg)
            }
            this.queue = []
        }

    }

    send() {

        this.queue.push(arguments)

    }

    on(name, fn) {


        this.socket.on(name, fn)

    }
}


var ipc = new Ipc()

module.exports = ipc
