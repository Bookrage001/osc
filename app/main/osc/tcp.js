var osc = require('osc'),
    EventEmitter = require('events').EventEmitter
	settings = require('../settings'),
	zeroconf = require('../zeroconf'),
	tcpInPort = settings.read('tcpInPort'),
    tcpTargets = settings.read('tcpTargets'),
	net = require('net')

class OscTCPClient extends EventEmitter {

    constructor(options) {

        super()

        this.options = options
        this.remoteAddress = options.address
        this.remotePort = options.port

        this.open()

    }

    open() {

        this.port = new osc.TCPSocketPort(this.options)

        this.port.on('error', (err)=>{
            console.error(err)
        })

        this.port.on('close', (hadErr)=>{
            if (!this.options.socket) {
                this.reconnect()
            } else {
                this.emit('die')
            }
        })

        this.port.on('message', (msg, timetag)=>{
            this.emit('message', msg, timetag, {address: this.remoteAddress, port: this.remotePort})
        })

        if (!this.options.socket) this.port.open()

    }

    reconnect() {

        setTimeout(()=>{
            this.open()
        }, 5000)

    }

    send(msg) {

        this.port.send(msg)

    }



}

class OscTCPServer extends EventEmitter {

    constructor() {

        super()

        this.clients = {}

    }

    bindSocket(socket) {

        this.addClient(new OscTCPClient({
            metadata: true,
            socket: socket,
            address: socket.remoteAddress.indexOf('::ffff:') === 0 ? socket.remoteAddress.replace('::ffff:', '') : socket.remoteAddress,
            port: socket.remotePort
        }))

    }

    addClient(client) {

        this.clients[client.remoteAddress] = this.clients[client.remoteAddress] || {}
        this.clients[client.remoteAddress][client.remotePort] = client

        client.on('message', (msg, timetag, info)=>{
            this.emit('message', msg, timetag, info)
        })

        client.on('die', (hadError)=>{
            if (this.clients[client.remoteAddress]) delete this.clients[client.remoteAddress][client.remotePort]
        })

    }


    open() {

        this.server = net.createServer(this.bindSocket.bind(this))
        this.server.listen({port: tcpInPort})

        for (var i in tcpTargets) {

            this.addClient(new OscTCPClient({
                metadata: true,
                address: tcpTargets[i].split(':')[0],
                port: tcpTargets[i].split(':')[1]
            }))

        }

    }
}

var oscTCPServer = new OscTCPServer()

module.exports = oscTCPServer
