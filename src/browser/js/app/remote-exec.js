var {getObjectData, updateDom} = require('./editor/data-workers'),
    {widgetManager} = require('./managers')

var callbacks = {
    edit: function(args) {
        var [id, json] = args,
            newdata = JSON.parse(json),
            containers = widgetManager.getWidgetById(id)

        if (!containers.length) return
        for (var i=containers.length-1;i>=0;i--) {
            var container = containers[i].parent(),
                data = getObjectData(container)

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
