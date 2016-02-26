var vm = require('vm')

module.exports = function(settings,fs,ipc,osc,dialog) {

	return {

		ready: function(data,clientId) {
		    if (settings.read('sessionFile')) this.sessionOpen({path:settings.read('sessionFile')},clientId)
		    var recentSessions = settings.read('recentSessions')
		    ipc.send('sessionList',recentSessions,clientId)
		},

		sessionBrowse: function(data) {
		    var sessionlist = settings.read('recentSessions'),
				self = this
	        dialog.showOpenDialog(window,{title:'Load session file',defaultPath:settings.read('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){
	            if (file==undefined) {return}
	            settings.write('sessionPath',file[0].replace(file[0].split('/').pop(),''))
	            self.sessionOpen({path:file[0]})
	        })
		},

		sessionSave: function(data) {
		    dialog.showSaveDialog(window,{title:'Save current session',defaultPath:settings.read('sessionPath'),filters: [ { name: 'OSC Session file', extensions: ['js'] }]},function(file){

		        if (file==undefined) {return}
		        settings.write('sessionPath',file.replace(file.split('/').pop(),''))

		        if (file.indexOf('.js')==-1){file+='.js'}
		        fs.writeFile(file,data, function (err, data) {
		            if (err) throw err
		            console.log('The session was saved in '+file)
		        })
		    })
		},


		sessionAddToHistory: function(data) {
		    var sessionlist = settings.read('recentSessions')
		    // add session to history
		    sessionlist.unshift(data)
		    // remove doubles from history
		    sessionlist = sessionlist.filter(function(elem, index, self) {
		        return index == self.indexOf(elem)
		    })
		    // save history
		    settings.write('recentSessions',sessionlist)
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

		    if (!error) {
		        if (data.path) this.sessionAddToHistory(data.path)
		        ipc.send('sessionOpen',JSON.stringify(session),clientId)
		    } else {
		        ipc.send('error',{title:'Error: invalid session file',text:error})
		    }
		},

		sendOsc: function(data) {

		        var targets = []

		        if (settings.read('syncTargets') && data.sync!==false) Array.prototype.push.apply(targets, settings.read('syncTargets'))
		        if (data.target) Array.prototype.push.apply(targets, data.target)


		        for (i in targets) {

		            var host = targets[i].split(':')[0],
		                port = targets[i].split(':')[1]

		            if (port) osc.send(host,port,data.path,data.args,data.precision)

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
		}
	}

}
