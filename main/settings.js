// This prevents argv parsing to be breaked when the app is packaged (executed without 'electron' prefix)
if (process.argv[1]&&process.argv[1].indexOf('-')==0) process.argv.unshift('')

var baseDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    configFile = require('path').join(baseDir, '.open-stage-control')

var argv = require('yargs')
      .help('help').usage(`\nUsage:\n  $0 [options]`).alias('h', 'help')
      .options({
          's':{alias:'sync',type:'array',describe:'synchronized hosts (ip:port pairs)'},
          'l':{alias:'load',type:'string',describe:'session file to load'},
          'p':{alias:'port',describe:'osc input port (for synchronization)'},
          'n':{alias:'nogui',describe:'disable default gui and makes the app availabe through http on specified port'},
          't':{alias:'theme',type:'string',describe:'theme name or file'}
       })
      .check(function(a,x){if(a.port==undefined || !isNaN(a.p)&&a.p>1023&&parseInt(a.p)===a.p){return true}else{throw 'Error: Port must be an integer >= 1024'}})
      .check(function(a,x){if(a.n==undefined || !isNaN(a.n)&&a.n>1023&&parseInt(a.n)===a.n){return true}else{throw 'Error: Port must be an integer >= 1024'}})
      .check(function(a,x){if(a.sync==undefined || a.s.join(' ').match('^([^:\s]*:[0-9]{4,5}[\s]*)*$')!=null){return true}else{throw 'Error: Sync hosts must be ip:port pairs & port must be >= 1024'}})
      .strict()
      .argv

module.exports = function(fs) {
    var config = function(){try {return JSON.parse(fs.readFileSync(configFile,'utf-8'))} catch(err) {return {}}}(),
        defaultConfig = {
            presetPath : process.cwd(),
            sessionPath: process.cwd(),
            recentSessions: [],

            appName: 'Open Stage Control',
            syncTargets: argv.s || false,
            oscInPort: argv.p || false,
            sessionFile:  argv.l || false,
            noGui: argv.n || false,
            theme: function(){
                if (!argv.t) return
                try {return fs.readFileSync(__dirname + '/themes/' + argv.t + '.css','utf-8')}
                catch(err) {
                    try {return fs.readFileSync(argv.t,'utf-8')}
                    catch(err) {
                        return
                    }
                }
            }()
        }
	return {

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
}
