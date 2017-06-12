var worker = require('webworkify')

var Ipc = class Ipc {

    constructor() {

        this.callbacks = {}

        this.worker = worker(require('./ipc-worker'))
        this.worker.addEventListener('message', (ev)=>{

            var [name, data] = ev.data

            if (this.callbacks[name]) this.callbacks[name](data)

        })

        this.worker.postMessage(['connect', window.location.href])

    }

    send(name, data) {

        this.worker.postMessage(['send', [name, data]])

    }

    on(name, fn) {

        this.callbacks[name] = fn
        this.worker.postMessage(['on', name])

    }
}


var ipc = new Ipc()

module.exports = ipc
