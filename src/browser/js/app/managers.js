var WidgetManager = function(){

    this.widgets = []

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

    var h1 = this.createHash(),
        h2 = this.createHash(),
        hash = [h1,h2].join('/')
        address = this.createAddressRef(widget),
        id = widget.widgetData.id,
        linkId = widget.widgetData.linkId


    this.widgets[hash] = widget

    if (!this.idRoute[id]) this.idRoute[id] = {}
    this.idRoute[id][h2] = h1

    if (address) {
        if (!this.addressRoute[address]) this.addressRoute[address] = {}
        this.addressRoute[address][h2] = h1
    }

    if (linkId) {
        if (!this.linkIdRoute[linkId]) this.linkIdRoute[linkId] = {}
        this.linkIdRoute[linkId][h2] = h1
    }

    widget.widget.abstract = widget

}

WidgetManager.prototype.removeWidget = function(hash) {

    var widget = this.widgets[hash],
        h2 = hash.split('/')[1]
        address = this.createAddressRef(widget),
        linkId =  widget.widgetData.linkId,
        id = widget.widgetData.id

    if (this.widgets[hash]) delete this.widgets[hash]
    if (id && this.idRoute[id][h2]) delete this.idRoute[id][h2]
    if (linkId && this.linkIdRoute[linkId][h2]) delete this.linkIdRoute[linkId][h2]
    if (address && this.addressRoute[address][h2]) delete this.addressRoute[address][h2]
}

WidgetManager.prototype.getWidgetBy = function(key, dict) {

    var w = [],
        h1

    for (h2 in dict[key]) {
        h1 = dict[key][h2]
        w.push(this.widgets[[h1,h2].join('/')])
    }

    return w

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
