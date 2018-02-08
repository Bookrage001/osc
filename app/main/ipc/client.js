var EventEmitter = require('events').EventEmitter

var hearbeatInterval = 25000,
    hearbeatTimeout = 5000,
    dieTimeout = 60000

class Socket extends EventEmitter {

    constructor(ws, id) {

        super()

        this.id = id
        this.socket = null

        this.queue = []

        this.hearbeat = undefined
        this.hearbeatTimeout = undefined
        this.on('pong', ()=>{
            this.hearbeatTimeout = clearTimeout(this.hearbeatTimeout)
        })
        this.on('ping', ()=>{
            this.socket.send(`["pong"]`)
        })

        this.dieTimeout = undefined

        this.open(ws)

    }

    open(ws) {

        this.socket = ws

        this.socket.onmessage = (e)=>{
            this.receive(e.data)
        }

        this.socket.onclose = ()=>{
            console.log('close')
            this.close()
        }

        this.socket.onerror = ()=>{
            console.log('error')
            this.close()
        }

        this.dieTimeout = clearTimeout(this.dieTimeout)

        this.hearbeat = setInterval(()=>{
            this.socket.send(`["ping"]`)
            this.hearbeatTimeout = setTimeout(()=>{
                this.socket.close()
            }, hearbeatTimeout)
        }, hearbeatInterval)

    }

    close() {

        this.hearbeat = clearInterval(this.hearbeat)

        this.dieTimeout = setTimeout(()=>{

            this.emit('close')

        }, dieTimeout)

    }

    connected() {

        return this.socket.readyState == this.socket.OPEN

    }

    receive(message) {

        if (typeof message == 'string') {

            var packet = JSON.parse(message)

            if (Array.isArray(packet) && typeof packet[0] == "string") {

                this.emit(packet[0], packet[1])

            }

        }

    }

    send(event, data) {

        var packet = JSON.stringify([event, data])

        if (this.connected()) {
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

module.exports = Socket
