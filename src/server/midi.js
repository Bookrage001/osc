var {PythonShell} = require('python-shell'),
    settings = require('./settings')

var pythonOptions = {
    scriptPath:__dirname,
    mode:'text',
}

class MidiConverter {

    constructor() {

        var pythonPath = settings.read('midi').filter(x=>x.includes('path=')).map(x=>x.split('=')[1])[0]

        this.py = new PythonShell('python/midi.py', Object.assign({
            args: [
                settings.read('debug') ? 'debug' : '',
                ...settings.read('midi')
            ],
            pythonPath
        }, pythonOptions))

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

        this.receiveOsc = receiveOsc
        this.py.on('message', (message)=>{
            MidiConverter.parseIpc(message, this)
        })

    }

    static parseIpc(message, instance) {

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
            instance.receiveOsc(data)
        } else if (name == 'error') {
            console.error('ERROR: MIDI: ' + data)
            if (instance) instance.stop()
        }

    }

    static list() {

        var pythonPath = settings.read('midi') ? settings.read('midi').filter(x=>x.includes('path=')).map(x=>x.split('=')[1])[0] : undefined

        PythonShell.run('python/list.py', Object.assign({pythonPath}, pythonOptions), function(err, results) {
            if (err) console.error(err)
            MidiConverter.parseIpc(results)
        })

    }

}

module.exports = MidiConverter
