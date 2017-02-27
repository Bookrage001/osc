var PythonShell = require('python-shell'),
    path = require('path'),
    settings = require('./settings')


var py = new PythonShell(path.resolve('/main/midi.py'),{mode:'text', args: [
    settings.read('debug') ? 'debug' : '',
    ...settings.read('midi')
    ]
})


oscToMidi = (data)=>{
    var args = []
    for (i in data.args) {
        args.push(data.args[i].value)
    }
    py.send(JSON.stringify([data.port, data.address, ...args]))
}

init = (receiveOsc)=>{
    py.on('message', function (message) {
        // console.log(message)
        var name, data
        try {
            [name, data] = JSON.parse(message)
        } catch (err) {
            // console.log(err)
        }
        if (name == 'log') {
            console.log(data)
        } else if (name ==  'osc') {
            receiveOsc(data)
        }
    })
}

stop = ()=>{
    py.childProcess.kill()
}

module.exports = {
    send: oscToMidi,
    init: init,
    stop: stop
}
