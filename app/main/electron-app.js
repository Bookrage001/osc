var {app, dialog} = require('electron'),
    settings = require('./settings')

dialog.showErrorBox = function(title,err) {
    console.log(title + ': ' + err)
}

app.commandLine.appendSwitch('--touch-events')


if (settings.read('noVsync')) {
    app.commandLine.appendSwitch('--disable-gpu-vsync')
}


app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

module.exports = app
