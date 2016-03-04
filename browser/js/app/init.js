var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    sync = require('./widgets').sync,
    editorDisable = require('./actions').editorDisable

module.exports = function(session,callback) {

    $('#container').empty()

    parsetabs(session,$('#container'),true)

    ui.init()

    editorDisable()
    require('./editor/init')()

    sync()

    if (callback) callback()

}
