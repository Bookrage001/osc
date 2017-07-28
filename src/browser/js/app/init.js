var parser = require('./parser'),
    parsewidgets = parser.widgets,
    reset = parser.reset,
    ui = require('./ui'),
    {editorDisable, stateGet, stateSet} = require('./actions'),
    editorInit = require('./editor/init'),
    {loading, createPopup, icon} = require('./utils')

module.exports = function(session,callback) {

        $('#lobby').hide()
        $('#container').empty()
        var p = loading('Loading session file...')

        setTimeout(function(){
            try {
                reset()

                if (session[0].type != 'root') {
                    SESSION = [{type:'root', tabs:session}]
                } else if (session[0].type == 'root'){
                    SESSION = session
                } else {
                    throw 'Malformed session file'
                }

                parsewidgets(SESSION,$('#container'))
            } catch (err) {
                p.close()
                $('#lobby').show()
                createPopup(icon('warning')+'&nbsp; Parsing error', err,true)
                return
            }

            stateSet(stateGet(), false)
            $('#lobby').remove()
            ui.init()
            editorDisable()
            editorInit()
            $(window).resize()

            setTimeout(function(){
                p.close()
                if (!callback) return
                setTimeout(function(){
                    callback()
                },25)
            },25)
        },25)

}
