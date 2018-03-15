var ipc = require('../ipc/'),
    parser = require('../parser'),
    state = require('./state'),
    editor = require('../editor/'),
    lobby = require('../ui/lobby'),
    {loading, icon, Popup} = require('../ui/utils'),
    {saveAs} = require('file-saver')


var SessionManager = class SessionManager {

    constructor() {

        this.session = []
        this.lock = false

    }

    load(session, callback) {

        if (this.lock) return

        this.lock = true

        var container = DOM.get('#container')[0]

        container.classList.remove('show')
        container.innerHTML = ''

        lobby.close()

        var loader = loading('Loading session file...')

        setTimeout(()=>{
            try {
                parser.reset()

                if (session[0].type != 'root') {
                    this.session = [{type:'root', tabs:session}]
                } else if (session[0].type == 'root'){
                    this.session = session
                } else {
                    this.lock = false
                    throw new Error('Malformed session file')
                }

                parser.parse(this.session, DOM.get('#container')[0])
            } catch (err) {
                loader.close()
                lobby.open()
                new Popup({title:icon('exclamation-triangle')+'&nbsp; Parsing error', content: err, closable:true})
                this.lock = false
                throw err
            }

            state.set(state.get(), false)
            if (editor.enabled) editor.disable()

            DOM.dispatchEvent(window, 'resize')

            setTimeout(()=>{
                loader.close()
                container.classList.add('show')
                this.lock = false
                if (callback) callback()
            }, 25)

        }, 25)

    }

    save() {

        var sessionfile = JSON.stringify(this.session,null,'    '),
            blob = new Blob([sessionfile],{type : 'application/json'})

        saveAs(blob, new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16) + '.json')

        ipc.send('savingSession')

    }

    list(data) {

        for (let i in data) {

            var max = 50
            var path = data[i],
                file = path.split('\\').pop().split('/').pop(),
                length = data[i].length

            path = path.replace(file,'')

            if (length > max - 3) {
                path = path.substr(0,Math.floor((path.length)/2)-(length-max)/2) + '...' + path.substr(Math.ceil((path.length)/2)+(length-max)/2, path.length)
            }

            lobby.list.appendChild(DOM.create(`
                <a href="#" tabIndex="0" class="btn load" data-session="${data[i]}">
                    ${file} <em style="opacity:0.45">(${path})</em>
                    ${READ_ONLY? '' : '<span>'+icon('times')+'</span>'}
                </a>
            `))

        }

        lobby.list.addEventListener('click', function(e){
            e.preventDefault()
            if (e.target.hasAttribute('data-session')) {
                ipc.send('sessionOpen',{path:e.target.getAttribute('data-session')})
            } else if (!READ_ONLY && e.target.tagName == 'SPAN') {
                ipc.send('sessionRemoveFromHistory',e.target.parentNode.getAttribute('data-session'))
                lobby.list.removeChild(e.target.parentNode)
            }
        })

        if (!READ_ONLY) {

            var brw = lobby.footer.appendChild(DOM.create('<a href="#" tabindex="0" class="btn browse">'+icon('folder-open')+' Browse</a>'))
            var nws = lobby.footer.appendChild(DOM.create('<a href="#" tabindex="0" class="btn new">'+icon('file')+' New</a>'))

            brw.addEventListener('click', (e)=>{
                this.browse()
            })

            nws.addEventListener('click', (e)=>{
                this.create()
            })

        }

        DOM.addEventListener(lobby.html, 'mousedown touchstart', function(e){
            if (e.type == 'mousedown') e.preventDefault()
            e.target.blur()
        })

        lobby.open()

    }

    open(data) {
        var session = JSON.parse(data)
        this.load(session,function(){
            ipc.send('sessionOpened')
        })

    }

    browse() {

        var prompt = DOM.create('<input type="file" accept=".js, .json"/>')

        prompt.click()
        prompt.addEventListener('change',function(e){
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
            require('../ui/sidepanel').open()
            editor.enable()
        })
    }

}

var sessionManager = new SessionManager()

module.exports = sessionManager
