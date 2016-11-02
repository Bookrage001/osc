// destroy serialport module as it's currently unsupported and would throw when required by osc
require('vmodule')('serialport', {}, {global: true})

var osc = require('osc'),
	ipc = require('./server').ipc,
	settings = require('./settings'),
	oscInPort = settings.read('oscInPort'),
	debug = settings.read('debug'),
	vm = require('vm'),
	fs = require('fs')


var oscServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscInPort
});


var parseType = function(type){
	var t = type[0].match(/[bhtdscrmifTFNI]/)

	if (t!==null) {
		return t[0]
	} else {
		return 's'
	}

}

var parseArg = function(arg,precision){
	if (arg==null) return null
	switch (typeof arg) {
		case 'number':
			return {type: precision == 0 ? 'i' : 'f', value: arg}
		case 'boolean':
			return {type: arg ? 'T' : 'F', value: arg}
		case 'object':
			return {type: parseType(arg.type), value: arg.value}
		default:
			return {type: 's', value:String(arg)}
	}
}

var sendOsc = function(data){

	if (!data) return

	oscServer.send({
		address: data.address,
		args: data.args
	}, data.host, data.port);

	if (debug) console.log('OSC sent: ',{address:data.address, args: data.args}, 'To : ' + data.host + ':' + data.port)

}

var receiveOsc = function(data, info){

	if (!data) return

	if (data.args.length==1) data.args = data.args[0]

	ipc.send('receiveOsc',data)

	if (debug) console.log('OSC received: ', {address:data.address, args: data.args}, 'From : ' + data.address + ':' + data.port)

}

var customModule = (function(){
	if (!settings.read('customModule')) return false

	var file = (function(){try {return fs.readFileSync(settings.read('customModule'),'utf8')} catch(err) {console.log('CustomModule Error: File not found: ' + settings.read('customModule'));return false}})(),
		mod,
		context = {
			console: console,
			sendOsc: sendOsc,
			receiveOsc: receiveOsc
		}
	try {
		mod = vm.runInContext(file, vm.createContext(context))
	} catch(err) {
		console.log(err)
	}
	return mod
})()


var oscInFilter = function(data){
	if (customModule.oscInFilter) {
		return customModule.oscInFilter(data)
	} else {
		return data
	}
}
var oscOutFilter = function(data){
	if (customModule.oscOutFilter) {
		return customModule.oscOutFilter(data)
	} else {
		return data
	}
}


oscServer.on('message', function (msg, timetag, info) {
	var delay = timetag? Math.max(0,timetag.native - Date.now()) : 0,
		timer = delay ? setTimeout : setImmediate
	setTimeout(()=>{
		var data = oscInFilter({address: msg.address, args: msg.args, host: info.address, port: info.port})
		receiveOsc(data)
	}, delay)
})

oscServer.on('error', function (error) {
	console.log(error)
})

oscServer.open()


module.exports = {

	send: function(host,port,address,args,precision) {

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

		var data = oscOutFilter({address:address, args: message, host: host, port: port})

		sendOsc(data)

	}
}
