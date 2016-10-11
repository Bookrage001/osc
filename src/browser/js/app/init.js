var parsetabs = require('./parser').tabs,
    ui = require('./ui'),
    sync = require('./widgets').sync,
    editorDisable = require('./actions').editorDisable,
    editorInit = require('./editor/init'),
    {loading} = require('./utils')

module.exports = function(session,callback) {

        $('#lobby').remove()
        $('#container').empty()
        var p = loading('Loading session file...')

        setTimeout(function(){
            parsetabs(session,$('#container'),true)

            // var t = $('<div></div>').appendTo('body')
            // for (id in TABS) {
            //     if (id!='#container') {
            //         t[0].appendChild(TABS[id].tab[0])
            //     }
            // }
            // setTimeout(function(){
            //     t.detach()
            // },250)


            ui.init()
            editorDisable()
            editorInit()
            sync()


            setTimeout(function(){
                p.close()
                if (!callback) return
                setTimeout(function(){
                    callback()
                },25)
            },25)
        },25)

}
