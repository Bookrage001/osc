var EventEmitter = require('wolfy87-eventemitter'),
    uuid = require('shortid').generate()

var reconnectInterval = 5000,
    hearbeatInterval = 25000,
    hearbeatTimeout = 5000

class Ipc extends EventEmitter {

    constructor() {

        super()

        this.socket = null
        this.connected = false

        this.queue = []

        this.reconnect = undefined

        this.hearbeat = undefined
        this.hearbeatTimeout = undefined
        this.on('pong', ()=>{
            this.hearbeatTimeout = clearTimeout(this.hearbeatTimeout)
        })
        this.on('ping', ()=>{
            this.socket.send(`["pong"]`)
        })

        this.open()

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

    close() {

        this.socket = null

        this.connected = false

        this.hearbeat = clearInterval(this.hearbeat)
        this.hearbeatTimeout = clearTimeout(this.hearbeatTimeout)

        if (!this.reconnect) {
            this.reconnect = setInterval(()=>{
                this.open()
            }, reconnectInterval)
        }

    }

    open() {

        this.socket = new WebSocket('ws://' + window.location.host + '/' + uuid)

        this.socket.onopen = (e)=>{

            this.connected = true

            this.reconnect = clearInterval(this.reconnect)

            this.hearbeat = setInterval(()=>{
                this.socket.send(`["ping"]`)
                this.hearbeatTimeout = setTimeout(()=>{
                    this.socket.close()
                }, hearbeatTimeout)
            }, hearbeatInterval)

            this.trigger('connect')
            this.flush()

        }

        this.socket.onmessage = (e)=>{
            this.receive(e.data)
        }

        this.socket.onclose = (e)=>{
            this.close()
        }

        this.socket.onerror = (e)=>{
            this.close()
        }

    }

    receive(message) {

        if (typeof message == 'string') {

            var packet = JSON.parse(message);

            if (Array.isArray(packet) && typeof packet[0] == "string") {

                this.emit(packet[0], packet[1])

            }

        }

    }

    send(event, data) {

        var packet = JSON.stringify([event, data])

        if (this.connected) {
            this.socket.send(packet)
        } else {
            this.queue.push(packet)
        }

    }

    flush(){

        for (var i in this.queue) {

            this.socket.send(this.queue[i])

        }

        this.queue = []

    }

}

var ipc = new Ipc()

module.exports = ipc
