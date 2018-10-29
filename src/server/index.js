require('source-map-support').install({handleUncaughtExceptions: false})

var dev = process.argv[0].includes('node_modules'),
    settings = require('./settings')

var serverStarted

function nodeMode() {

    console.warn('Running with node')

    if (!settings.read('noGui')) {
        settings.cli = true
        settings.write('noGui', true, true)
        console.warn('Headless mode (--no-gui) enabled automatically')
    }

    process.on('uncaughtException', (err)=>{
        console.error('A JavaScript error occurred in the main process:')
        console.error(err.stack)
    })

}

if (process.title === 'node' || process.title === 'node.exe') {

    nodeMode()

} else {

    try {

        require('electron').dialog.showErrorBox = (title, err)=>{
            console.error(title + ': ' + err)
        }

    } catch(e) {

        nodeMode()

    }

}

var start = function(readyApp) {

    if (!settings.read('guiOnly') && !serverStarted) {

        var server = require('./server'),
            osc = require('./osc'),
            callbacks = require('./callbacks'),
            zeroconf = require('./zeroconf')

        server.bindCallbacks(callbacks)

        serverStarted = true
        process.on('exit',()=>{
            if (osc.midi) osc.midi.stop()
            zeroconf.unpublishAll()
        })

    }

    if (!settings.read('noGui')) {

        var app = require('./electron-app')
        var address = typeof settings.read('guiOnly')=='string'? 'http://' + settings.read('guiOnly') : settings.read('appAddresses')[0]
        address += settings.read('urlOptions')

        var launch = ()=>{
            var win = require('./electron-window')({address:address, shortcuts:true, zoom:false, fullscreen: settings.read('fullScreen')})
            return win
        }
        if (app.isReady()) {
            return launch()
        } else {
            app.on('ready',function(){
                launch()
            })
        }
    }

}



if (settings.cli) {

    start()

} else {

    var app = require('./electron-app'),
        path = require('path'),
        address = 'file://' + path.resolve(__dirname + '/../launcher/' + 'index.html'),
        {ipcMain} = require('electron'),
        launcher

    app.on('ready',function(){
        global.settings = settings
        launcher = require('./electron-window')({address:address, shortcuts:dev, width:680, height:(100 + 8*3 + 29 * Object.keys(settings.options).filter(x=>settings.options[x].launcher !== false).length), node:true, color:'#253040'})
    })

    if (process.log) {
        process.log = (function(write) {
            return function(string, encoding, fd) {
                write.apply(process, arguments)
                launcher.webContents.send('stdout', string)
            }
        })(process.log)
    }

    process.stdout.write = (function(write) {
        return function(string, encoding, fd) {
            write.apply(process.stdout, arguments)
            launcher.webContents.send('stdout', string)
        }
    })(process.stdout.write)

    process.stderr.write = (function(write) {
        return function(string, encoding, fd) {
            write.apply(process.stdout, arguments)
            launcher.webContents.send('stderr', string)
        }
    })(process.stderr.write)


    ipcMain.on('start',function(e, options){

        var gui = start()

        if (settings.read('guiOnly')) {
            launcher.hide()
            gui.on('close',()=>{
                launcher.close()
            })
        } else {
            launcher.webContents.send('started')
        }


    })


}
