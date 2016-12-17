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
                for (i in widgetsById) {
                    if (!widgetsById[i].widget.is(widget) && widgetsById[i].setValue) {
                        widgetsById[i].setValue(v,{send:false,sync:false})
                    }
                }
            }

            // widgets that share the same linkId will update each other.
            // Updated widgets will send osc messages normally
            if (widgetsByLinkId.length>1) {
                var v = widget.abstract.getValue()
                for (i in widgetsByLinkId) {
                    if (!widgetsByLinkId[i].widget.is(widget) && widgetsByLinkId[i].setValue) {
                        widgetsByLinkId[i].setValue(v,{send:options.send,sync:false})
                    }
                }
            }
        })
    })


}


WidgetManager.prototype.createHash = function(widget) {

    return String(Math.random()).split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);

}

WidgetManager.prototype.createAddressRef = function(widget) {

    return widget.widgetData.preArgs && widget.widgetData.preArgs.length ?
                widget.widgetData.address + this.preArgsSeparator + widget.widgetData.preArgs.join(this.preArgsSeparator)
              : widget.widgetData.address

}

WidgetManager.prototype.addWidget = function(widget) {

    var hash = this.createHash(),
        address = this.createAddressRef(widget),
        id = widget.widgetData.id,
        linkId = widget.widgetData.linkId


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

}

WidgetManager.prototype.removeWidget = function(hash) {

    var widget = this.widgets[hash],
        address = this.createAddressRef(widget),
        linkId =  widget.widgetData.linkId,
        id = widget.widgetData.id

    if (this.widgets[hash]) delete this.widgets[hash]
    if (id && this.idRoute[id].indexOf(hash) != -1) this.idRoute[id].splice(this.idRoute[id].indexOf(hash), 1)
    if (linkId && this.linkIdRoute[linkId].indexOf(hash) != -1) this.linkIdRoute[linkId].splice(this.linkIdRoute[linkId].indexOf(hash), 1)
    if (address && this.addressRoute[address].indexOf(hash) != -1) this.addressRoute[address].splice(this.addressRoute[address].indexOf(hash), 1)
}

WidgetManager.prototype.purge = function() {

    for (route of [this.addressRoute, this.idRoute, this.linkIdRoute]) {
        for (key in route) {
            for (i=route[key].length-1; i>=0; i--) {
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
