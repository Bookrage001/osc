var cpr = require('cpr'),
    path = require('path'),
    files = [
        ['../app', '../dist/open-stage-control-node']
    ]

for (var i in files) {
    cpr(...files[i].map(f => path.resolve(__dirname + '/' + f)), {
        filter: /node_modules\/(serialport|uws)/
    })
}
