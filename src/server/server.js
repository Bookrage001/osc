var path        = require('path'),
    send        = require('send'),
    http        = require('http'),
    server      = http.createServer(httpRoute),
    Ipc         = require('./ipc/server'),
    ipc         = new Ipc(server),
    settings     = require('./settings'),
    theme       = require('./theme').init(),
    zeroconf = require('./zeroconf'),
    appAddresses = settings.read('appAddresses'),
    osc = {},
    clients = {}

function httpRoute(req, res) {
    res.sendFile = (path)=>{
        send(req, path).pipe(res)
    }

    if (req.url === '/' || req.url.indexOf('/?') === 0) {
        res.sendFile(path.resolve(__dirname + '/../client/index.html'))
    } else {
        if (req.url.indexOf('theme.css') != -1) {
            res.setHeader('Content-Type', 'text/css')
            if (settings.read('theme')) {
                var str = theme.get(),
                    buf = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from(str) : new Buffer(str)
                res.write(buf)
            } else {
                res.write('')
            }
            res.end()
        } else if (/^\/(assets|client)\//.test(req.url)){
            res.sendFile(path.resolve(__dirname + '/..' + req.url))
        } else {
            res.sendFile(path.resolve(req.url))
        }
    }
}

server.listen(settings.read('httpPort'))

zeroconf.publish({
    name: settings.read('appName') + (settings.read('instanceName') ? ' (' + settings.read('instanceName') + ')' : ''),
    type: 'http',
    port: settings.read('httpPort')
}).on('error', (e)=>{
    console.error(`Error: Zeroconf: ${e.message}`)
})

var bindCallbacks = function(callbacks) {

    ipc.on('connection', function(client) {

        for (let name in callbacks) {
            client.on(name, (data)=>{
                if (osc.customModule) {
                    osc.customModuleEventEmitter.emit(name, data, client.id)
                }
                callbacks[name](data, client.id)
            })
        }

        client.on('close', function() {

            callbacks.removeClientWidgets(client.id)

        })

    })

}

console.log('App available at ' + appAddresses.join(' & '))

module.exports =  {
    ipc:ipc,
    bindCallbacks:bindCallbacks,
    clients:clients
}

osc = require('./osc').server
