var osc = require('osc/src/osc.js'),
    transports = require('osc/src/platforms/osc-node.js'),
    utf8 = require('utf8')

osc.UDPPort = transports.UDPPort
osc.TCPSocketPort = transports.TCPSocketPort

osc.writeUtfString = (str)=>{
    return osc.writeString(utf8.encode(str))
}

osc.readUtfString = (dv, offsetState)=>{
    return utf8.decode(osc.readString(dv, offsetState))
}

osc.argumentTypes.s = osc.argumentTypes.S = {
    reader: 'readUtfString',
    writer: 'writeUtfString'
}

module.exports = osc
