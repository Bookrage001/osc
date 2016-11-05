var settings = require('./settings')

var cli = false
for (i in settings.argv) {
    if (i != '_' && i != '$0' && settings.argv[i]) cli = true
}

var serverStarted

var start = function(readyApp) {

    if (!settings.read('guiOnly') && !serverStarted) {

        var server = require('./server'),
            osc = require('./osc'),
            callbacks = require('./callbacks')

        server.bindCallbacks(callbacks)

        serverStarted = true

    }

    if (!settings.read('noGui')) {

        var app = require('./electron-app')
        var address = typeof settings.read('guiOnly')=='string'? 'http://' + settings.read('guiOnly') : settings.read('appAddresses')[0]

        if (app.isReady()) {
            return require('./electron-window')({address:address})
        } else {
            app.on('ready',function(){
                require('./electron-window')({address:address})
            })
        }
    }

}



if (cli) {

    start()

} else {

    var app = require('./electron-app'),
        path = require('path'),
        address = 'file://' + path.resolve(__dirname + '/launcher/' + 'index.html'),
        {ipcMain} = require('electron'),
        launcher

    app.on('ready',function(){
        launcher = require('./electron-window')({address:address, type:'splash', width:600, height:450})
    })

    ipcMain.on('start',function(e, options){

        for (i in options) {
            settings.write(i, options[i], true)
        }

        launcher.hide()

        var gui = start()

        gui.on('close',function(){
            launcher.close()
        })
    })


}
