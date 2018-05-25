var osc = require('osc'),
	settings = require('../settings'),
	zeroconf = require('../zeroconf'),
	oscInPort = settings.read('oscInPort') || settings.read('httpPort')

var oscUDPServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscInPort,
	metadata: true,
	broadcast: true
})

oscUDPServer.on('error', function(error) {
    console.error(error)
})

zeroconf.publish({
	name: settings.read('appName') + (settings.read('instanceName') ? ' (' + settings.read('instanceName') + ')' : ''),
	protocol: 'udp',
	type: 'osc',
	port: oscInPort
}).on('error', (e)=>{
    console.error(`Error: Zeroconf: ${e.message}`)
})

module.exports = oscUDPServer
