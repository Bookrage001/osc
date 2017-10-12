var {widgetManager} = require('./managers'),
    ipc = require('./ipc'),
    actions = require('./actions')

var Osc = function(){

    this.syncOnly = false
    this.remoteControl = ()=>{console.error('remote-control module not loaded')}

}

Osc.prototype.init = function(data) {
    this.remoteControl = require('./remote-control')
}

Osc.prototype.send = function(data) {

    if (this.syncOnly) {

        this.sync(data)

    } else {

        ipc.send('sendOsc', data)

    }

}

Osc.prototype.sync = function(data) {

    ipc.send('syncOsc', data)

}

Osc.prototype.receive = function(data){

    if (this.remoteControl.exists(data.address)) this.remoteControl.exec(data.address, data.args)

    // fetch ids corresponding to the osc address
    var address = data.address,
        addressref = address,
        args = data.args,
        target = data.target

    if (typeof data.args == 'object' && data.args != null) {
        for (var i=data.args.length-1;i>=0;i--) {

            var ref = widgetManager.createAddressRef(null, data.args.slice(0,i), address)

            if (widgetManager.getWidgetByAddress(ref).length) {
                addressref = ref
                args = data.args.slice(i,data.args.length)
                break
            }

        }
    } else {
        args = data.args
    }


    if (args == null || args.length==0) args = null
    else if (args.length==1) args = args[0]


    let widget = widgetManager.getWidgetByAddress(addressref)

    for (let i in widget) {
        let widgetTarget = widget[i].getProp('target')
        // if the message target is provided (when message comes from another client connected to the same server)
        // then we only update the widgets that have the same target
        // compare arrays using > and < operators (both false = equality)
        if (!target || !widgetTarget || !(widgetTarget < target || widgetTarget > target || widgetTarget.length !== target.length)) {
            // update matching widgets
            if (widget[i] && widget[i].setValue) widget[i].setValue(args,{send:false,sync:true,fromExternal:!target})
        }
    }

}

var osc = new Osc()

module.exports = osc
