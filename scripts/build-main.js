var build = require('./build')

build({
    input: '../src/main/index.js',
    output: '../app/main/open-stage-control-server.js',
    options: {
        commonDir: false,
        ignoreMissing: true,
        debug: true,
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
    },
    ignore: 'serialport',
    exclude: 'electron'
})()
