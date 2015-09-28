// This prevents argv parsing to be breaked when the app is packaged (executed without 'electron' prefix)
if (process.argv[1]&&process.argv[1].indexOf('-')==0) process.argv.unshift('')

var app = require('app')
  , BrowserWindow = require('browser-window')
  , dialog = require('dialog')
  , osc = require('node-osc')
  , fs = require('fs')
  , ipc = require('ipc')

  , window = null

  , argv = require('yargs')
        .help('help').usage(`\nUsage:\n  $0 [options]`)
        .options({
            'h':{alias:'host',type:'array',describe:'synchronized hosts (ip:port pairs)'},
            'c':{alias:'compile',type:'boolean',describe:'recompile stylesheets (increases startup time)'},
            'l':{alias:'load',type:'string',describe:'session file to load'},
            'p':{alias:'port',describe:'osc input port (for synchronization)'}
         })
        .check(function(a,x){if(a.port==undefined || !isNaN(a.p)&&a.p>1023&&parseInt(a.p)===a.p){return true}else{throw 'Error: Port must be an integer >= 1024'}})
        .check(function(a,x){if(a.host==undefined || a.h.join(' ').match('^([^:\s]*:[0-9]{4,5}[\s]*)*$')!=null){return true}else{throw 'Error: Hosts must ne ip:port pairs & port must be >= 1024'}})
        .strict()
        .argv

  , settings = {
      presetPath : __dirname,
      sessionPath: __dirname,
      recentSessions: [],

      appName: argv.n || 'Controller',
      syncTargets: argv.h || false,
      oscInPort: argv.p || false,
      compileScss: argv.c || false,
      sessionFile:  argv.l || false,


      persistent: function(){var c = {};try {c=require( __dirname + '/config.json')} finally {return c}}(),

      read:function(key){
          var x = this.persistent[key] || this[key]
          return x
      },
      write:function(key,value) {
          this.persistent[key] = value
          fs.writeFile(__dirname + '/config.json',JSON.stringify(this.persistent,null,4), function (err, data) {
              if (err) throw err
          })
      }

  }

dialog.showErrorBox = function(title,err) {
    console.log(title + ': ' + err)
}





restartApp = function(){
    var exec = require('child_process').exec
    exec(process.argv.join(' '))
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

app.commandLine.appendSwitch('--touch-events')


app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {

    if (settings.compileScss) compileScss()

    window = new BrowserWindow({
        width: 800,
        height: 600,
        title:settings.read('appName'),
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


if (settings.read('oscInPort')) {
    var oscServer = new osc.Server(settings.read('oscInPort'), '127.0.0.1')

    oscServer.on('message', function (msg, rinfo) {
        var data = {path:msg.shift(),args:msg}
        if (data.args.length==1) data.args = data.args[0]
        renderProcess.send('receiveOsc',data)
    })
}

function sendOsc(host,port,path,args) {
    var client = new osc.Client(host, port)
    client.send(path, args, function () {
      client.kill()
    })
}



// mainProcess & renderProcess async i/o

renderProcess = {
    send : function(name,data) {
        window.webContents.send(name,data)
    }
}

ipc.on('browseSessions',function(event, data){
    var sessionlist = settings.read('recentSessions')
        dialog.showOpenDialog(window,{title:'Load session file',defaultPath:settings.read('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){
            if (file==undefined) {return}
            settings.write('sessionPath',file[0].replace(file[0].split('/').pop(),''))
            renderProcess.send('openSession',file[0])
        })
})

ipc.on('addSessionToHistory',function(event, data){
    var sessionlist = settings.read('recentSessions')
    // add session to history
    sessionlist.unshift(data)
    // remove doubles from history
    sessionlist = sessionlist.filter(function(elem, index, self) {
        return index == self.indexOf(elem)
    })
    // save history
    settings.write('recentSessions',sessionlist)
})

ipc.on('removeSessionFromHistory',function(event, data){
    var sessionlist = settings.read('recentSessions')
    sessionlist.splice(data,1)
    settings.write('recentSessions',sessionlist)
})


ipc.on('ready',function(){
    if (settings.read('sessionFile')) renderProcess.send('openSession',settings.read('sessionFile'))
    var recentSessions = settings.read('recentSessions')
    renderProcess.send('listSessions',recentSessions)
})




ipc.on('sendOsc', function (event,data) {

    var targets = []

    if (settings.read('syncTargets')) Array.prototype.push.apply(targets, settings.read('syncTargets'))
    if (data.target) Array.prototype.push.apply(targets, data.target)


    for (i in targets) {

        var host = targets[i].split(':')[0],
            port = targets[i].split(':')[1]

        if (port) sendOsc(host,port,data.path,data.args)

    }


})


ipc.on('save', function(event, data){
    dialog.showSaveDialog(window,{title:'Save current state to preset file',defaultPath:settings.read('presetPath'),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        settings.write('presetPath',file.replace(file.split('/').pop(),''))

        if (file.indexOf('.preset')==-1){file+='.preset'}
        fs.writeFile(file,data, function (err, data) {
            if (err) throw err
            console.log('The current state was saved in '+file)
        })
    })
})

ipc.on('load', function(event, data){
    dialog.showOpenDialog(window,{title:'Load preset file',defaultPath:settings.read('presetPath'),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        settings.write('presetPath',file[0].replace(file[0].split('/').pop(),''))

        fs.readFile(file[0],'utf-8', function read(err, data) {
            if (err) throw err
            renderProcess.send('load',data)
        })
    })
})


ipc.on('fullscreen', function(event){
    window.setFullScreen(!window.isFullScreen())
})
