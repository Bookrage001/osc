// destroy serialport module
// (electron-rebuild breaks it for node-only mode)
require('vmodule')('serialport', {}, {global: true})

var osc = require('osc'),
	ipc = require('./server').ipc,
	settings = require('./settings'),
	oscInPort = settings.read('oscInPort') || settings.read('httpPort'),
	debug = settings.read('debug'),
	vm = require('vm'),
	fs = require('fs'),
    midi = settings.read('midi') ? require('./midi') : false

var oscServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: oscInPort,
	metadata: true
})


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
			return {type: precision == 0 ? 'i' : 'f', value: parseFloat(arg.toFixed(precision))}
		case 'boolean':
			return {type: arg ? 'T' : 'F', value: arg}
		case 'object':
		     if (arg.type) {
                 return {type: parseType(arg.type), value: arg.value}
             } else {
                 return {type: 's', value:JSON.stringify(arg)}
             }
        case 'string':
            return {type: 's', value:arg}
		default:
			return {type: 's', value:JSON.stringify(arg)}
	}
}

var sendOsc = function(data){

	if (!data) return

    if (data.host == 'midi') {

        if (midi) midi.send(data)

    } else {

        oscServer.send({
            address: data.address,
            args: data.args
        }, data.host, data.port)

        if (debug) console.log('OSC sent: ',{address:data.address, args: data.args}, 'To : ' + data.host + ':' + data.port)
    }


}

// var receiveOscQueue = []

var receiveOsc = function(data, info){

	if (!data) return

    for (i in data.args) {
        data.args[i] = data.args[i].value
    }

	if (data.args.length==1) data.args = data.args[0]

	// receiveOscQueue.push(data)

	ipc.send('receiveOsc',data)

	if (debug) console.log('OSC received: ', {address:data.address, args: data.args}, 'From : ' + data.host + ':' + data.port)

}

// setInterval(()=>{
//
// 	if (receiveOscQueue.length > 0) {
// 		ipc.send('bundle',receiveOscQueue)
// 		receiveOscQueue = []
// 	}
//
// }, 5)


var customModule = (function(){

	if (!settings.read('customModule')) return false

	var file = (function(){
			try {
				return fs.readFileSync(settings.read('customModule'),'utf8')
			} catch(err) {
				console.log('CustomModule Error: File not found: ' + settings.read('customModule'))
				return false
			}
		})(),
		mod,
		context = {
			console: console,
			sendOsc: sendOsc,
			receiveOsc: receiveOsc,
            setTimeout: setTimeout,
            settings: settings
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

var oscInHandler = function(msg, timetag, info){
	var data = oscInFilter({address: msg.address, args: msg.args, host: info.address, port: info.port})
    if (!data) return
	receiveOsc(data)
}

oscServer.on('message', function (msg, timetag, info) {
	var delay = timetag? Math.max(0,timetag.native - Date.now()) : 0
	if (delay) {
		setTimeout(()=>{
			oscInHandler(msg, timetag, info)
		}, delay)
	} else {
		oscInHandler(msg, timetag, info)
	}
})

oscServer.on('error', function (error) {
	console.log(error)
})

oscServer.open()

if (customModule.init) {
    customModule.init()
}

if (midi) midi.init(receiveOsc)

module.exports = {

	send: function(host,port,address,args,precision) {

	    var message = []

        if (!Array.isArray(args)) args = [args]
	    if (typeof args=='object' && args!==null) {
	        for (var i in args) {
	            var arg = parseArg(args[i],precision)
				if (arg!=null) message.push(arg)
	        }
	    }

		var data = oscOutFilter({address:address, args: message, host: host, port: port})

		sendOsc(data)

	},
    midi:midi
}
