var {getObjectData, updateDom} = require('./editor/data-workers'),
    {widgetManager} = require('./managers')

var callbacks = {
    edit: function(args) {
        var [id, json] = args,
            newdata = JSON.parse(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].widget.parent(),
                data = containers[i].widgetData

            for (var k in newdata) {
                data[k] = newdata[k]
            }
            updateDom(container,data,true)
        }
    },
    edit_soft: function(args) {
        var [id, json] = args,
            newdata = JSON.parse(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].widget.parent(),
                data = containers[i].widgetData

            $.extend(true,data,newdata)
            updateDom(container,data,true)
        }
    }
}

module.exports = function(args){
    var [name, ...args] = args
    if (callbacks[name]) {
        callbacks[name](args)
    }
}
