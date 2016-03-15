var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    sync = require('./widgets').sync,
    editorDisable = require('./actions').editorDisable,
    editorInit = require('./editor/init')

module.exports = function(session,callback) {

        $('#lobby').remove()
        $('#container').empty()
        var spinner = $('<div id="loading"><div class="spinner"></div></div>').appendTo('body')

        setTimeout(function(){
            parsetabs(session,$('#container'),true)
            ui.init()
            editorDisable()
            editorInit()
            sync()
            setTimeout(function(){
                spinner.remove()
                if (!callback) return
                setTimeout(function(){
                    callback()
                },25)
            },25)
        },25)

}
