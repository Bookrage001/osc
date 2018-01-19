var {app, Menu} = require('electron'),
    settings = require('./settings'),
    path = require('path')

app.commandLine.appendSwitch('--touch-events')


if (settings.read('noVsync') || (!settings.cli && settings.read('argv')['disable-vsync'])) {
    app.commandLine.appendSwitch('--disable-gpu-vsync')
}

if (settings.read('noGpu') || (!settings.cli && settings.read('argv')['disable-gpu'])) {
    app.disableHardwareAcceleration()
}

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

module.exports = app
