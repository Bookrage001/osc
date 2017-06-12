var io = require('socket.io-client/dist/socket.io.slim.js')

var IpcWorker = class IpcWorker {

    constructor(worker) {
        
        this.worker = worker
        this.queue = []
        this.socket = null

        this.worker.addEventListener('message', (e)=>{

            var [name, data] = e.data

            if (name == 'on') {

                this.socket.on(data, (message)=>{
                    this.worker.postMessage([data, message])
                })

            } else if (name == 'send'){

                this.queue.push(data)

            } else if (name == 'connect') {

                this.socket = io.connect(data)

            }

        })

        setInterval(this.flush.bind(this), 20)

    }

    flush() {

        if (this.queue.length && this.socket !== null) {

            for (let msg of this.queue) {

                this.socket.emit(...msg)
            }
            this.queue = []
        }

    }

}


module.exports = (worker)=>{

    return new IpcWorker(worker)

}
