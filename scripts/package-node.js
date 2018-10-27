var browserify = require('browserify'),
    exorcist = require('exorcist'),
    licensify = require('licensify'),
    fs = require('fs'),
    cpr = require('cpr'),
    path = require('path'),
    files = [
        ['../app/package.json', '../dist/open-stage-control-node/package.json'],
        ['../app/index.js', '../dist/open-stage-control-node/index.js'],
        ['../app/launcher', '../dist/open-stage-control-node/launcher'],
        ['../app/browser', '../dist/open-stage-control-node/browser'],
        ['../app/main/midi.py', '../dist/open-stage-control-node/main/midi.py'],
        ['../app/examples', '../dist/open-stage-control-node/examples'],
        ['../app/LICENSE', '../dist/open-stage-control-node/LICENSE']
    ]

for (let i in files) {

    cpr(...files[i].map(f => path.resolve(__dirname + '/' + f)), {
        filter: /node_modules\/(serialport|uws)/,
        overwrite: true
    }, ()=>{
        if (i == files.length - 1) bundleMain()
    })

}

function bundleMain() {

    var tmp = path.resolve(__dirname + '/../app/main/index-node.js'),
        index = fs.readFileSync(path.resolve(__dirname + '/../app/main/index.js'))

    fs.writeFileSync(tmp, `require('source-map-support').install({handleUncaughtExceptions: false})\n` + index)


    var inputPath = tmp,
        outputPath = path.resolve(__dirname + '/../dist/open-stage-control-node/main/index.js')

    b = browserify(inputPath, {
        commonDir: false,
        ignoreMissing: true,
        debug: true,
        plugin: [licensify],
        builtins: false,
        commondir: false,
        insertGlobalVars: {
            __filename: true,
            __dirname: true,
            process: true,
            electron: true,
            global: true
        },
        browserField: false,
    })
    .ignore('serialport')
    .exclude('electron')

    var output =  b.bundle()

    output = output.pipe(exorcist(outputPath + '.map'))

    var writer = fs.createWriteStream(outputPath)
    output.pipe(writer)

    writer.once('finish', ()=>{
        fs.unlinkSync(tmp)
    })


}
