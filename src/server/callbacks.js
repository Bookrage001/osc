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

    sessionSetPath: function(data, clientId) {

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (!settings.read('readOnly')) {
            module.exports.sessionAddToHistory(data.path)
        }

        ipc.clients[clientId].sessionPath = data.path

        ipc.send('setTitle', path.basename(data.path), clientId)

    },

    sessionOpen: function(data, clientId) {

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        module.exports.fileRead(data, clientId, true, (result)=>{

            ipc.send('sessionOpen', {path: data.path, session: result}, clientId)

        })

    },

    sessionOpened: function(data, clientId) {

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

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

        module.exports.sessionSetPath({path: data.path}, clientId)

    },

    fileRead: function(data, clientId, ok, callback) {

        if (!ok) return

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        fs.readFile(data.path, 'utf8', (err, result)=>{

            var error

            if (err) {
                error = err
            } else {
                try {
                    result = JSON.parse(result)
                    callback(result)
                } catch(err) {
                    error = err
                }
            }

            if (error) ipc.send('error', `Could not open file (${error})`)

        })

    },

    fileSave: function(data, clientId, ok, callback) {

        if (!ok) return

        if (!data.path || settings.read('remoteSaving') && !settings.read('remoteSaving').test(ipc.clients[clientId].address)) {

            return ipc.send('notify', {
                icon: 'save',
                locale: 'remotesave_forbidden',
                class: 'error'
            }, clientId)

        }

        if (data.path) {

            if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

            var root = settings.read('remoteRoot')
            if (root && !data.path.includes(root)) {
                console.error('Could not save: path outside of remote-root')
                return ipc.send('notify', {
                    class: 'error',
                    locale: 'remotesave_fail',
                    message: ' (Could not save: path outside of remote-root)'
                }, clientId)
            }

            try {
                JSON.parse(data.session)
            } catch(e) {
                return console.error('Could not save: invalid file')
            }

            fs.writeFile(data.path, data.session, function(err, fdata) {

                if (err) return ipc.send('notify', {
                    class: 'error',
                    locale: 'remotesave_fail',
                    message: err
                }, clientId)


                ipc.send('notify', {
                    icon: 'save',
                    locale: 'remotesave_success',
                    message: ' ('+ path.basename(data.path) +')'
                }, clientId)

                callback()

            })

        }

    },

    stateOpen: function(data, clientId) {

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        module.exports.fileRead(data, clientId, true, (result)=>{

            ipc.send('stateLoad', {state: result, send: true}, clientId)

        })

    },

    sessionSave: function(data, clientId) {

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (!path.basename(data.path).match(/.*\.json$/)) return console.error('Sessions must be saved as .json files')

        module.exports.fileSave(data, clientId, true, ()=>{

            console.log('Session file saved in '+ data.path)

            ipc.send('sessionSaved', clientId)

            // reload session in other clients
            for (var id in ipc.clients) {
                if (id !== clientId && ipc.clients[id].sessionPath === data.path) {
                    module.exports.sessionOpen({path: data.path}, id)
                }
            }

            module.exports.sessionSetPath({path: data.path}, clientId)

        })

    },

    stateSave: function(data, clientId) {

        if (Array.isArray(data.path)) data.path = path.resolve(...data.path)

        if (!path.basename(data.path).match(/.*\.state/)) return console.error('Statesaves must be saved as .state files')

        module.exports.fileSave(data, clientId, true, ()=>{

            console.log('State file saved in '+ data.path)

        })

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

        if (data.target) {

            var targets = []

            if (data.target.indexOf(null) === -1 && settings.read('targets') && !shortdata.target) Array.prototype.push.apply(targets, settings.read('targets'))
            if (data.target) Array.prototype.push.apply(targets, data.target)

            data.args = data.preArgs ? data.preArgs.concat(value) : [value]

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
                            data.args = data.preArgs ? data.preArgs.concat(value[j]) : [value[j]]
                            osc.send(host,port,data.split[j],data.args,data.precision)
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

    fullscreen: function(data) {
        window.setFullScreen(!window.isFullScreen())
    },

    reload: function(data) {

        ipc.send('reload')

    },

    storeBackup: function(data, clientId) {

        sessionBackups[data.backupId] = data

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
    },

    listDir: function(data, clientId) {

        var p = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']

        if (data.path) p = path.resolve(...data.path)

        var root = settings.read('remoteRoot')
        if (root && !p.includes(root)) p = root

        fs.readdir(p, (err, files)=>{
            if (err) {
                ipc.send('notify', {class: 'error', message: err.message}, clientId)
                throw err
            } else {
                var extRe = data.extension ? new RegExp('.*\\.' + data.extension + '$') : /.*/
                var list = files.filter(x=>x[0] !== '.').map((x)=>{
                    return {
                        name: x,
                        folder: fs.statSync(path.resolve(p, x)).isDirectory()
                    }
                })
                list = list.filter(x=>x.folder || x.name.match(extRe))
                ipc.send('listDir', {
                    path: p,
                    files: list
                }, clientId)
            }
        })


    }

}
