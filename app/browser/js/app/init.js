var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    sync = require('./widgets').sync

module.exports = function(session,callback) {

    $('#container').empty()

    parsetabs(session,$('#container'),true)

    ui.init()

    sync()

    if (callback) callback()

}
