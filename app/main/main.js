/* TODO
- configuration panel

*/
var app = require('app')
  , BrowserWindow = require('browser-window')
  , dialog = require('dialog')
  , osc = require('node-osc')
  , fs = require("fs")
  , ipc = require('ipc')
  , configPath = __dirname + '/config.json'
  , config = require(configPath)
  , args = process.argv.slice(0)




dialog.showErrorBox = function(title,err) {
    console.log(title + ': ' + err)
}
// config file handling

var defaultConfig = {
    presetPath : __dirname,
    sessionPath: __dirname,
    recentSessions: [],
    syncTargets: "",
    oscInPort:5555
}
var editableConfig = {
    syncTargets: {
        info:"List of target hosts (ip:port pairs), separated by spaces. Every OSC message sent by the app will be sent to these hosts too.",
        match:'^([^:\s]*:[0-9]*[\s]*)*$'
    },
    oscInPort: {
        info:"Port on which the app listens to synchronise with other apps. <i class='fa fa-warning fa-fw'></i>&nbsp;You'll need to restart the app for this change to take effect.",
        match:'^([0-9]+){0,1}$'
    }}




writeConfig = function(newconfig) {
  for (i in newconfig) {
    config[i] = newconfig[i]
  }
  fs.writeFile(configPath,JSON.stringify(config,null,4), function (err, data) {
      if (err) throw err
  })

}

readConfig = function(key) {
    return config[key] || defaultConfig[key]
}
readEditableConfig = function(){
    var ret = {}
    for (i in editableConfig) {
        ret[i] = {
            value:readConfig(i),
            info:editableConfig[i].info,
            match:editableConfig[i].match,
        }
    }
    return ret
}

restartApp = function(){
    var exec = require('child_process').exec
    exec(args.join(' '))
    app.quit()
}


compileScss = function(){
    var sass = require(__dirname + '/../browser/js/sass/sass.sync.js')
    var filenames = fs.readdirSync(__dirname + '/../browser/scss/')
    for (i in filenames) {
        if (filenames[i].indexOf('.scss')!=-1)
        var file = __dirname + '/../browser/scss/' + filenames[i]
        var content = fs.readFileSync(file,'utf8')
        sass.compile(content,{style: sass.style.compact,linefeed: ''}, function(result) {
            fs.writeFileSync(__dirname + '/../browser/css/'+filenames[i].replace('.scss','.css'),result.text,'utf8')
        })
    }
}



var window = null

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {

    if (args.indexOf('-c')!=-1) {
        compileScss()
    }

    window = new BrowserWindow({
        width: 800,
        height: 600,
        'auto-hide-menu-bar':true
    })

    window.loadUrl('file://' + __dirname + '/../browser/index.html')

    window.on('closed', function() {
        window = null
    })


    var Menu = require('menu')
    var MenuItem = require('menu-item')

    var template = [
        {
            label: 'View',
            submenu: [
                {
                    label: 'Restart',
                    accelerator: 'CmdOrCtrl+R',
                    click: restartApp// function() { window.reload(); }//restartApp
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
    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})



var oscServer = new osc.Server(readConfig('oscInPort'), '127.0.0.1')

oscServer.on("message", function (msg, rinfo) {
    var data = {path:msg.shift(),args:msg}
    if (data.args.length==1) data.args = data.args[0]
    renderProcess.send('receiveOsc',data)
})


// mainProcess & renderProcess async i/o

renderProcess = {
    send : function(name,data) {
        window.webContents.send(name,data)
    }
}

ipc.on('browseSessions',function(event, data){
    var sessionlist = readConfig('recentSessions')
        dialog.showOpenDialog(window,{title:'Load session file',defaultPath:readConfig('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){
            if (file==undefined) {return}
            writeConfig({sessionPath:file[0].replace(file[0].split('/').pop(),'')})
            renderProcess.send('openSession',file[0])
        })
})

ipc.on('addSessionToHistory',function(event, data){
    var sessionlist = readConfig('recentSessions')
    // add session to history
    sessionlist.unshift(data)
    // remove doubles from history
    sessionlist = sessionlist.filter(function(elem, index, self) {
        return index == self.indexOf(elem)
    })
    // save history
    writeConfig({recentSessions:sessionlist})
})

ipc.on('removeSessionFromHistory',function(event, data){
    var sessionlist = readConfig('recentSessions')
    sessionlist.splice(data,1)
    writeConfig({recentSessions:sessionlist})
})


ipc.on('ready',function(){
    var recentSessions = readConfig('recentSessions')
    renderProcess.send('listSessions',recentSessions)

    if (args.indexOf('-l')!=-1) {
        var sessionlist = readConfig('recentSessions')
        renderProcess.send('openSession',sessionlist[0])
    }
})





ipc.on('sendOsc', function (event,data) {

    var targets = []
    Array.prototype.push.apply(targets, data.target.split(' '))
    Array.prototype.push.apply(targets, readConfig('syncTargets').split(' '))

    for (i in targets) {

        var host = targets[i].split(':')[0],
            port = targets[i].split(':')[1]

        if (port) {
            var client = new osc.Client(host, port)
            client.send(data.path, data.args, function () {
              client.kill()
            })
        }

    }


})


ipc.on('save', function(event, data){
    dialog.showSaveDialog(window,{title:'Save current state to preset file',defaultPath:readConfig('presetPath'),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        writeConfig({presetPath:file.replace(file.split('/').pop(),'')})

        if (file.indexOf('.preset')==-1){file+='.preset'}
        fs.writeFile(file,data, function (err, data) {
            if (err) throw err
            console.log("The current state was saved in "+file)
        })
    })
})

ipc.on('load', function(event, data){
    dialog.showOpenDialog(window,{title:'Load preset file',defaultPath:readConfig('presetPath'),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        writeConfig({presetPath:file[0].replace(file[0].split('/').pop(),'')})

        fs.readFile(file[0],'utf-8', function read(err, data) {
            if (err) throw err
            renderProcess.send('load',data)
        })
    })
})


ipc.on('fullscreen', function(event){
    window.setFullScreen(!window.isFullScreen())
})
