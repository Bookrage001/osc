var osc = require('node-osc')

module.exports = function(ipc, settings) {

	if (settings.read('oscInPort')) {
	    var oscServer = new osc.Server(settings.read('oscInPort'), '127.0.0.1')

	    oscServer.on('message', function (msg, rinfo) {
	        var data = {path:msg.shift(),args:msg}
	        if (data.args.length==1) data.args = data.args[0]
	        ipc.send('receiveOsc',data)
	    })
	}

	return {
		send: function(host,port,path,args,precision) {

		    var client = new osc.Client(host, port)

		    var message = new osc.Message(path)

		    var numberType = precision==0?'integer':'float'

		    if (typeof args=='object') {
		        for (i in args) {
		            var arg = args[i]
		            if (typeof arg == 'number') {
		                message.append({type:numberType,value:arg})
		            } else {
		                message.append({type:'string',value:arg})
		            }
		        }
		    } else {
		        if (typeof args == 'number') {
		            message.append({type:numberType,value:args})
		        } else {
		            message.append({type:'string',value:args})
		        }
		    }

		    client.send(message, function () {
		      client.kill()
		    })
		}
	}

}
