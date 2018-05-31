var osc = require('osc'),
    EventEmitter = require('events').EventEmitter
    settings = require('../settings'),
    debug = settings.read('debug'),
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
            console.error(`TCP: Error: ${err.message}`)
        })

        this.port.on('close', (hadErr)=>{
            console.log(`TCP: connection closed (${this.remoteAddress}:${this.remotePort})`)
            if (!this.options.socket) {
                console.log(`TCP: attempting reconnection in 5s (${this.remoteAddress}:${this.remotePort})`)
                this.reconnect()
            } else {
                this.emit('die')
            }
        })

        this.port.on('message', (msg, timetag)=>{
            this.emit('message', msg, timetag, {address: this.remoteAddress, port: this.remotePort})
        })

        this.port.on('ready', ()=>{
            console.log(`TCP: connection established (${this.remoteAddress}:${this.remotePort})`)
        })

        if (!this.options.socket) {

            this.port.open()

        } else {

            this.port.emit('ready')

        }

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

        zeroconf.publish({
        	name: settings.read('appName') + (settings.read('instanceName') ? ' (' + settings.read('instanceName') + ')' : ''),
        	protocol: 'tcp',
        	type: 'osc',
        	port: tcpInPort
        }).on('error', (e)=>{
            console.error(`Error: Zeroconf: ${e.message}`)
        })


    }
}

var oscTCPServer = new OscTCPServer()

module.exports = oscTCPServer
