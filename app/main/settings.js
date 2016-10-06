// This prevents argv parsing to be breaked when the app is packaged (executed without 'electron' prefix)
if (process.argv[1]&&process.argv[1].indexOf('-')==0) process.argv.unshift('')

var baseDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    configFile = require('path').join(baseDir, '.open-stage-control'),
    fs = require('fs'),
    ifaces = require('os').networkInterfaces()

var argv = require('yargs')
        .help('help').usage(`\nUsage:\n  $0 [options]`).alias('h', 'help')
        .options({
            's':{alias:'sync',type:'array',describe:'synchronized hosts (ip:port pairs)'},
            'l':{alias:'load',type:'string',describe:'session file to load'},
            'p':{alias:'port',describe:'http port of the server (default to 8080)'},
            'o':{alias:'osc-port',describe:'osc input port'},
            'd':{alias:'debug',describe:'log received osc messages in the console'},
            'n':{alias:'no-gui',describe:'disable default gui'},
            'g':{alias:'gui-only',describe:'server\'s ip:port, default to localhost:8080, only launch the gui (a server instance must be running)'},
            't':{alias:'theme',type:'array',describe:'theme name or path (mutliple values allowed)'},
            'examples':{describe:'list examples instead of recent sessions'}
        })
        .check(function(a,x){if(a.i==undefined || !isNaN(a.i)&&a.i>1023&&parseInt(a.i)===a.i){return true}else{throw 'Error: Port must be an integer >= 1024'}})
        .check(function(a,x){if(a.p==undefined || !isNaN(a.p)&&a.p>1023&&parseInt(a.p)===a.p){return true}else{throw 'Error: Port must be an integer >= 1024'}})
        .check(function(a,x){if(a.s==undefined || a.s.join(' ').match('^([^:\s]*:[0-9]{4,5}[\s]*)*$')!=null){return true}else{throw 'Error: Sync hosts must be ip:port pairs & port must be >= 1024'}})
        .strict()
        .argv

var config = function(){try {return JSON.parse(fs.readFileSync(configFile,'utf-8'))} catch(err) {return {}}}(),
    defaultConfig = {
        presetPath : process.cwd(),
        sessionPath: process.cwd(),
        recentSessions: [],

        appName: 'Open Stage Control',
        syncTargets: argv.s || false,
        oscInPort: argv.i || 0,
        httpPort: argv.p || 8080,
        debug: argv.d || false,
        sessionFile:  argv.l || false,
        noGui: argv.n || false,
        guiOnly: argv.g || false,
        appAddresses:function(){
            var appAddresses = []

            Object.keys(ifaces).forEach(function (ifname) {
            	for (i=0;i<ifaces[ifname].length;i++) {
            		if (ifaces[ifname][i].family == 'IPv4') {
            			appAddresses.push('http://' + ifaces[ifname][i].address + ':' + (argv.p || 8080))
            		}
            	}
            })

            return appAddresses
        }(),
        examples: argv.examples,
        theme: function(){
            if (!argv.t) return
            var style = []
            for (i in argv.t) {
                try {style.push(fs.readFileSync(__dirname + '/themes/' + argv.t[i] + '.css','utf-8'))}
                catch(err) {
                    try {style.push(fs.readFileSync(argv.t[i],'utf-8'))}
                    catch(err) {
                        console.log('Theme "' + argv.t[i] + '" not found.')
                    }
                }
            }
            return style
        }()
    }

module.exports = {

    read:function(key){
        var x = config[key] || defaultConfig[key]
        return x
    },
    write:function(key,value) {
        config[key] = value
        fs.writeFile(configFile,JSON.stringify(config,null,4), function (err, data) {
            if (err) throw err
        })
    }

}
