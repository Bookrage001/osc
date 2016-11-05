var shortcut = require('electron-localshortcut'),
    {app, dialog} = require('electron')

dialog.showErrorBox = function(title,err) {
    console.log(title + ': ' + err)
}

app.commandLine.appendSwitch('--enable-touch-events')

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

module.exports = app
