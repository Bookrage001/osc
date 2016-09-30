var path = require('path'),
    shortcut = require('electron-localshortcut'),
    {app, BrowserWindow, dialog} = require('electron'),
    settings = require('./settings')

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
    window = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.resolve(__dirname + '/../resources/images/logo.png'),
        title:settings.read('appName'),
        backgroundColor:'#1a1d22'
    })

    window.loadURL('http://127.0.0.1:' + settings.read('httpPort'))

    window.on('closed', function() {
        window = null
    })

    window.setMenuBarVisibility(false)

    shortcut.register(window,'CmdOrCtrl+R',function(){
        window.reload()
    })

    shortcut.register(window,'F11',function(){
        window.setFullScreen(!window.isFullScreen())
    })

    shortcut.register(window,'F12',function(){
        window.toggleDevTools();
    })

})
