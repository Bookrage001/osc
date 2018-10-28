var browserify = require('browserify'),
    exorcist = require('exorcist'),
    licensify = require('licensify'),
    fs = require('fs'),
    cpr = require('cpr'),
    path = require('path'),
    files = [
        ['../app', '../dist/open-stage-control-node']
    ]

for (let i in files) {

    cpr(...files[i].map(f => path.resolve(__dirname + '/' + f)), {
        filter: /node_modules\/(serialport|uws)/,
        overwrite: true
    })

}
