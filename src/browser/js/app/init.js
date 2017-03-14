var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    {editorDisable} = require('./actions'),
    editorInit = require('./editor/init'),
    {loading, createPopup, icon} = require('./utils')

module.exports = function(session,callback) {

        $('#lobby').hide()
        $('#container').empty()
        var p = loading('Loading session file...')

        setTimeout(function(){
            try {
                parsetabs(session,$('#container'),true)
            } catch (err) {
                p.close()
                $('#lobby').show()
                createPopup(icon('warning')+'&nbsp; Parsing error', err,true)
                return
            }

            $('#lobby').remove()
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
