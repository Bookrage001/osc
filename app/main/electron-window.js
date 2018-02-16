var path = require('path'),
    {BrowserWindow, Menu} = require('electron'),
    shortcut = require('electron-localshortcut'),
    settings = require('./settings')

var bgColor = settings.read('theme') && settings.read('theme').indexOf('--color-bg:') != -1 ?
                settings.read('theme').match(/--color-bg:([^;]*);/)[1].trim()
                : '#191f2a'

module.exports = function(options={}) {

    var window

    window = new BrowserWindow({
        width: options.width || 800,
        height: options.height || 600,
        title: options.title || settings.read('appName'),
        icon: path.resolve(__dirname + '/logo.png'),
        backgroundColor: options.color || bgColor,
        type:options.type,
        webPreferences: {
            nodeIntegration: !!options.node
        }
    })

    window.loadURL(options.address)

    window.on('closed', function() {
        window = null
    })

    window.setMenuBarVisibility(false)

    if (options.shortcuts) {

        shortcut.register(window,'CmdOrCtrl+R',function(){
            window.reload()
        })

        shortcut.register(window,'F11',function(){
            window.setFullScreen(!window.isFullScreen())
        })

        shortcut.register(window,'F12',function(){
            window.toggleDevTools()
        })

    } else {
        shortcut.register(window,'CmdOrCtrl+R',function(e){
            return false
        })
    }

    return window

}
