var widgetManager = require('./managers/widgets'),
    ipc = require('./ipc/')

var Osc = class Osc {

    constructor() {

        this.syncOnly = false
        this.remoteControl = ()=>{console.error('remote-control module not loaded')}

    }

    init(data) {
        this.remoteControl = require('./remote-control')
    }

    send(data) {

        if (this.syncOnly) {

            this.sync(data)

        } else {

            ipc.send('sendOsc', data)

        }

    }

    sync(data) {

        ipc.send('syncOsc', data)

    }

    receive(data){

        if (this.remoteControl.exists(data.address)) this.remoteControl.exec(data.address, data.args)

        var [widgets, restArgs] = widgetManager.getWidgetByAddressAndArgs(data.address, data.args)

        for (let i in widgets) {
            let widgetTarget = widgets[i].getProp('target')
            // if the message target is provided (when message comes from another client connected to the same server)
            // then we only update the widgets that have the same target
            // compare arrays using > and < operators (both false = equality)
            if (!data.target || !widgetTarget || !(widgetTarget < data.target || widgetTarget > data.target || widgetTarget.length !== data.target.length)) {
                // update matching widgets
                if (widgets[i] && widgets[i].setValue) widgets[i].setValue(restArgs,{send:false,sync:true,fromExternal:!data.target})
            }
        }

    }

}


var osc = new Osc()

module.exports = osc
