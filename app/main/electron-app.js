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

app.on('ready', () => {
  tray = new Tray(path.resolve(__dirname + '/../../resources/images/logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'New client window', type: 'normal'},
    {label: 'Item2', type: 'radio'}
  ])

  // Make a change to the context menu
  contextMenu.items[1].checked = false

  tray.setToolTip(settings.read('appName'))
  // Call this again for Linux because we modified the context menu
  tray.setContextMenu(contextMenu)
})

module.exports = app
