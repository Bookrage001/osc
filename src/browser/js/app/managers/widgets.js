var ipc = require('../ipc/')

var WidgetManager = class WidgetManager {

    constructor() {

        this.widgets = {}

        this.addressRoute = {}
        this.idRoute = {}
        this.linkIdRoute = {}

        this.scrollingWidgets = []

        this.preArgsSeparator = '||||'

        $(document).ready(()=>{

            $('body').off('change.global').on('change.global',(e)=>{

                var {id, widget, linkId, fromExternal, options} = e,
                    widgetsById = this.getWidgetById(id),
                    widgetsByLinkId = this.getWidgetByLinkId(linkId)

                // Widget that share the same id will update each other
                // without sending any extra osc message
                if (widgetsById.length>1) {
                    var v = widget.getValue()
                    for (let i in widgetsById) {
                        if (widgetsById[i].hash != widget.hash && widgetsById[i].setValue) {
                            widgetsById[i].setValue(v,{send:false,sync:false})
                        }
                    }
                }

                // widgets that share the same linkId will update each other.
                // Updated widgets will send osc messages normally
                if (widgetsByLinkId.length>1) {
                    var v = widget.getValue()
                    for (let i in widgetsByLinkId) {
                        if (widgetsByLinkId[i].hash != widget.hash && widgetsByLinkId[i].setValue) {
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
                        precision: this.widgets[hash].precision,
                        preArgs: this.widgets[hash].getProp('preArgs'),
                        split: this.widgets[hash].split,
                        target: this.widgets[hash].getProp('target'),
                        address: this.widgets[hash].getProp('address'),
                    }
                })
            }
        })

    }

    createAddressRef(widget, preArgs, address) {
        var preArgs = preArgs || widget.getProp('preArgs'),
            address = address || widget.getProp('address')

        return preArgs && preArgs.length ?
                    address + this.preArgsSeparator + preArgs.join(this.preArgsSeparator)
                    : address

    }

    addWidget(widget) {

        var hash = widget.hash,
            address = this.createAddressRef(widget),
            id = widget.getProp('id'),
            linkId = widget.getProp('linkId'),
            scroll = widget.getProp('scroll')


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

        if (scroll) {
            this.scrollingWidgets.push(hash)
        }

        ipc.send('addWidget', {
            hash:hash,
            data:{
                precision: widget.precision,
                preArgs: widget.getProp('preArgs'),
                split: widget.split,
                target: widget.getProp('target'),
                address: widget.getProp('address'),
            }
        })

    }

    removeWidget(hash) {

        var widget = this.widgets[hash],
            address = this.createAddressRef(widget),
            linkId =  widget.getProp('linkId'),
            id = widget.getProp('id'),
            scroll = widget.getProp('scroll')

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
        if (scroll && this.scrollingWidgets.indexOf(hash) != -1) this.scrollingWidgets.splice(this.scrollingWidgets.indexOf(hash), 1)
    }

    purge() {

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

        for (let i in this.scrollingWidgets) {
            if (!this.widgets[this.scrollingWidgets[i]]) {
                this.scrollingWidgets.splice(i, 1)
            }
        }

    }

    reset() {

        this.widgets = {}

        this.addressRoute = {}
        this.idRoute = {}
        this.linkIdRoute = {}

    }


    getWidgetBy(key, dict) {

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

    getWidgetById(id) {

        return this.getWidgetBy(id, this.idRoute)

    }

    getWidgetByLinkId(linkId) {

        return this.getWidgetBy(linkId, this.linkIdRoute)

    }

    getWidgetByAddress(address) {

        return this.getWidgetBy(address, this.addressRoute)

    }

    getWidgetByAddressAndArgs(address, args) {

        var addressref = address,
            restArgs = args

        if (typeof args == 'object' && args != null) {
            for (var i = args.length; i >= 0; i--) {

                var ref = this.createAddressRef(null, args.slice(0,i), address)

                if (this.getWidgetByAddress(ref).length) {
                    addressref = ref
                    restArgs = args.slice(i, args.length)
                    break
                }

            }
        } else {
            restArgs = args
        }


        if (restArgs == null || restArgs.length == 0) restArgs = null
        else if (restArgs.length == 1) restArgs = restArgs[0]


        var widgets = this.getWidgetByAddress(addressref)

        return [
            widgets,
            restArgs
        ]

    }


}

var widgetManager = new WidgetManager()

module.exports = widgetManager
