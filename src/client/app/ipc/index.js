var EventEmitter = require('../events/event-emitter'),
    uuid = require('nanoid/generate')('0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ', 10),
    notifications,
    locales

setTimeout(()=>{
    notifications = require('../ui/notifications')
    locales = require('../locales')
})

var reconnectTimeout = 1000,
    hearbeatInterval = 2000,
    hearbeatTimeout = 1000,
    protocol = document.location.protocol === 'https:' ? 'wss://' : 'ws://'

class Ipc extends EventEmitter {

    constructor() {

        super()

        this.socket = null

        this.queue = []

        this.disconnected = false
        this.reconnect = undefined

        this.hearbeat = undefined
        this.hearbeatTimeout = undefined
        this.on('pong', ()=>{
            clearTimeout(this.hearbeatTimeout)
        })
        this.on('ping', ()=>{
            this.socket.send('["pong"]')
        })

        document.cookie = 'client_id=' + uuid

        try {
            this.open()
        } catch(e) {
            console.warn('Could not open a WebSocket connection')
            console.log(e)
        }


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

    open() {

        this.socket = new WebSocket(protocol + window.location.host + '/' + uuid)

        this.socket.onclose = this.socket.onerror = ()=>{
            if (!this.connected()) this.close()
        }

        this.socket.onopen = (e)=>{

            this.hearbeat = setInterval(()=>{
                if (!this.connected()) return
                this.socket.send('["ping"]')
                this.hearbeatTimeout = setTimeout(()=>{
                    if (this.connected()) this.close()
                }, hearbeatTimeout)
            }, hearbeatInterval)

            if (notifications && this.disconnected) notifications.add({
                icon: 'wifi',
                message: locales('server_connected'),
                id: 'ipc_state'
            })

            this.trigger('connect')
            this.flush()

            this.socket.onmessage = (e)=>{
                this.receive(e.data)
            }

        }

    }

    close() {

        this.socket.onclose = this.socket.onerror = null

        this.socket.close()

        this.socket = null

        clearInterval(this.hearbeat)
        clearTimeout(this.hearbeatTimeout)

        notifications.add({
            icon: 'wifi',
            class: 'error',
            message: locales('server_disconnected'),
            id: 'ipc_state',
            duration: Infinity
        })

        this.disconnected = true

        clearTimeout(this.reconnect)
        this.reconnect = setTimeout(()=>{
            this.open()
        }, reconnectTimeout)

    }

    connected() {

        return this.socket && this.socket.readyState == this.socket.OPEN

    }

    receive(message) {

        if (typeof message == 'string') {

            var packet = JSON.parse(message)

            if (Array.isArray(packet) && typeof packet[0] == 'string') {

                this.trigger(packet[0], packet[1])

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

            if (this.connected()) this.socket.send(this.queue[i])

        }

        this.queue = []

    }

}

var ipc = new Ipc()

module.exports = ipc
