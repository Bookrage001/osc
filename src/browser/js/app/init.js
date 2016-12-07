var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    {editorDisable} = require('./actions'),
    editorInit = require('./editor/init'),
    {loading} = require('./utils')

module.exports = function(session,callback) {

        $('#lobby').remove()
        $('#container').empty()
        var p = loading('Loading session file...')

        setTimeout(function(){
            parsetabs(session,$('#container'),true)

            ui.init()
            editorDisable()
            editorInit()

            setTimeout(function(){
                p.close()
                if (!callback) return
                setTimeout(function(){
                    callback()
                },25)
            },25)
        },25)

}
