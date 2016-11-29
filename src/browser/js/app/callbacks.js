var init = require('./init'),
    actions = require('./actions'),
    utils = require('./utils'),
    icon = utils.icon,
    remoteExec = require('./remote-exec')

module.exports = {

    receiveOsc: function(event,data){
        var data = data || event

        if (data.address == '/EXEC') return remoteExec(data.args)

        // fetch ids corresponding to the osc address
        var address = data.address,
            addressref = address,
            args = data.args,
            target = data.target

        if (typeof data.args == 'object') {
            for (var i=data.args.length-1;i>=0;i--) {
                var ref = address+'||||'+data.args.slice(0,i).join('||||')
                if (WIDGETS_BY_ADDRESS[ref]) {
                    addressref = ref
                    args = data.args.slice(i,data.args.length)
                    continue
                }
            }
        } else {
            args = data.args
        }


        if (args.length==0) args = null
        else if (args.length==1) args = args[0]

        for (i in WIDGETS_BY_ADDRESS[addressref]) {
            // if the message target is provided (when message comes from another client connected to the same server)
            // then we only update the widgets that have the same target
            // compare arrays using > and < operators (both false = equality)
            if (!target || !(WIDGETS_BY_ADDRESS[addressref][i].target < target || WIDGETS_BY_ADDRESS[addressref][i].target > target)) {
                // update matching widgets
                if (WIDGETS_BY_ADDRESS[addressref][i]) WIDGETS_BY_ADDRESS[addressref][i].setValue(args,{send:false,sync:true,fromExternal:!target})
            }
        }


    },

    connected:function(){
        LOADING.close()
    },

    stateLoad: function(event,data){
        var data = data || event
        data = JSON.parse(data)
        actions.stateSet(data,true)
        actions.stateQuickSave(data)
    },

    sessionList: function(event,data){
        var data = data || event
        var lobby = $(`
            <div class="main">
                <div class="header">
                    Open Stage Control
                </div>
                <div class="list"></div>
                <div class="footer"></div>
            </div>`),
            list = lobby.find('.list'),
            footer = lobby.find('.footer')

        for (i in data) {
            var max = 50
            var path = data[i],
                file = path.split('\\').pop().split('/').pop(),
                length = data[i].length
            path = path.replace(file,'')
            if (length > max - 3) {
                path = path.substr(0,Math.floor((path.length)/2)-(length-max)/2) + '...' + path.substr(Math.ceil((path.length)/2)+(length-max)/2, path.length)
            }

            list.append('<a class="btn load" data-session="'+data[i]+'">'+file+' <em style="opacity:0.45">('+path+')</em><span>'+icon('remove')+'</span></a>')
        }
        footer.append('<a class="btn browse">'+icon('folder-open')+' Browse</a>')
        footer.append('<a class="btn new">'+icon('file-o')+' New</a>')
        lobby.find('.load').click(function(e){
            e.stopPropagation()
            IPC.send('sessionOpen',{path:$(this).data('session')})
        })
        lobby.find('a span').click(function(e){
            e.stopPropagation()
            IPC.send('sessionRemoveFromHistory',$(this).parent().data('session'))
            $(this).parents('a').remove()
        })
        lobby.find('.browse').click(function(e){
            e.stopPropagation()
            actions.sessionBrowse()
        })
        lobby.find('.new').click(function(e){
            e.stopPropagation()
            init([{}],function(){$('#open-toggle, .enable-editor').click();$('.editor-root').trigger('mousedown.editor')})
        })
        $('#lobby').append(lobby)
        setTimeout(()=>{
            lobby.addClass('loaded')
        })
    },

    sessionOpen: function(event,data){
        var data = data || event
        var session = JSON.parse(data)
        init(session,function(){
            IPC.send('sessionOpened')
        })

    },

    stateSend:function(){
        var p = utils.loading('New client connecting...')

        setTimeout(function(){

            OSCSYNCONLY = true
            actions.stateSend()
            OSCSYNCONLY = false

            p.close()
        },150)
    },

    error: function(event,data){
        var data = data || event

        utils.createPopup(icon('warning')+'&nbsp;'+data.title,data.text,true)
    },

    applyStyle: function(event,data){
        var data = data || event
        var style = document.createElement('style');
        style.innerHTML = data.join('');
        document.body.appendChild(style);
        if (data.indexOf('--pixel-scale')!=-1) {
            PXSCALE = data.match(/--pixel-scale\s*:\s*([^;]*)/)[1]
            INITIALZOOM = PXSCALE
        }
    },

    reloadCss: function(){
        var queryString = '?reload=' + new Date().getTime();
        $('link[rel="stylesheet"]').each(function () {
            this.href = this.href.replace(/\?.*|$/, queryString);
        });
        setTimeout(()=>{
            $('canvas').trigger('resize')
        },100)
    }

}
