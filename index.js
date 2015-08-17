// dependencies
var app = require('app')
  , BrowserWindow = require('browser-window')
  , dialog = require('dialog')
  , express = require('express')()
  , osc = require("osc")
  , fs = require("fs")
  , ipc = require('ipc')
  , renderProcess = []


// static files serving
express.get('/', function (req, res) {
  res.sendFile(__dirname + '/lib-dev/index.html');
});

express.get('/*', function (req, res) {
  res.sendFile(__dirname + '/lib-dev/' + req.path);
});


var window = null;
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  window = new BrowserWindow({
      width: 800,
      height: 600,
      'auto-hide-menu-bar':true,

  });

  // and load the index.html of the app.
  window.loadUrl('file://' + __dirname + '/lib-dev/index.html');

  // Open the devtools.
  //window.openDevTools();

  // Emitted when the window is closed.
  window.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
});




// osc event listener
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 5555
});


// Forward OSC incomming messages to renderProcess via upd

udpPort.open();

udpPort.on("message", function (data) {
    renderProcess.send('receiveOsc',data);
    console.log('Received OSC : ',data)
});




// mainProcess & renderProcess async i/o


renderProcess.send = function(name,data) {
    window.webContents.send(name,data);
}


ipc.on('init',function(event, data){
  fs.readFile(__dirname + '/lib-dev/js/demo.js','utf-8', function read(err, data) {
      if (err) {
          throw err;
      }
    renderProcess.send('init',data);
  })
})


ipc.on('sendOsc', function (event,data) {

    for (i in data.target.split(' ')) {

        var host = data.target.split(' ')[i].split(':')[0],
            port = data.target.split(' ')[i].split(':')[1];
        udpPort.send({
            address: data.path,
            args: data.args
        }, host, port);
    }
});


ipc.on('save', function(event, data){
    dialog.showSaveDialog(window,{title:'Save current state to preset file',defaultPath:__dirname,filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){
        if (file==undefined) {return}
        if (file.indexOf('.preset')==-1){file+='.preset'}
        fs.writeFile(file,data, function (err, data) {
            if (err) {
                throw err;
            }
            console.log("The current state was saved in "+file);
        });
    })
})

ipc.on('load', function(event, data){
    dialog.showOpenDialog(window,{title:'Load preset file',defaultPath:__dirname,filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){
        if (file==undefined) {return}
        fs.readFile(file[0],'utf-8', function read(err, data) {
            if (err) {
                throw err;
            }
            renderProcess.send('load',data);
        });
    })
})

ipc.on('fullscreen', function(event, data){
    window.setFullScreen(data)
})
