var electron = require('electron')
WEBFRAME = electron.webFrame

// mainProcess & renderProcess communication engine
IPC = electron.ipcRenderer

require('./app')
