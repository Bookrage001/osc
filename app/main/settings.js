// This prevents argv parsing to be breaked when the app is packaged (executed without 'electron' prefix)
if (process.argv[1]&&process.argv[1].indexOf('-')==0) process.argv.unshift('')

var baseDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    configPath = require('path').join(baseDir, '.open-stage-control'),
    fs = require('fs'),
    ifaces = require('os').networkInterfaces()

var options = {
    's':{alias:'send',type:'array',describe:'default targets for all widgets (ip:port pairs)',
         check: (s)=>{
             return s.some(item => !item.match('^[^:\s\"\']*:[0-9]{4,5}[\s\"\']*$')) ?
                 'Targets must be ip:port pairs & port must be >= 1024' : true
         }
    },
    'sync':{type:'array',describe:false,launcher:false,hidden:true,
         check: (s)=>{
             if (s) console.error('Warning: --sync is deprecated, use --send instead.')
             return s.some(item => !item.match('^[^:\s\"\']*:[0-9]{4,5}[\s\"\']*$')) ?
                 'Targets must be ip:port pairs & port must be >= 1024' : true
         }
    },
    'l':{alias:'load',type:'string',file:{name:'OSC Session (.json)', extensions: ['json', 'js']},describe:'session file to load'},
    'b':{alias:'blank',type:'boolean',describe:'load a blank session and start the editor'},
    'c':{alias:'custom-module',type:'string',file:{name:'OSC Custom module (.js)', extensions: ['js']},describe:'custom module file to load'},
    'p':{alias:'port',type:'number',describe:'http port of the server (default to 8080)',
         check: (p)=>{
             return (!isNaN(p) && p > 1023 && parseInt(p)===p) ?
                true : 'Port must be an integer >= 1024'
         }
     },
     'o':{alias:'osc-port',type:'number',describe:'osc input port (default to --port)',
          check: (o)=>{
              return (!isNaN(o) && o > 1023 && parseInt(o)===o) ?
                 true : 'Port must be an integer >= 1024'
          }
     },
     'tcp-port':{type:'number', describe:'TCP server input port',
         check: (t, argv)=>{
             var h = argv.p || 8080
             if (t===h) return 'TCP input port must different from --port'
             return (!isNaN(t) && t > 1023 && parseInt(t)===t) ?
                true : 'Port must be an integer >= 1024'
         }
     },
     'tcp-targets':{type:'array',describe:'TCP servers to connect to (ip:port pairs), does not susbtitute for --send',
          check: (s, argv)=>{
              if (!argv['tcp-port']) return '--tcp-port must be set'
              return s.some(item => !item.match('^[^:\s\"\']*:[0-9]{4,5}[\s\"\']*$')) ?
                  'Targets must be ip:port pairs & port must be >= 1024' : true
          }
     },
    'm':{alias:'midi',type:'array',describe:'midi router settings'},
    'd':{alias:'debug',type:'boolean',describe:'log received osc messages in the console'},
    'n':{alias:'no-gui',type:'boolean',describe:'disable default gui',
         check: (n,argv)=>{
             return (!n || !argv.g) ?
                true : 'no-gui and gui-only can\'s be enabled simultaneously'
         }
     },
    'g':{alias:'gui-only',type:'string',describe:'app server\'s url. If true, local port (--port) is used',
         check: (g,argv)=>{
             return (!g || !argv.n) ?
                true : 'no-gui and gui-only can\'s be enabled simultaneously'
         }
    },
    't':{alias:'theme',type:'array',describe:'theme name or path (mutliple values allowed)'},
    'e':{alias:'examples',type:'boolean',describe:'list examples instead of recent sessions',
         check: (e,argv)=>{
             return (!e || !argv.l) ?
                true : 'examples can\'t be listed if --load is set'
         }
    },
    'url-options':{type:'array',describe:'url options (opt=value pairs)',
        check: (u, argv)=>{
            return (!u || !argv.n) ?
            true : 'url options can\'t be passed in no-gui mode'
        }
    },
    'disable-vsync':{type:'boolean',describe:'disable gui\'s vertical synchronization', restart: true},
    'disable-gpu':{type:'boolean',describe:'disable hardware acceleration', restart: true},
    'read-only':{type:'boolean',describe:'disable session editing and session history changes',
         check: (r, argv)=>{
             return (!r || !argv.b) ?
                true : 'blank session can\'t be started in read-only mode'
         }
    },
    'instance-name':{type:'string',describe:'used to differenciate multiple instances in a zeroconf network'},
    'fullscreen':{type:'boolean', describe:'launch the default client gui in fullscreen mode (F11 to exit)'}
}


var argv = require('yargs')
        .help('help').usage(`\nUsage:\n  $0 [options]`).alias('h', 'help')
        .options(options)
        .check((argv)=>{
            var err = []
            for (key in options) {
                if (options[key].check && argv[key] != undefined) {
                    var c = options[key].check(argv[key],argv)
                    if (c!==true) {
                        err.push(`-${key}: ${c}`)
                    }
                }
            }
            return err.length ? err.join('\n') : true
        })
        .strict()
        .version().alias('v','version')

argv = argv.argv

var cli = false
for (i in argv) {
    if (i != '_' && i != '$0' && (argv[i]!=undefined && argv[i]!==false)) cli = true
}

var configFile = function(){try {return JSON.parse(fs.readFileSync(configPath,'utf-8'))} catch(err) {return {}}}(),
    config = JSON.parse(JSON.stringify(configFile)),
    defaultConfig


var makeDefaultConfig = function(argv){
    defaultConfig = {
        argv:argv,
        presetPath : process.cwd(),
        sessionPath: process.cwd(),
        recentSessions: [],
        appName: 'Open Stage Control',
        instanceName: argv['instance-name'] || false,
        targets: argv.s || argv.sync || false,
        oscInPort: argv.o || 0,
        httpPort: argv.p || 8080,
        httpPort: argv.p || 8080,
        tcpInPort: argv['tcp-port'] || false,
        tcpTargets: argv['tcp-targets'] || [],
        debug: argv.d || false,
        sessionFile:  argv.l || false,
        newSession:  argv.b || false,
        customModule: argv.c || false,
        fullScreen: argv['fullscreen'] || false,
        noGui: argv.n || false,
        guiOnly: typeof argv.g == 'string' ? argv.g.length ? argv.g : true : false,
        urlOptions: argv['url-options'] ? '?' + argv['url-options'].join('&') : '',
        noVsync: argv['disable-vsync'] || false,
        noGpu: argv['disable-gpu'] || false,
        readOnly: argv['read-only'] || false,
        midi: argv.m,
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
        examples: argv.e,
        theme: argv.t || []
    }
}

makeDefaultConfig(argv)

module.exports = {
    argv:argv,
    options:options,
    makeDefaultConfig:makeDefaultConfig,
    read:function(key){
        var x = config[key] || defaultConfig[key]
        return x
    },
    write:function(key,value,tmp) {
        config[key] = value
        if (tmp) return
        configFile[key] = value
        fs.writeFile(configPath,JSON.stringify(configFile,null,4), function (err, data) {
            if (err) throw err
        })
    },
    cli: cli
}
