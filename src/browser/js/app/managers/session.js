var ipc = require('../ipc/'),
    parser = require('../parser'),
    state = require('./state'),
    editor = require('../editor/'),
    {loading, createPopup, icon} = require('../utils'),
    {saveAs} = require('file-saver')


var SessionManager = class SessionManager {

    constructor() {

        this.session = []

    }

    load(session, callback) {

        $('#lobby').hide()
        $('#container').empty()
        var p = loading('Loading session file...')

        setTimeout(()=>{
            try {
                parser.reset()

                if (session[0].type != 'root') {
                    this.session = [{type:'root', tabs:session}]
                } else if (session[0].type == 'root'){
                    this.session = session
                } else {
                    throw 'Malformed session file'
                }

                parser.parse(this.session,$('#container'))
            } catch (err) {
                p.close()
                $('#lobby').show()
                createPopup(icon('warning')+'&nbsp; Parsing error', err,true)
                throw err
            }

            state.set(state.get(), false)
            $('#lobby').remove()
            editor.disable()
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

    save() {

        var sessionfile = JSON.stringify(this.session,null,'    '),
            blob = new Blob([sessionfile],{type : 'application/json'})

        saveAs(blob, new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16) + '.json')

        ipc.send('savingSession')

    }

    list(data) {

        var lobby = $(`
            <div class="main">
                <div class="header">
                    ${PACKAGE.productName}
                </div>
                <div class="list"></div>
                <div class="footer"></div>
            </div>`),
            list = lobby.find('.list'),
            footer = lobby.find('.footer'),
            self = this

        for (let i in data) {

            var max = 50
            var path = data[i],
                file = path.split('\\').pop().split('/').pop(),
                length = data[i].length
            path = path.replace(file,'')

            if (length > max - 3) {
                path = path.substr(0,Math.floor((path.length)/2)-(length-max)/2) + '...' + path.substr(Math.ceil((path.length)/2)+(length-max)/2, path.length)
            }

            if (!READ_ONLY) {
            }
            list.append(`
                <a href="#" tabIndex="0" class="btn load" data-session="${data[i]}">
                    ${file} <em style="opacity:0.45">(${path})</em>
                    ${READ_ONLY? '' : '<span>'+icon('times')+'</span>'}
                </a>
            `)

        }

        lobby.find('.load').click(function(e){
            e.preventDefault()
            e.stopPropagation()
            ipc.send('sessionOpen',{path:$(this).data('session')})
        }).on('mousedown touchstart', function(e){
            if (e.type == 'mousedown') e.preventDefault()
            $(this).blur()
        })

        if (!READ_ONLY) {

            lobby.find('a span').click(function(e){
                e.stopPropagation()
                ipc.send('sessionRemoveFromHistory',$(this).parent().data('session'))
                $(this).parents('a').remove()
            })

            footer.append('<a href="#" tabindex="0" class="btn browse">'+icon('folder-open')+' Browse</a>')
            footer.append('<a href="#" tabindex="0" class="btn new">'+icon('file')+' New</a>')

            lobby.find('.browse').click((e)=>{
                e.stopPropagation()
                self.browse()
            }).on('mousedown touchstart', function(e){
                if (e.type == 'mousedown') e.preventDefault()
                $(this).blur()
            })
            lobby.find('.new').click(function(e){
                e.stopPropagation()
                self.create()
            }).on('mousedown touchstart', function(e){
                if (e.type == 'mousedown') e.preventDefault()
                $(this).blur()
            })
        }

        $('#lobby').append(lobby)

        setTimeout(()=>{
            lobby.addClass('loaded')
        })

    }

    open(data) {
        var session = JSON.parse(data)
        this.load(session,function(){
            ipc.send('sessionOpened')
        })

    }

    browse() {

        var prompt = $('<input type="file" accept=".js, .json"/>')
        prompt.click()
        prompt.on('change',function(e){
            var reader = new FileReader(),
                file = e.target.files[0]

            reader.onloadend = function(e) {
                var session = e.target.result
                ipc.send('sessionOpen',{file:session,path:file.path})
            }

            reader.readAsText(file, 'utf-8')

        })

    }

    create() {
        this.load([{}],function(){
            $('.enable-editor').click()
            $('#open-toggle').trigger('fake-click')
            $('.editor-root').trigger('fake-click')
        })
    }

}

var sessionManager = new SessionManager()

module.exports = sessionManager
