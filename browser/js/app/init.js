var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    sync = require('./widgets').sync,
    editorDisable = require('./actions').editorDisable,
    editorInit = require('./editor/init')

module.exports = function(session,callback) {

        $('#lobby').remove()
        $('#container').empty().append('<div id="loading"><div class="spinner"></div></div>')

        setTimeout(function(){
            parsetabs(session,$('#container'),true)
            setTimeout(function(){
                $('#open-toggle, .enable-editor').click();$('.editor-root').trigger('mousedown.editor')
                ui.init()
                editorDisable()
                editorInit()
                sync()
                if (!callback) return
                setTimeout(function(){
                    callback()
                },1)
            },1)
        },1)

}
