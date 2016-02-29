var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    sync = require('./widgets').sync,
    disableEditor = require('./editor').disable

module.exports = function(session,callback) {

    $('#container').empty()

    parsetabs(session,$('#container'),true)

    ui.init()

    disableEditor()

    sync()

    if (callback) callback()

}
