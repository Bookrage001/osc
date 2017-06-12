var ipc = require('./ipc')

var WidgetManager = function(){

    this.widgets = {}

    this.addressRoute = {}
    this.idRoute = {}
    this.linkIdRoute = {}

    this.preArgsSeparator = '||||'

    $(document).ready(()=>{
        $('body').off('sync.global').on('sync.global',(e)=>{

            var {id, widget, linkId, fromExternal, options} = e,
                widgetsById = this.getWidgetById(id),
                widgetsByLinkId = this.getWidgetByLinkId(linkId)

            // Widget that share the same id will update each other
            // without sending any extra osc message
            if (widgetsById.length>1) {
                var v = widget.abstract.getValue()
                for (let i in widgetsById) {
                    if (!widgetsById[i].widget.is(widget) && widgetsById[i].setValue) {
                        widgetsById[i].setValue(v,{send:false,sync:false})
                    }
                }
            }

            // widgets that share the same linkId will update each other.
            // Updated widgets will send osc messages normally
            if (widgetsByLinkId.length>1) {
                var v = widget.abstract.getValue()
                for (let i in widgetsByLinkId) {
                    if (!widgetsByLinkId[i].widget.is(widget) && widgetsByLinkId[i].setValue) {
                        widgetsByLinkId[i].setValue(v,{send:options.send,sync:false})
                    }
                }
            }
        })
    })

    ipc.on('reconnect', ()=>{
        for (var hash in this.widgets) {
            ipc.send('addWidget', {
                hash:hash,
                data:{
                    precision: this.widgets[hash].getProp('precision'),
                    preArgs: this.widgets[hash].getProp('preArgs'),
                    split: this.widgets[hash].split,
                    target: this.widgets[hash].getProp('target'),
                    address: this.widgets[hash].getProp('address'),
                }
            })
        }
    })


}


WidgetManager.prototype.createAddressRef = function(widget, preArgs, address) {
    var preArgs = preArgs || widget.getProp('preArgs'),
        address = address || widget.getProp('address')

    return preArgs && preArgs.length ?
                address + this.preArgsSeparator + preArgs.join(this.preArgsSeparator)
              : address

}

WidgetManager.prototype.addWidget = function(widget) {

    var hash = widget.hash,
        address = this.createAddressRef(widget),
        id = widget.getProp('id'),
        linkId = widget.getProp('linkId')


    this.widgets[hash] = widget

    if (!this.idRoute[id]) this.idRoute[id] = []
    this.idRoute[id].push(hash)

    if (address) {
        if (!this.addressRoute[address]) this.addressRoute[address] = []
        this.addressRoute[address].push(hash)
    }

    if (linkId) {
        if (!this.linkIdRoute[linkId]) this.linkIdRoute[linkId] = []
        this.linkIdRoute[linkId].push(hash)
    }

    widget.widget.abstract = widget
    if (widget.container) widget.container[0].abstract = widget

    ipc.send('addWidget', {
        hash:hash,
        data:{
            precision: widget.getProp('precision'),
            preArgs: widget.getProp('preArgs'),
            split: widget.split,
            target: widget.getProp('target'),
            address: widget.getProp('address'),
        }
    })

}

WidgetManager.prototype.removeWidget = function(hash) {

    var widget = this.widgets[hash],
        address = this.createAddressRef(widget),
        linkId =  widget.getProp('linkId'),
        id = widget.getProp('id')

    if (this.widgets[hash]) {
        if (this.widgets[hash].onRemove) this.widgets[hash].onRemove()
        delete this.widgets[hash]

        ipc.send('removeWidget', {
            hash:hash
        })
    }
    if (id && this.idRoute[id].indexOf(hash) != -1) this.idRoute[id].splice(this.idRoute[id].indexOf(hash), 1)
    if (linkId && this.linkIdRoute[linkId].indexOf(hash) != -1) this.linkIdRoute[linkId].splice(this.linkIdRoute[linkId].indexOf(hash), 1)
    if (address && this.addressRoute[address].indexOf(hash) != -1) this.addressRoute[address].splice(this.addressRoute[address].indexOf(hash), 1)
}

WidgetManager.prototype.purge = function() {

    for (let route of [this.addressRoute, this.idRoute, this.linkIdRoute]) {
        for (let key in route) {
            for (let i=route[key].length-1; i>=0; i--) {
                let hash = route[key][i]
                if (!this.widgets[hash]) {
                    route[key].splice(i, 1)
                }
            }
        }
    }

}

WidgetManager.prototype.reset = function() {

    this.widgets = {}

    this.addressRoute = {}
    this.idRoute = {}
    this.linkIdRoute = {}

}


WidgetManager.prototype.getWidgetBy = function(key, dict) {

    var widgets = [],
        hash, w

    for (var i = dict[key] ? dict[key].length-1 : -1; i>=0; i--) {
        hash = dict[key][i]
        w = this.widgets[hash]
        if (!w) {
            dict[key].splice(i,1)
        } else {
            widgets.push(this.widgets[hash])
        }
    }

    return widgets

}

WidgetManager.prototype.getWidgetById = function(id) {

    return this.getWidgetBy(id, this.idRoute)

}

WidgetManager.prototype.getWidgetByLinkId = function(linkId) {

    return this.getWidgetBy(linkId, this.linkIdRoute)

}

WidgetManager.prototype.getWidgetByAddress = function(address) {

    return this.getWidgetBy(address, this.addressRoute)

}


var widgetManager = new WidgetManager()

module.exports.widgetManager = widgetManager
