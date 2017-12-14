var sourceMap = require('../libs/source-map.min.js'),
    request = new XMLHttpRequest(),
    ipc = require('./ipc/')

request.open('GET', 'browser/scripts.js.map', true)

request.onload = function() {

    if (request.status >= 200 && request.status < 400) {

        var data = JSON.parse(request.responseText),
            smc = new sourceMap.SourceMapConsumer(data)

        window.onerror = function(error,url,row,col) {
            var data = smc.originalPositionFor({line:row,column:col})
            ipc.send('errorLog', `[Renderer process error]\n${error}\nSource: ${data.source} @ line ${data.line}`)
        }

    }

}

request.send()
