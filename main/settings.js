// This prevents argv parsing to be breaked when the app is packaged (executed without 'electron' prefix)
if (process.argv[1]&&process.argv[1].indexOf('-')==0) process.argv.unshift('')

var argv = require('yargs')
      .help('help').usage(`\nUsage:\n  $0 [options]`).alias('h', 'help')
      .options({
          's':{alias:'sync',type:'array',describe:'synchronized hosts (ip:port pairs)'},
          'c':{alias:'compile',type:'string',describe:'recompile stylesheets (increases startup time)'},
          'l':{alias:'load',type:'string',describe:'session file to load'},
          'p':{alias:'port',describe:'osc input port (for synchronization)'},
          'n':{alias:'nogui',describe:'disable default gui and makes the app availabe through http on specified port'},
       })
      .check(function(a,x){if(a.port==undefined || !isNaN(a.p)&&a.p>1023&&parseInt(a.p)===a.p){return true}else{throw 'Error: Port must be an integer >= 1024'}})
      .check(function(a,x){if(a.n==undefined || !isNaN(a.n)&&a.n>1023&&parseInt(a.n)===a.n){return true}else{throw 'Error: Port must be an integer >= 1024'}})
      .check(function(a,x){if(a.sync==undefined || a.s.join(' ').match('^([^:\s]*:[0-9]{4,5}[\s]*)*$')!=null){return true}else{throw 'Error: Sync hosts must be ip:port pairs & port must be >= 1024'}})
      .strict()
      .argv

module.exports = function(fs) {
	return {
	    presetPath : process.cwd(),
	    sessionPath: process.cwd(),
	    recentSessions: [],

	    appName: 'OSC Controller',
	    syncTargets: argv.s || false,
	    oscInPort: argv.p || false,
	    compileScss: argv.c!==undefined || false,
	    lightTheme: argv.c && argv.c.match(/light/),
	    sessionFile:  argv.l || false,
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
}
