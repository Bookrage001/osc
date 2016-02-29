var fs = require('fs'),
    settings = require('./settings')(fs)


if (settings.read('compileScss')) {
    var sass = require(__dirname + '/../browser/js/sass/sass.sync.js')
    var filenames = fs.readdirSync(__dirname + '/../browser/scss/')
    for (i in filenames) {
        if (filenames[i].indexOf('.scss')!=-1)
        var file = __dirname + '/../browser/scss/' + filenames[i]
        var light = settings.read('lightTheme')?'$theme:\'light\';':'$theme:\'dark\';'
        var content = fs.readFileSync(file,'utf8')
        sass.compile(light+content,{style: sass.style.compact,linefeed: ''}, function(result) {
            fs.writeFileSync(__dirname + '/../browser/css/'+filenames[i].replace('.scss','.css'),result.text,'utf8')
        })
    }
}



if (!settings.read('noGui')) {

    var app = require('app'),
        browserWindow = require('browser-window'),
        dialog = require('dialog'),
        ipc = require('ipc-main')

    dialog.showErrorBox = function(title,err) {
        console.log(title + ': ' + err)
    }

    app.commandLine.appendSwitch('--touch-events')

    app.on('window-all-closed', function() {
        if (process.platform != 'darwin') {
            app.quit()
        }
    })

    app.on('ready',function(){
        var server = require('./server-electron')(settings,app,ipc,browserWindow),
            osc = require('./osc')(ipc,settings),
            callbacks = require('./callbacks')(settings,fs,ipc,osc,dialog)


        server.bindCallbacks(callbacks)
    })

} else {

    var server = require('./server-express')(settings),
        ipc = server.ipc,
        osc = require('./osc')(ipc,settings),
        callbacks = require('./callbacks')(settings,fs,ipc,osc,dialog)

    server.bindCallbacks(callbacks)

}
