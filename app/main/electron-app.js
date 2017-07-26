var {app, dialog, Tray, Menu} = require('electron'),
    settings = require('./settings'),
    path = require('path'),
    tray

dialog.showErrorBox = function(title,err) {
    console.log(title + ': ' + err)
}

app.commandLine.appendSwitch('--touch-events')


if (settings.read('noVsync') || (!settings.cli && settings.read('argv')['disable-vsync'])) {
    app.commandLine.appendSwitch('--disable-gpu-vsync')
}


app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

module.exports = app
