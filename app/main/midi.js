var PythonShell = require('python-shell'),
    path = require('path'),
    settings = require('./settings')


var py = new PythonShell(path.resolve('/main/midi.py'),{mode:'text', args: settings.read('midi')})


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

        try {
            message = JSON.parse(message)
            // console.log(JSON.parse(message))
        } catch (err) {
            // console.log(err)
        }
        if (message.log) {
            console.log(message.log)
        } else if (message.osc) {
            receiveOsc(message.osc)
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
