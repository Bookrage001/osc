var vm = require('vm'),
    path = require('path'),
    fs = require('fs'),
    settings = require('./settings'),
    osc = require('./osc'),
    ipc = require('./server').ipc,
    chokidar = require('chokidar')

var openedSessions = {},
    lastSavingClient

module.exports =  {

    ready: function(data,clientId) {
        ipc.send('connected')

        if (settings.read('theme')) ipc.send('applyStyle',settings.read('theme'),clientId)

        if (settings.read('readOnly')) {
            ipc.send('readOnly')
        }

        if (settings.read('newSession')) {
            ipc.send('sessionNew')
            return
        }

        if (settings.read('sessionFile')) this.sessionOpen({path:settings.read('sessionFile')},clientId)

        var recentSessions = settings.read('recentSessions')

        if (settings.read('examples')) {
            var dir = path.resolve(__dirname + '/../examples')
            recentSessions = fs.readdirSync(dir)
            recentSessions = recentSessions.map(function(file){return dir + '/' + file})
        }

        ipc.send('sessionList',recentSessions,clientId)
    },

    sessionAddToHistory: function(data) {
        var sessionlist = settings.read('recentSessions')

        fs.lstat(data,(err, stats)=>{

            if (err || !stats.isFile()) return

            // add session to history
            sessionlist.unshift(data)
            // remove doubles from history
            sessionlist = sessionlist.filter(function(elem, index, self) {
                return index == self.indexOf(elem)
            })
            // save history
            settings.write('recentSessions',sessionlist)

        })
    },

    sessionRemoveFromHistory: function(data) {
        var sessionlist = settings.read('recentSessions')
        sessionlist.splice(data,1)
        settings.write('recentSessions',sessionlist)
    },

    sessionOpen: function(data,clientId) {
        var file = data.file || (function(){try {return fs.readFileSync(data.path,'utf8')} catch(err) {return false}})(),
            error = file===false&&data.path?'Session file "' + data.path + '" not found.':false,
            session

        try {
            session = vm.runInNewContext(file)
        } catch(err) {
            error = err
        }

        if (!session) error= 'No session object returned'

        if (!error) {

            ipc.send('sessionOpen',JSON.stringify(session),clientId)


            for (var i in openedSessions) {
                if (openedSessions[i].indexOf(clientId) != -1) {
                    openedSessions[i].splice(openedSessions[i].indexOf(clientId), 1)
                }
            }

            if (data.path) {

                if (!settings.read('readOnly')) this.sessionAddToHistory(data.path)

                fs.lstat(data.path, (err, stats)=>{

                    if (err || !stats.isFile()) return


                    if (!openedSessions[data.path]) {

                        openedSessions[data.path] = []

                        var watchFile = ()=>{
                            var watcher = chokidar.watch(data.path)
                            watcher.on('change',()=>{
                                var openedSessionsClone = JSON.parse(JSON.stringify(openedSessions[data.path]))
                                for (var k in openedSessionsClone) {
                                    if (openedSessionsClone[k] != lastSavingClient) {
                                        module.exports.sessionOpen({path:data.path}, openedSessionsClone[k])
                                    }
                                }
                                watcher.close()
                                watchFile()
                            })
                        }

                        watchFile()


                    }

                    openedSessions[data.path].push(clientId)

                })

            }

        } else {

            ipc.send('error',{title:'Error: invalid session file',text:'<p>'+error+'</p>'})

        }
    },

    savingSession: function(data, clientId) {

        lastSavingClient = clientId

    },

    sendOsc: function(data) {

            if (data.syncOnly) return

            var targets = []

            if (settings.read('syncTargets')) Array.prototype.push.apply(targets, settings.read('syncTargets'))
            if (data.target) Array.prototype.push.apply(targets, data.target)


            for (i in targets) {

                var host = targets[i].split(':')[0],
                    port = targets[i].split(':')[1]

                if (port) osc.send(host,port,data.address,data.args,data.precision)

            }
    },

    stateSave: function(data) {
        dialog.showSaveDialog(window,{title:'Save current state to preset file',defaultPath:settings.read('presetPath').replace(settings.read('presetPath').split('/').pop(),''),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

            if (file==undefined) {return}
            settings.write('presetPath',file)

            if (file.indexOf('.preset')==-1){file+='.preset'}
            fs.writeFile(file,data, function (err, data) {
                if (err) throw err
                console.log('The current state was saved in '+file)
            })
        })
    },

    stateLoad: function(data,clientId) {
        dialog.showOpenDialog(window,{title:'Load preset file',defaultPath:settings.read('presetPath').replace(settings.read('presetPath').split('/').pop(),''),filters: [ { name: 'OSC Preset', extensions: ['preset'] }]},function(file){

            if (file==undefined) {return}
            settings.write('presetPath',file[0])

            fs.readFile(file[0],'utf-8', function read(err, data) {
                if (err) throw err
                ipc.send('stateLoad',data,clientId)
            })
        })
    },

    fullscreen: function(data) {
        window.setFullScreen(!window.isFullScreen())
    },

    reloadCss:function(){
        ipc.send('reloadCss')
    },

    log: function(data) {
        console.log(data)
    }
}
