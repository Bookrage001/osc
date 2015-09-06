/* TODO
- configuration panel
    - defaultTarget
    - syncTargets
*/

var app = require('app')
  , BrowserWindow = require('browser-window')
  , dialog = require('dialog')
  , express = require('express')()
  , osc = require("osc-electron")
  , fs = require("fs")
  , ipc = require('ipc')
  , configPath = __dirname + '/config.json'
  , config = require(configPath)
  , args = process.argv.slice(2);


// config file handling

var defaultConfig = {
    presetPath : __dirname,
    sessionPath: __dirname,
    recentSessions: [],
    syncTargets: [],
    oscInPort:5555
}

writeConfig = function(newconfig) {
  for (i in newconfig) {
    config[i] = newconfig[i]
  }
  fs.writeFile(configPath,JSON.stringify(config,null,4), function (err, data) {
      if (err) throw err;
  });

}

readConfig = function(key) {
    return config[key] || defaultConfig[key]
}





// static files serving
express.get('/', function (req, res) {
  res.sendFile(__dirname + '/../browser/index.html');
});

express.get('/*', function (req, res) {
  res.sendFile(__dirname + '/../browser/' + req.path);
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
      'auto-hide-menu-bar':true
  });

  // and load the index.html of the app.
  window.loadUrl('file://' + __dirname + '/../browser/index.html');

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
    localAddress: "127.0.0.1",
    localPort: readConfig('oscInPort')
});


// Forward OSC incomming messages to renderProcess via upd

udpPort.open();

udpPort.on("message", function (data) {
    renderProcess.send('receiveOsc',data);
    // console.log('Received OSC : ',data)
});




// mainProcess & renderProcess async i/o

renderProcess = {
    send : function(name,data) {
        window.webContents.send(name,data);
    }
}

ipc.on('loadSession',function(event, data){
    var sessionlist = readConfig('recentSessions')

    if (data == 'browse') {

        dialog.showOpenDialog(window,{title:'Load session file',defaultPath:readConfig('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){

            if (file==undefined) {return}

            // save path to configfile
            writeConfig({sessionPath:file[0].replace(file[0].split('/').pop(),'')})

            // open session
            renderProcess.send('openSession',file[0]);

            // add session to history
            sessionlist.unshift(file[0])

            // remove doubles from history
            sessionlist = sessionlist.filter(function(elem, index, self) {
                return index == self.indexOf(elem);
            })

            // save history
            writeConfig({recentSessions:sessionlist})

        })

    } else {
        // open session
        renderProcess.send('openSession',sessionlist[data]);
        // add session to history
        sessionlist.unshift(sessionlist[data])
        // remove doubles from history
        sessionlist = sessionlist.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        })
        // save history
        writeConfig({recentSessions:sessionlist})
    }


})

ipc.on('removeSessionFromHistory',function(event, data){
    var sessionlist = readConfig('recentSessions')
    sessionlist.splice(data,1)
    writeConfig({recentSessions:sessionlist})
})


ipc.on('ready',function(){
    var recentSessions = readConfig('recentSessions')
    renderProcess.send('listSessions',recentSessions)

    if ('testing'==args[0]) {
        var sessionlist = readConfig('recentSessions')
        renderProcess.send('openSession',sessionlist[0]);
    }
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
    dialog.showSaveDialog(window,{title:'Save current state to preset file',defaultPath:readConfig('presetPath'),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        writeConfig({presetPath:file[0].replace(file[0].split('/').pop(),'')})

        if (file.indexOf('.preset')==-1){file+='.preset'}
        fs.writeFile(file,data, function (err, data) {
            if (err) throw err;
            console.log("The current state was saved in "+file);
        });
    })
})

ipc.on('load', function(event, data){
    dialog.showOpenDialog(window,{title:'Load preset file',defaultPath:readConfig('presetPath'),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        writeConfig({presetPath:file[0].replace(file[0].split('/').pop(),'')})

        fs.readFile(file[0],'utf-8', function read(err, data) {
            if (err) throw err;

            renderProcess.send('load',data);
        });
    })
})


ipc.on('fullscreen', function(event){
    window.setFullScreen(!window.isFullScreen())

})
