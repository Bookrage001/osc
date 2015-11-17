// This prevents argv parsing to be breaked when the app is packaged (executed without 'electron' prefix)
if (process.argv[1]&&process.argv[1].indexOf('-')==0) process.argv.unshift('')

var app = require('app')
  , browserWindow = require('browser-window')
  , dialog = require('dialog')
  , osc = require('node-osc')
  , fs = require('fs')
  , vm = require('vm')
  , ipc = require('ipc-main')

  , window = null

  , argv = require('yargs')
        .help('help').usage(`\nUsage:\n  $0 [options]`).alias('h', 'help')
        .options({
            's':{alias:'sync',type:'array',describe:'synchronized hosts (ip:port pairs)'},
            'c':{alias:'compile',type:'boolean',describe:'recompile stylesheets (increases startup time)'},
            'l':{alias:'load',type:'string',describe:'session file to load'},
            'p':{alias:'port',describe:'osc input port (for synchronization)'},
            'f':{alias:'floats',type:'boolean',describe:'force numbers to be sent as floats only'},
            'n':{alias:'nogui',describe:'disable default gui and makes the app availabe through http on specified port'},
         })
        .check(function(a,x){if(a.port==undefined || !isNaN(a.p)&&a.p>1023&&parseInt(a.p)===a.p){return true}else{throw 'Error: Port must be an integer >= 1024'}})
        .check(function(a,x){if(a.n==undefined || !isNaN(a.n)&&a.n>1023&&parseInt(a.n)===a.n){return true}else{throw 'Error: Port must be an integer >= 1024'}})
        .check(function(a,x){if(a.sync==undefined || a.s.join(' ').match('^([^:\s]*:[0-9]{4,5}[\s]*)*$')!=null){return true}else{throw 'Error: Sync hosts must be ip:port pairs & port must be >= 1024'}})
        .strict()
        .argv

  , settings = {
      presetPath : process.cwd(),
      sessionPath: process.cwd(),
      recentSessions: [],

      appName: 'OSC Controller',
      syncTargets: argv.s || false,
      oscInPort: argv.p || false,
      compileScss: argv.c || false,
      sessionFile:  argv.l || false,
      floatsOnly: argv.f || false,
      noGui: argv.n || false,


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

// prevent annoying error popups

dialog.showErrorBox = function(title,err) {
    console.log(title + ': ' + err)
}


// Sass

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
if (settings.compileScss) compileScss()


// App

if (!settings.noGui) {

    app.commandLine.appendSwitch('--touch-events')


    app.on('window-all-closed', function() {
      if (process.platform != 'darwin') {
        app.quit()
      }
    })

    app.on('ready', function() {

        window = new browserWindow({
            width: 800,
            height: 600,
            title:settings.read('appName'),
            'auto-hide-menu-bar':true,
            'background-color':'#1a1d22'
        })

        window.loadURL('file://' + __dirname + '/../browser/index.html')

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

    var restartApp = function(){
        var exec = require('child_process').exec
        exec(process.argv.join(' '))
        app.quit()
    }

}


// OSC

if (settings.read('oscInPort')) {
    var oscServer = new osc.Server(settings.read('oscInPort'), '127.0.0.1')

    oscServer.on('message', function (msg, rinfo) {
        var data = {path:msg.shift(),args:msg}
        if (data.args.length==1) data.args = data.args[0]
        ipc.send('receiveOsc',data)
    })
}

sendOsc = function(host,port,path,args) {
    var client = new osc.Client(host, port)
    client.send(path, args, function () {
      client.kill()
    })
}

if (settings.read('floatsOnly')) {
    sendOsc = function(host,port,path,args) {
        var client = new osc.Client(host, port)

        var message = new osc.Message(path)

        if (typeof args=='object') {
            for (i in args) {
                var arg = args[i]
                if (typeof arg == 'number') {
                    message.append({type:'float',value:arg})
                } else {
                    message.append({type:'string',value:arg})
                }
            }
        } else {
            if (typeof args == 'number') {
                message.append({type:'float',value:args})
            } else {
                message.append({type:'string',value:args})
            }
        }

        client.send(message, function () {
          client.kill()
        })
    }
}



// mainProcess > renderProcess ipc shorthand

ipc.send = function(name,data) {
    window.webContents.send(name,data)
}


// ipc bindings

ipc.on('ready',function(){
    callbacks.ready()
})
ipc.on('sessionBrowse',function(event, data){
    callbacks.sessionBrowse(data)
})
ipc.on('sessionSave',function(event, data){
    callbacks.sessionSave(data)
})
ipc.on('sessionAddToHistory',function(event, data){
    callbacks.sessionAddToHistory(data)
})
ipc.on('sessionRemoveFromHistory',function(event, data){
    callbacks.sessionRemoveFromHistory(data)
})
ipc.on('sessionOpen',function(event, data){
    callbacks.sessionOpen(data)
})
ipc.on('sendOsc', function (event,data) {
    callbacks.sendOsc(data)
})
ipc.on('stateSave', function(event, data){
    callbacks.stateSave(data)
})
ipc.on('stateLoad', function(event, data){
    callbacks.stateLoad(data)
})
ipc.on('fullscreen', function(event){
    callbacks.fullscreen()
})


// callbacks !

var callbacks = {}
callbacks.ready = function(data,clientId) {
    if (settings.read('sessionFile')) callbacks.sessionOpen({path:settings.read('sessionFile')},clientId)
    var recentSessions = settings.read('recentSessions')
    ipc.send('sessionList',recentSessions,clientId)
}

callbacks.sessionBrowse = function(data) {
    var sessionlist = settings.read('recentSessions')
        dialog.showOpenDialog(window,{title:'Load session file',defaultPath:settings.read('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){
            if (file==undefined) {return}
            settings.write('sessionPath',file[0].replace(file[0].split('/').pop(),''))
            callbacks.sessionOpen({path:file[0]})
        })
}
callbacks.sessionSave = function(data) {
    dialog.showSaveDialog(window,{title:'Save current session',defaultPath:settings.read('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){

        if (file==undefined) {return}
        settings.write('sessionPath',file.replace(file.split('/').pop(),''))

        if (file.indexOf('.js')==-1){file+='.js'}
        fs.writeFile(file,data, function (err, data) {
            if (err) throw err
            console.log('The session was saved in '+file)
        })
    })
}


callbacks.sessionAddToHistory = function(data) {
    var sessionlist = settings.read('recentSessions')
    // add session to history
    sessionlist.unshift(data)
    // remove doubles from history
    sessionlist = sessionlist.filter(function(elem, index, self) {
        return index == self.indexOf(elem)
    })
    // save history
    settings.write('recentSessions',sessionlist)
}

callbacks.sessionRemoveFromHistory = function(data) {
    var sessionlist = settings.read('recentSessions')
    sessionlist.splice(data,1)
    settings.write('recentSessions',sessionlist)
}

callbacks.sessionOpen = function(data,clientId) {
    var file = data.file || fs.readFileSync(data.path,'utf8'),
        session,
        error

    try {
        session = vm.runInNewContext(file)
    } catch(err) {
        error = err
    }

    if (!error) {
        if (data.path) callbacks.sessionAddToHistory(data.path)
        ipc.send('sessionOpen',JSON.stringify(session),clientId)
    } else {
        ipc.send('error',{title:'Error: invalid session file',text:error})
    }
}

callbacks.sendOsc = function(data) {

        var targets = []

        if (settings.read('syncTargets') && data.sync!==false) Array.prototype.push.apply(targets, settings.read('syncTargets'))
        if (data.target) Array.prototype.push.apply(targets, data.target)


        for (i in targets) {

            var host = targets[i].split(':')[0],
                port = targets[i].split(':')[1]

            if (port) sendOsc(host,port,data.path,data.args)

        }
}

callbacks.stateSave = function(data) {
    dialog.showSaveDialog(window,{title:'Save current state to preset file',defaultPath:settings.read('presetPath').replace(settings.read('presetPath').split('/').pop(),''),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        settings.write('presetPath',file)

        if (file.indexOf('.preset')==-1){file+='.preset'}
        fs.writeFile(file,data, function (err, data) {
            if (err) throw err
            console.log('The current state was saved in '+file)
        })
    })
}

callbacks.stateLoad = function(data,clientId) {
    dialog.showOpenDialog(window,{title:'Load preset file',defaultPath:settings.read('presetPath').replace(settings.read('presetPath').split('/').pop(),''),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

        if (file==undefined) {return}
        settings.write('presetPath',file[0])

        fs.readFile(file[0],'utf-8', function read(err, data) {
            if (err) throw err
            ipc.send('stateLoad',data,clientId)
        })
    })
}

callbacks.fullscreen = function(data) {
    window.setFullScreen(!window.isFullScreen())
}



// Headless (noGui) mode

if (settings.noGui) {
    console.log('Headless mode: app available at http://127.0.0.1:'+settings.noGui)

    var express     = require('express')()
       ,path        = require('path')
       ,http        = require('http')
       ,server      = http.createServer(express)
       ,io          = require('socket.io')()
       ,ioWildcard  = require('socketio-wildcard')()
       ,browserify  = require('browserify')
       ,jsadded     = 0
    express.get('/', function(req, res){
        res.sendfile(path.resolve(__dirname + '/../browser/index-headless.html'))
    })
    express.get('*browser-headless.js', function(req, res){
        browserify().add(path.resolve(__dirname + '/../browser' + req.path)).bundle().pipe(res);
    })
    express.get('*', function(req, res){
        res.sendfile(path.resolve(__dirname + '/../browser' + req.path))
    })


    io.use(ioWildcard)

    io.on('connection', function(socket) {
        socket.on('*', function(e){
            var name = e.data[0],
                data = e.data[1]
            if (callbacks[name]) callbacks[name](data,socket.id)
            if (name=='sendOsc' && data.sync!==false) {
                // synchronize all other connected clients
                socket.broadcast.emit('receiveOsc',data)
            }
        });
    });

    io.listen(server);

    server.listen(settings.noGui)

    ipc.send = function(name,data,clientId) {
        if (clientId) {
            io.to(clientId).emit(name,data)
        } else {
            io.emit(name,data)
        }
    }
}
