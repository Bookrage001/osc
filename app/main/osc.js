var osc = require('node-osc'),
	ipc = require('./server-express').ipc,
	settings = require('./settings'),
	oscInPort = settings.read('oscInPort'),
	debug = settings.read('debug')

if (oscInPort) {

    var oscServer = new osc.Server(oscInPort, '127.0.0.1')

    oscServer.on('message', function (msg, rinfo) {
        var data = {path:msg.shift(),args:msg}
        if (data.args.length==1) data.args = data.args[0]
        ipc.send('receiveOsc',data)
		if (debug) console.log('OSC received: ',data, 'From : ' + rinfo.address + ':' + rinfo.port)
    })

}

module.exports = {

	send: function(host,port,path,args,precision) {

	    var client = new osc.Client(host, port)

		client._sock.bind({exclusive:false,reuseAddr:true,port:oscInPort},function(){


		    var message = new osc.Message(path)

		    var numberType = precision==0?'integer':'float'

		    if (typeof args=='object' && args!==null) {
		        for (i in args) {
		            var arg = args[i]
		            if (typeof arg == 'number' && arg!==null && typeof arg != 'object') {
		                message.append({type:numberType,value:arg})
		            } else if (typeof arg == "boolean") {
						message.append({type:"boolean",value:arg})
					} else if (arg!==null && typeof arg != 'object'){
		                message.append({type:'string',value:String(arg)})
		            } else if (arg!==null && typeof arg == 'object' && arg.type && arg.value!=undefined) {
						message.append({type:arg.type,value:arg.value})
					}
		        }
		    } else if (args!==null){
		        if (typeof args == 'number') {
		            message.append({type:numberType,value:args})
		        } else if (typeof args == "boolean") {
					message.append({type:"boolean",value:args})
				} else if (typeof args == 'object'  && arg.type && arg.value!=undefined) {
					message.append({type:args.type,value:args.value})
		        } else {
		            message.append({type:'string',value:String(args)})
		        }
		    }

		    client.send(message, function () {
		      client.kill()
		    })

			if (debug) console.log('OSC sent: ',{path:path,args:message.args}, 'To : ' + host + ':' + port)

		})

	}
}
