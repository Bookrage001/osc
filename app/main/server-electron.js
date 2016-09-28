var path = require('path'),
    shortcut = require('electron-localshortcut')

module.exports = function(settings,app,ipc,browserWindow) {

    window = new browserWindow({
        width: 800,
        height: 600,
        icon: path.resolve(__dirname + '/../resources/images/logo.png'),
        title:settings.read('appName'),
        backgroundColor:'#1a1d22'
    })

    window.loadURL('file://' + __dirname + '/../browser/index.html')

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


    // mainProcess > renderProcess ipc shorthand
    ipc.send = function(name,data) {
        window.webContents.send(name,data)
    }


    // ipc bindings

	var bindCallbacks = function(callbacks) {

		var bindCallback = function(i) {
			ipc.on(i,function(event,data){
				callbacks[i](data)
			})
		}

		for (i in callbacks) {
			bindCallback(i)
		}

		ipc.on('ready',function(){
        	window.show()
		})

	}

	return {
		ipc:ipc,
		bindCallbacks:bindCallbacks
	}

}
