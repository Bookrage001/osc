module.exports = {
    's':{alias:'send',type:'array',describe:'default targets for all widgets (ip:port or domain:port pairs)',
        check: (s)=>{
            return s.some(item=>!item.match(/^[^:]*:[0-9]{4,5}$/)) ?
                'Targets must be ip:port domain:port pairs & port must be >= 1024' : true
        }
    },
    'l':{alias:'load',type:'string',file:{name:'OSC Session (.json)', extensions: ['json', 'js']},describe:'session file to load'},
    'state':{type:'string',file:{name:'OSC State (.state)', extensions: ['state']},describe:'state file to load'},
    'b':{alias:'blank',type:'boolean',describe:'load a blank session and start the editor'},
    'c':{alias:'custom-module',type:'array',file:{name:'OSC Custom module (.js)', extensions: ['js']},describe:'custom module file to load (custom options can be passed after the filename)'},
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
            var h = argv['port'] || 8080
            if (t===h) return 'TCP input port must different from --port'
            return (!isNaN(t) && t > 1023 && parseInt(t)===t) ?
                true : 'Port must be an integer >= 1024'
        }
    },
    'tcp-targets':{type:'array',describe:'TCP servers to connect to (ip:port pairs), does not susbtitute for --send',
        check: (s, argv)=>{
            if (!argv['tcp-port']) return '--tcp-port must be set'
            return s.some(item=>!item.match('^[^:\s\"\']*:[0-9]{4,5}[\s\"\']*$')) ?
                'Targets must be ip:port pairs & port must be >= 1024' : true
        }
    },
    'm':{alias:'midi',type:'array',describe:'midi router settings'},
    'd':{alias:'debug',type:'boolean',describe:'log received osc messages in the console'},
    'n':{alias:'no-gui',type:'boolean',describe:'disable default gui',
        check: (n,argv)=>{
            return (!n || !argv.g) ?
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
            return (!u || !argv.n) ?
                true : 'url options can\'t be passed in no-gui mode'
        }
    },
    'disable-vsync':{type:'boolean',describe:'disable gui\'s vertical synchronization', restart: true},
    'disable-gpu':{type:'boolean',describe:'disable hardware acceleration', restart: true},
    'read-only':{type:'boolean',describe:'disable session editing and session history changes',
        check: (r, argv)=>{
            return (!r || !argv.b) ?
                true : 'blank session can\'t be started in read-only mode'
        }
    },
    'remote-saving':{type:'string',describe:'disable remote session saving for hosts that don\'t match the regular expresion',
        check: (r, argv)=>{
            var msg = true
            try {
                RegExp(r)
            } catch (e) {
                msg = e
            }
            return msg
        }
    },
    'instance-name':{type:'string',describe:'used to differenciate multiple instances in a zeroconf network'},
    'fullscreen':{type:'boolean', describe:'launch in fullscreen mode (only affects the default gui, F11 to exit)'}
}
