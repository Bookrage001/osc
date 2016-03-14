module.exports = {

    stateQuickSave: function(preset){
        if (preset) {
            STATE = preset
        } else {
            STATE = module.exports.stateGet()
        }
        $('.quickload').removeClass('disabled')
    },

    stateQuickLoad: function(){
        module.exports.stateSet(STATE,true)
    },

    stateSave: function() {
        state = module.exports.stateGet()
        if (WEBFRAME) {
            IPC.send('stateSave',state)
        } else {
            var down = $('<a download="'+new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.preset"></a>')
            var blob = new Blob([state],{type : 'text/plain'});
            down.attr('href', window.URL.createObjectURL(blob))
            down[0].click()
        }

    },

    stateGet: function (){
        var data = []
        $.each(WIDGETS,function(i,widget) {
            for (var j=widget.length-1;j>=0;j--) {
                if (widget[j].setValue && widget[j].getValue) {
                    var v = widget[j].getValue()
                    if (v!=undefined) data.push(i+' '+v)
                    break
                }
            }
        })
        return data.join('\n')
    },

    stateLoad: function() {
        if (WEBFRAME) {
            IPC.send('stateLoad')
        } else {
            var prompt = $('<input type="file" accept=".preset"/>')
            prompt.click()
            prompt.on('change',function(e){
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var preset = e.target.result
                    module.exports.stateSet(preset,true)
                    STATE = preset
                }
                reader.readAsText(e.target.files[0],'utf-8');
            })
        }
    },

    stateSend: function(){
        var data = module.exports.stateGet()
        module.exports.stateSet(data,true)

    },

    stateSet: function(preset,send){

        $.each(preset.split('\n'),function(i,d) {
            var data = d.split(' ')

            setTimeout(function(){
                if (WIDGETS[data[0]]!=undefined) {
                    for (var i=WIDGETS[data[0]].length-1;i>=0;i--) {
                        if (WIDGETS[data[0]][i].setValue && WIDGETS[data[0]][i].getValue) {
                            WIDGETS[data[0]][i].setValue(data[1].split(','),send,true)
                            break
                        }
                    }
                }
            },i)
        })
    },

    toggleFullscreen: function(){

        if (WEBFRAME) {
            IPC.send('fullscreen')
        } else {
            var isInFullScreen = document.webkitIsFullScreen

            if (isInFullScreen) {
                document.webkitExitFullscreen()
            } else {
                document.documentElement.webkitRequestFullScreen()
            }
        }
    },

    sessionBrowse: function(){

        if (WEBFRAME) {
            IPC.send('sessionBrowse')
        } else {
            var prompt = $('<input type="file" accept=".js"/>')
            prompt.click()
            prompt.on('change',function(e){
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    var session = e.target.result
                    IPC.send('sessionOpen',{file:session})
                }
                reader.readAsText(e.target.files[0],'utf-8');
            })
        }
    },

    sessionSave: function() {
        var sessionfile = JSON.stringify(SESSION,null,'    ')
        if (WEBFRAME) {
            IPC.send('sessionSave',sessionfile)
        } else {
            var down = $('<a download="'+new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.js"></a>')
            var blob = new Blob([sessionfile],{type : 'text/plain'});
            down.attr('href', window.URL.createObjectURL(blob))
            down[0].click()
        }

    },


    createPopup: function(title,content) {

        var popup = $(`
            <div class="popup">
                <div class="popup-wrapper">
                <div class="popup-title">${title}<span class="closer">${module.exports.icon('remove')}</span></div>
                <div class="popup-content"></div>
                </div>
            </div>`),
            closer = popup.find('.popup-title .closer')

        closer.click(function(){
            popup.close()
        })


        popup.close = function(){
            $(document).unbind('keydown.popup')
            popup.remove()
        }

        popup.find('.popup-content').append(content)
        $('body').append(popup)

        $(document).on('keydown.popup', function(e){
            if (e.keyCode==27) popup.close()
        })


        return popup
    },

	editorEnable: function(){
        $('.editor-root').attr('data-tab','#container').removeClass('disabled')
        $('.enable-editor').addClass('on')
        $('.disable-editor').removeClass('on')

        EDITING = true
    },
	editorDisable: function(){
        $('.widget.ui-resizable').resizable('destroy')
        $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()
        $('.editing').removeClass('editing')
        $('.editor-root').addClass('disabled')
        $('.editor-container').remove()
        $('.disable-editor').addClass('on')
        $('.enable-editor').removeClass('on')

        EDITING = false
    },

    traversingDisable: function(){
        $('#container').delegateDrag('disable')
        $('.traversingEnable, .traversingDisable').toggleClass('on')
        TRAVERSING = false
    },
    traversingEnable: function(){
        $('#container').delegateDrag()
        $('.traversingEnable, .traversingDisable').toggleClass('on')
        TRAVERSING = true
    }

}
