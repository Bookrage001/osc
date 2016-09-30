var settings = require('./settings')


if (!settings.read('guiOnly')) {


    var server = require('./server-express'),
    osc = require('./osc'),
    callbacks = require('./callbacks')

    server.bindCallbacks(callbacks)

}

if (!settings.read('noGui')) {
    require('./gui')
}
