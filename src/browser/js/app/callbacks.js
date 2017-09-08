var init = require('./init'),
    actions = require('./actions'),
    utils = require('./utils'),
    icon = utils.icon,
    ipc = require('./ipc'),
    osc = require('./osc')

var callbacks = module.exports = {

    receiveOsc: function(data){
        osc.receive(data)
    },

    connected:function(){
        window.LOADING.close()
    },

    stateLoad: function(data){
        data = JSON.parse(data)
        actions.stateSet(data,true)
        actions.stateQuickSave(data)
    },

    sessionList: function(data){

        var lobby = $(`
            <div class="main">
                <div class="header">
                    ${window.PACKAGE.productName}
                </div>
                <div class="list"></div>
                <div class="footer"></div>
            </div>`),
            list = lobby.find('.list'),
            footer = lobby.find('.footer')

        for (let i in data) {

            var max = 50
            var path = data[i],
                file = path.split('\\').pop().split('/').pop(),
                length = data[i].length
            path = path.replace(file,'')

            if (length > max - 3) {
                path = path.substr(0,Math.floor((path.length)/2)-(length-max)/2) + '...' + path.substr(Math.ceil((path.length)/2)+(length-max)/2, path.length)
            }

            if (!window.READ_ONLY) {
            }
            list.append(`
                <a href="#" tabIndex="0" class="btn load" data-session="${data[i]}">
                    ${file} <em style="opacity:0.45">(${path})</em>
                    ${window.READ_ONLY? '' : '<span>'+icon('remove')+'</span>'}
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
            footer.append('<a href="#" tabindex="0" class="btn new">'+icon('file-o')+' New</a>')

            lobby.find('.browse').click(function(e){
                e.stopPropagation()
                actions.sessionBrowse()
            }).on('mousedown touchstart', function(e){
                if (e.type == 'mousedown') e.preventDefault()
                $(this).blur()
            })
            lobby.find('.new').click(function(e){
                e.stopPropagation()
                module.exports.sessionNew()
            }).on('mousedown touchstart', function(e){
                if (e.type == 'mousedown') e.preventDefault()
                $(this).blur()
            })
        }

        $('#lobby').append(lobby)
        setTimeout(()=>{
            lobby.addClass('loaded')
        })
    },

    sessionOpen: function(data){
        var session = JSON.parse(data)
        init(session,function(){
            ipc.send('sessionOpened')
        })

    },

    sessionNew: function(){
        init([{}],function(){
            $('.enable-editor').click()
            $('#open-toggle').trigger('fake-click')
            $('.editor-root').trigger('fake-click')
        })
    },

    stateSend:function(){
        var p = utils.loading('New client connecting...')

        setTimeout(function(){

            osc.syncOnly = true
            actions.stateSend()
            osc.syncOnly = false

            p.close()
        },150)
    },

    editorDisable: function(data){
        actions.editorDisable(data.permanent)
    },

    error: function(data){
       utils.popup('Error', data, true)
    },

    reloadCss: function(){
        var queryString = '?reload=' + new Date().getTime()
        $('link[rel="stylesheet"][hot-reload]').each(function () {
            this.href = this.href.replace(/\?.*|$/, queryString)
        })
        setTimeout(()=>{
            $('canvas').trigger('resize',[0,0,true])
        },100)
        window.GRIDWIDTH =  getComputedStyle(document.documentElement).getPropertyValue("--grid-width")
        // window.PXSCALE_RESET()
    },
    readOnly: function(){
        window.READ_ONLY = true
    }
}

var bindCallback = function(i) {
    ipc.on(i,function(data){
        callbacks[i](data)
    })
}

for (let i in callbacks) {
    bindCallback(i)
}
