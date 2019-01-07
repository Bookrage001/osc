var path = require('path'),
    fs = require('fs'),
    settings = require('./settings'),
    osc = require('./osc'),
    {ipc} = require('./server'),
    {deepCopy} = require('./utils'),
    theme = require('./theme')

var widgetHashTable = {},
    sessionBackups = {}

module.exports =  {

    ready: function(data,clientId) {
        ipc.send('connected')

        if (settings.read('readOnly')) {
            ipc.send('readOnly')
        }

        if (data.backupId && sessionBackups[data.backupId]) {
            ipc.send('loadBackup', sessionBackups[data.backupId])
            return
        }

        if (settings.read('newSession')) {
            ipc.send('sessionNew')
            return
        }

        if (settings.read('sessionFile')) return this.sessionOpen({path:settings.read('sessionFile')},clientId)

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
            sessionlist.unshift(path.resolve(data))
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
        if (sessionlist.indexOf(data) > -1) {
            sessionlist.splice(sessionlist.indexOf(data),1)
            settings.write('recentSessions',sessionlist)
        }
    },

    sessionOpen: function(data,clientId) {

        var file = data.file || (function(){try {return fs.readFileSync(data.path,'utf8')} catch(err) {return false}})(),
            error = file === false && data.path ? 'Session file "' + data.path + '" not found.' : false,
            session

        try {
            session = JSON.parse(file)
        } catch(err) {
            error = err
        }

        if (!error) {

            ipc.send('sessionOpen', {path: data.path, session: session}, clientId)

        } else {

            ipc.send('error', `Invalid session file (${error})`)

        }
    },

    sessionOpened: function(data, clientId) {

        if (settings.read('stateFile')) {
            var send = true
            for (var id in ipc.clients) {
                // only make the client send its osc state if there are no other active clients
                if (id !== clientId && ipc.clients[id].connected()) {
                    send = false
                }
            }
            var state = {
                state: settings.read('stateFile'),
                send: send
            }
            ipc.send('stateLoad', state, clientId)
        }

        ipc.send('stateSend', null, null, clientId)

        module.exports.sessionSetPath(data, clientId)

    },

    sessionSetPath: function(data, clientId) {

        if (!data.path || settings.read('remoteSaving') && !settings.read('remoteSaving').test(ipc.clients[clientId].address)) {
            return
        }

        ipc.clients[clientId].sessionPath = ''
        fs.lstat(data.path, (err, stats)=>{
            if (err || !stats.isFile()) return
            ipc.clients[clientId].sessionPath = data.path
            if (!settings.read('readOnly')) {
                this.sessionAddToHistory(data.path)
            }
        })

    },

    sessionSave: function(data, clientId) {

        var path = ipc.clients[clientId].sessionPath,
            error

        if (path) {

            fs.writeFile(path, data, function(err, data) {
                if (err) return error = err
                console.log('Session file saved in '+ path)
                ipc.send('sessionSaved', clientId)
                ipc.send('notify', {
                    icon: 'save',
                    locale: 'session_savesuccess'
                }, clientId)
                for (var id in ipc.clients) {
                    if (id !== clientId && ipc.clients[id].sessionPath === path) {
                        module.exports.sessionOpen({path: path}, id)
                    }
                }
            })

        }

        if (!path || error) {

            ipc.send('notify', {
                class: 'error',
                locale: 'session_saveerror',
                message: error
            }, clientId)

        }

    },

    syncOsc: function(shortdata, clientId) {

        if (!(widgetHashTable[clientId] && widgetHashTable[clientId][shortdata.h])) return

        var value = shortdata.v,
            data = widgetHashTable[clientId][shortdata.h]

        data = deepCopy(data)
        for (var k in shortdata) {
            data[k] = shortdata[k]
        }

        data.args =  data.preArgs ? data.preArgs.concat(value) : [value]

        if (!data.noSync) ipc.send('receiveOsc', data, null, clientId)


    },

    sendOsc: function(shortdata, clientId) {

        if (!(widgetHashTable[clientId] && widgetHashTable[clientId][shortdata.h])) return

        var value = shortdata.v,
            data = widgetHashTable[clientId][shortdata.h]

        data = deepCopy(data)
        for (var k in shortdata) {
            data[k] = shortdata[k]
        }

        data.args =  data.preArgs ? data.preArgs.concat(value) : [value]

        if (data.target) {

            var targets = []

            if (data.target.indexOf(null) === -1 && settings.read('targets') && !shortdata.target) Array.prototype.push.apply(targets, settings.read('targets'))
            if (data.target) Array.prototype.push.apply(targets, data.target)

            for (var i in targets) {

                if (targets[i] === 'self') {
                    ipc.send('receiveOsc',data,clientId)
                    continue
                } else if (targets[i] === null) {
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

        if (!data.noSync) ipc.send('receiveOsc', data, null, clientId)

    },

    addWidget(data, clientId) {

        if (!widgetHashTable[clientId])  {
            widgetHashTable[clientId] = {}
        }

        if (!widgetHashTable[clientId][data.hash])  {
            widgetHashTable[clientId][data.hash] = {}
        }

        var cache = widgetHashTable[clientId][data.hash],
            widgetData = data.data

        for (var k in widgetData) {
            if ((k === 'target' || k === 'preArgs')) {
                if (widgetData[k] !== '') {
                    cache[k] = Array.isArray(widgetData[k]) ? widgetData[k] : [widgetData[k]]
                } else {
                    cache[k] = []
                }
            } else {
                cache[k] = widgetData[k]
            }
        }

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
            fs.writeFile(file,data, function(err, data) {
                if (err) throw err
                console.log('The current state was saved in '+file)
            })
        })
    },

    fullscreen: function(data) {
        window.setFullScreen(!window.isFullScreen())
    },

    reload: function(data) {

        ipc.send('reload')

    },

    storeBackup: function(data, clientId) {

        sessionBackups[data.backupId] = data
        sessionBackups[data.backupId].sessionPath = ipc.clients[clientId].sessionPath

    },

    deleteBackup: function(data) {

        delete sessionBackups[data]

    },

    reloadCss:function(){
        theme.load()
        ipc.send('reloadCss')
    },

    log: function(data) {
        console.log(data)
    },

    error: function(data) {
        console.error(data)
    },

    errorLog: function(data) {
        console.error(data)
    },

    errorPopup: function(data) {
        ipc.send('error', data)
    }

}
