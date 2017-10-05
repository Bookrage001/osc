var vm = require('vm'),
    path = require('path'),
    fs = require('fs'),
    settings = require('./settings'),
    osc = require('./osc'),
    {ipc, clients} = require('./server'),
    chokidar = require('chokidar')

var openedSessions = {},
    widgetHashTable = {},
    lastSavingClient

module.exports =  {

    ready: function(data,clientId) {
        ipc.send('connected')

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

        if (data.path && data.path.split('.').pop() == 'js') {
            console.warn(`Warning: support for .js session files is deprecated, please use the .json extension instead`)
        }

        try {
            session = vm.runInNewContext(file)
        } catch(err) {
            error = err
        }

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

            ipc.send('error', `Invalid session file (${error})`)

        }
    },

    sessionOpened: function(data, clientId) {
        clients[clientId].broadcast.emit('stateSend')
    },

    savingSession: function(data, clientId) {

        lastSavingClient = clientId

    },

    syncOsc: function(shortdata, clientId) {

        if (!(widgetHashTable[clientId] && widgetHashTable[clientId][shortdata.h])) return

        var value = shortdata.v,
            data = widgetHashTable[clientId][shortdata.h]

        data.args =  data.preArgs.concat(value)

        var cloned
        for (var k in shortdata) {
            if (!cloned) {
                data = JSON.parse(JSON.stringify(data))
                cloned = true
            }
            if (data[k]) {
                data[k] = shortdata[k]
            }
        }

        clients[clientId].broadcast.emit('receiveOsc', data)

    },

    sendOsc: function(shortdata, clientId) {

            if (!(widgetHashTable[clientId] && widgetHashTable[clientId][shortdata.h])) return

            var value = shortdata.v,
                data = widgetHashTable[clientId][shortdata.h]

            data.args =  data.preArgs.concat(value)

            var cloned
            for (var k in shortdata) {
                if (!cloned) {
                    data = JSON.parse(JSON.stringify(data))
                    cloned = true
                }
                if (data[k]) {
                    data[k] = shortdata[k]
                }
            }

            if (data.target.indexOf(null) == -1) {

                var targets = []

                if (settings.read('syncTargets')) Array.prototype.push.apply(targets, settings.read('syncTargets'))
                if (data.target) Array.prototype.push.apply(targets, data.target)


                for (var i in targets) {

                    if (targets[i] == 'self') {
                        ipc.send('receiveOsc',data,clientId)
                        continue
                    }

                    var host = targets[i].split(':')[0],
                        port = targets[i].split(':')[1]

                    if (port) {

                        if (data.split) {

                            for (var j in data.split) {
                                osc.send(host,port,data.split[j],data.args[j],data.precision)
                            }

                        } else {

                            osc.send(host,port,data.address,data.args,data.precision)

                        }

                    }

                }

            }

            clients[clientId].broadcast.emit('receiveOsc', data)

    },

    addWidget(data, clientId) {

        if (!widgetHashTable[clientId])  {
            widgetHashTable[clientId] = {}
        }

        widgetHashTable[clientId][data.hash] = data.data
    },

    removeWidget(data, clientId) {

        delete widgetHashTable[clientId][data.hash]

    },

    removeClientWidgets(clientId) {

        if (widgetHashTable[clientId]) {
            delete widgetHashTable[clientId]
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
        if (settings.read('theme')) settings.reloadTheme()
        ipc.send('reloadCss')
    },

    log: function(data) {
        console.log(data)
    },

    error: function(data) {
        console.error(data)
    }
}
