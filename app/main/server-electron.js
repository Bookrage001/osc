module.exports = function(settings,app,ipc,browserWindow) {

    window = new browserWindow({
        width: 800,
        height: 600,
        title:settings.read('appName'),
        autoHideMenuBar:true,
        backgroundColor:'#1a1d22',
        show:false
    })

    window.loadURL('file://' + __dirname + '/../browser/index.html')

    window.on('closed', function() {
        window = null
    })


    var Menu = require('menu')

    Menu.setApplicationMenu(Menu.buildFromTemplate(
        [
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Restart',
                        accelerator: 'CmdOrCtrl+R',
                        click: function(){
                            var exec = require('child_process').exec
                            exec(process.argv.join(' '))
                            app.quit()
                        }// function() { window.reload(); }//restartApp
                    },
                    {
                        label: 'Toggle DevTools',
                        accelerator: 'F12',
                        click: function() { window.toggleDevTools(); }
                    },
                    {
                        label: 'Toggle Fullscreen',
                        accelerator: 'F11',
                        click: function() { window.setFullScreen(!window.isFullScreen()); }
                    }
                ]
            },
        ]
    ))

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
