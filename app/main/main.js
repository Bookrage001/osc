var fs = require('fs'),
    settings = require('./settings')(fs)

if (!settings.read('noGui')) {

    var electron = require('electron'),
        app = electron.app,
        browserWindow = electron.BrowserWindow,
        dialog = electron.dialog,
        ipc = electron.ipcMain

    dialog.showErrorBox = function(title,err) {
        console.log(title + ': ' + err)
    }

    app.commandLine.appendSwitch('--enable-touch-events')
    app.on('window-all-closed', function() {
        if (process.platform != 'darwin') {
            app.quit()
        }
    })

    app.on('ready',function(){
        var server = require('./server-electron')(settings,app,ipc,browserWindow),
            osc = require('./osc')(ipc,settings),
            callbacks = require('./callbacks')(settings,fs,ipc,osc,dialog)


        server.bindCallbacks(callbacks)
    })

} else {

    var server = require('./server-express')(settings),
        ipc = server.ipc,
        osc = require('./osc')(ipc,settings),
        callbacks = require('./callbacks')(settings,fs,ipc,osc,dialog)

    server.bindCallbacks(callbacks)

}
