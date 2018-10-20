var {PythonShell} = require('python-shell'),
    settings = require('./settings')

class Midi {

    constructor() {

        this.py = new PythonShell('midi.py', {
            scriptPath:__dirname,
            mode:'text',
            args: [
                settings.read('debug') ? 'debug' : '',
                ...settings.read('midi')
            ]
        })

    }

    send(data) {

        var args = []
        for (i in data.args) {
            args.push(data.args[i].value)
        }

        this.py.send(JSON.stringify([data.port, data.address, ...args]))

    }

    stop() {

        this.py.childProcess.kill()

    }

    init(receiveOsc) {
        this.py.on('message', function(message) {
            // console.log(message)
            var name, data
            try {
                [name, data] = JSON.parse(message)
            } catch (err) {
                // console.log(err)
            }
            if (name == 'log') {
                if (data.indexOf('ERROR') === 0) {
                    console.error(data)
                } else {
                    console.log(data)
                }
            } else if (name ==  'osc') {
                receiveOsc(data)
            } else if (name == 'error') {
                console.error('ERROR: MIDI: ' + data)
                this.stop()
            }
        })
    }

}

var midi = new Midi()

module.exports = midi
