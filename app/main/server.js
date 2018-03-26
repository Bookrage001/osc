var express     = require('express')(),
    path        = require('path'),
    http        = require('http'),
    server      = http.createServer(express),
    Ipc         = require('./ipc/server')
    ipc         = new Ipc(server),
	settings	= require('./settings'),
    theme       = require('./theme').init(),
    zeroconf = require('./zeroconf'),
    appAddresses = settings.read('appAddresses'),
    clients = {}

express.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname + '/../browser/index.html'))
})

express.get('*', function(req, res){
    if (req.path.indexOf('theme.css') != -1) {
        res.set('Content-Type', 'text/css');
        if (settings.read('theme')) {
            res.send(new Buffer(theme.get()))
        } else {
            res.send('')
        }
    } else if (req.path.indexOf('browser/') != -1){
        res.sendFile(path.resolve(__dirname + '/..' + req.path))
    } else {
        res.sendFile(path.resolve(req.path))
    }
})

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
                callbacks[name](data, client.id)
            })
        }

        client.on('close', function() {

            callbacks.removeClientWidgets(client.id)

        })

    })

}

// video streams

var rtsp = require('rtsp-ffmpeg'),
    urls = settings.read('videoStreams'),
    streams = {},
    framerate = 10,
    resolution = undefined

for (var i in urls) {
    if (/framerate\s*=\s*[0-9]+/.test(urls[i])) {
        framerate = Math.max(Math.min(parseInt(urls[i].split('=').pop()), 60), 0)
    }
    if (/resolution\s*=\s*[0-9]+x[0-9]+/.test(urls[i])) {
        resolution = urls[i].split('=').pop().trim()
    }
}

urls = urls.filter(item => item.indexOf('rtsp://') > -1)

for (let i = 0; i < urls.length; i++) {
    streams[i] = new rtsp.FFMpeg({
        input: urls[i],
        rate: framerate,
        resolution: resolution,
    })
    streams[i].on('data', (data)=>{
        ipc.send('video', [i, data.toString('base64')])
    })
}

///

console.log('App available at ' + appAddresses.join(' & '))

module.exports =  {
	ipc:ipc,
	bindCallbacks:bindCallbacks,
    clients:clients
}
