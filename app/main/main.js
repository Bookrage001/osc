var settings = require('./settings')

var serverStarted

var start = function(readyApp) {

    if (!settings.read('guiOnly') && !serverStarted) {

        var server = require('./server'),
            osc = require('./osc'),
            callbacks = require('./callbacks')

        server.bindCallbacks(callbacks)

        serverStarted = true
        process.on('exit',()=>{
            if (osc.midi) osc.midi.stop()
        })

    }

    if (!settings.read('noGui')) {

        var app = require('./electron-app')
        var address = typeof settings.read('guiOnly')=='string'? 'http://' + settings.read('guiOnly') : settings.read('appAddresses')[0]
        address += settings.read('urlOptions')
        if (app.isReady()) {
            var win = require('./electron-window')({address:address, shortcuts:true})
            app.on('before-quit',()=>{
                process.exit()
            })
            return win
        } else {
            app.on('ready',function(){
                var win = require('./electron-window')({address:address, shortcuts:true})
                app.on('before-quit',()=>{
                    process.exit()
                })
            })
        }
    }

    try {
        require('electron').dialog.showErrorBox = (title, err)=>{
            console.error(title + ': ' + err)
        }
    } catch(e){
        process.on('uncaughtException', (err)=>{
            console.error('A JavaScript error occurred in the main process:')
            console.trace(err)
        })
    }

}



if (settings.cli) {

    start()

} else {

    var app = require('./electron-app'),
        path = require('path'),
        address = 'file://' + path.resolve(__dirname + '/launcher/' + 'index.html'),
        {ipcMain} = require('electron'),
        launcher

    app.on('ready',function(){
        launcher = require('./electron-window')({address:address, shortcuts:false, width:680, height:626, color:'#283143'})
    })

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
