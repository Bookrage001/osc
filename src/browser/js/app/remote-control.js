var {getObjectData, updateDom} = require('./editor/data-workers'),
    widgetManager = require('./managers/widgets')

var callbacks = {
    '/EDIT': function(args) {

        if (READ_ONLY) return

        var [id, json] = args,
            newdata = JSON.parseFlex(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].container,
                data = containers[i].props

            for (var k in newdata) {
                data[k] = newdata[k]
            }
            updateDom(container,data,true)
        }
    },
    '/EDIT/MERGE': function(args) {

        if (READ_ONLY) return

        var [id, json] = args,
            newdata = JSON.parseFlex(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].container,
                data = containers[i].props

            $.extend(true,data,newdata)
            updateDom(container,data,true)
        }
    },
    '/EDIT/GET': function(args) {

        if (!Array.isArray(args) || args.length != 2) return

        var [target, id] = args,
            widgets = widgetManager.getWidgetById(id)

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].sendValue({
                target: [target],
                address: '/EDIT/GET',
                v: [
                    id,
                    JSON.stringify(widgets[i].props)
                ],
                nosync: true
            })

        }
    },
    '/GET':function(args) {

        var [target, idOrAddress, ...preArgs] = args,
            widgets = []

        if (idOrAddress[0] == '/') {

            widgets = widgetManager.getWidgetByAddress(
                widgetManager.createAddressRef(null, preArgs, idOrAddress)
            )

        } else {

            widgets = widgetManager.getWidgetById(idOrAddress)

        }

        for (var i = widgets.length - 1; i >= 0; i--) {

            return widgets[i].sendValue({
                target: [target],
                address: '/GET',
                preArgs: [idOrAddress, ...preArgs],
                nosync: true
            })

        }

    },
    '/TABS': function(args) {

        if (!Array.isArray(args)) args = [args]

        for (let id of args) {
            let ws = widgetManager.getWidgetById(id)
            for (let w of ws) {
                $(`.tablink[data-widget="${w.hash}"]`).trigger('fake-click')
            }
        }

    }
}

// backward-compatibility
callbacks['/EDIT_SOFT'] = callbacks['/EDIT/MERGE']

module.exports = {
    exec: function(name, args){
        if (callbacks[name]) {
            callbacks[name](args)
        }
    },
    exists: function(name){
        return name in callbacks
    }
}
