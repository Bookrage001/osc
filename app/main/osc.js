// destroy serialport module as it's currently unsupported and would throw when required by osc
require('vmodule')('serialport', {}, {global: true})

var osc = require('osc'),
	ipc = require('./server').ipc,
	settings = require('./settings'),
	oscInPort = settings.read('oscInPort'),
	debug = settings.read('debug')


var oscServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscInPort
});


oscServer.on('message', function (msg, bundle, info) {
    var data = {path: msg.address, args: msg.args}
    if (data.args.length==1) data.args = data.args[0]
    ipc.send('receiveOsc',data)
	if (debug) console.log('OSC received: ',data, 'From : ' + info.address + ':' + info.port)
})

oscServer.on('error', function (error) {
	console.log(error)
})

oscServer.open()


var parseArg = function(arg,precision){
	if (arg==null) return null
	switch (typeof arg) {
		case 'number':
			return {type: precision == 0 ? 'i' : 'f', value: arg}
		case 'boolean':
			return {type: arg ? 'T' : 'F', value: arg}
		case 'object':
			return {type: arg.type, value: arg.value}
		default:
			return {type: 'string', value:String(arg)}
	}
}

module.exports = {

	send: function(host,port,path,args,precision) {

	    var message = []

	    if (typeof args=='object' && args!==null) {
	        for (i in args) {
	            var arg = parseArg(args[i],precision)
				if (arg!=null) message.push(arg)
	        }
	    } else if (args!==null){
			var arg = parseArg(args[i],precision)
			if (arg!=null) message.push(arg)
	    }

		oscServer.send({
		    address: path,
		    args: message
		}, host, port);

		if (debug) console.log('OSC sent: ',{path:path,args:message}, 'To : ' + host + ':' + port)

	}
}
