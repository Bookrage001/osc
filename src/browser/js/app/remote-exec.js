var {getObjectData, updateDom} = require('./editor/data-workers')

var callbacks = {
    edit: function(args) {
        var [id, json] = args,
            newdata = JSON.parse(json),
            containers = WIDGETS[id]

        if (!WIDGETS[id]) return
        for (var i=WIDGETS[id].length-1;i>=0;i--) {
            var container = WIDGETS[id][i].parent(),
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
