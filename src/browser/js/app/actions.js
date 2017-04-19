var {widgetManager} = require('./managers'),
    ipc = require('./ipc')

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
        state = JSON.stringify(module.exports.stateGet(),null,'    ')
        var down = $('<a download="'+new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.preset"></a>')
        var blob = new Blob([state],{type : 'application/x-javascript'})
        down.attr('href', window.URL.createObjectURL(blob))
        var event = new MouseEvent("click")
        down[0].dispatchEvent(event)
    },

    stateGet: function (){
        var data = []
        for (i in widgetManager.widgets) {
            var widget = widgetManager.widgets[i]
            if (widget.setValue && widget.getValue) {
                var v = widget.getValue()
                if (v!=undefined) {
                    data.push([widget.widgetData.id,v])
                    continue
                }
            }
        }
        return data
    },

    stateLoad: function() {
        var prompt = $('<input type="file" accept=".preset"/>')
        prompt.click()
        prompt.on('change',function(e){
            var reader = new FileReader()
            reader.onloadend = function(e) {
                var preset = e.target.result
                module.exports.stateSet(JSON.parse(preset),true)
                STATE = preset
            }
            reader.readAsText(e.target.files[0],'utf-8')
        })
    },

    stateSend: function(){
        var data = module.exports.stateGet()
        module.exports.stateSet(data,true)

    },

    stateSet: function(preset,send){

        for (i in preset) {
            var data = preset[i],
                widgets = widgetManager.getWidgetById(data[0])
            if (widgets.length) {
                for (var i=widgets.length-1;i>=0;i--) {
                    if (widgets[i].setValue) {
                        widgets[i].setValue(data[1],{send:send,sync:true})
                    }
                }
            }
        }
    },

    toggleFullscreen: function(){

        var isInFullScreen = document.webkitFullscreenElement || document.mozFullScreenElement

        if (isInFullScreen) {
            if (document.webkitExitFullscreen) document.webkitExitFullscreen()
            if (document.mozCancelFullScreen) document.mozCancelFullScreen()
        } else {
            if (document.documentElement.webkitRequestFullScreen) document.documentElement.webkitRequestFullScreen()
            if (document.documentElement.mozRequestFullScreen) document.documentElement.mozRequestFullScreen(true)
        }

    },

    sessionBrowse: function(){

        var prompt = $('<input type="file" accept=".js"/>')
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

    },

    sessionSave: function() {
        var sessionfile = JSON.stringify(SESSION,null,'    ')
        var down = $('<a download="'+new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.js"></a>')
        var blob = new Blob([sessionfile],{type : 'application/x-javascript'})
        down.attr('href', window.URL.createObjectURL(blob))
        var event = new MouseEvent("click")
        down[0].dispatchEvent(event)
        ipc.send('savingSession')
    },

    editorEnable: function(){
        GRIDWIDTH =  getComputedStyle(document.documentElement).getPropertyValue("--grid-width")
        $('.editor-root').attr('data-tab','#container').removeClass('disabled')
        $('.enable-editor').addClass('on')
        $('.disable-editor').removeClass('on')
        $('body').addClass('editor-enabled')
                 .toggleClass('no-grid', GRIDWIDTH==1)

        EDITING = true


        var f = $('<div class="form" id="grid-width-input"></div>'),
            h = $('<div class="separator"><span>Grid</span></div>').appendTo(f),
            w = $('<div class="input-wrapper"><label>Width</label></div>').appendTo(f),
            i = $('<input type="number" step="1" min="1" max="100"></div>').appendTo(w)

        i.val(GRIDWIDTH)
        i.on('keyup mouseup change mousewheel',()=>{
            setTimeout(()=>{
                var v = Math.max(Math.min(parseInt(i.val()),100),1)
                if (isNaN(v)) return
                i.val(v)
                GRIDWIDTH = v
                $('body').toggleClass('no-grid', GRIDWIDTH==1)
                document.documentElement.style.setProperty("--grid-width",GRIDWIDTH)
            })
        })
        $('.editor-menu').append(f)
    },
    editorDisable: function(){
        $('.widget.ui-resizable').resizable('destroy')
        $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()
        $('.editing').removeClass('editing')
        $('.editor-root').addClass('disabled')
        $('.editor-container').remove()
        $('.disable-editor').addClass('on')
        $('.enable-editor').removeClass('on')
        $('body').removeClass('editor-enabled')
        $('#grid-width-input').remove()
        EDITING = false
        if (READ_ONLY) {
            module.exports.editorEnable = ()=>{}
            $('.editor-menu .btn').remove()
            $('.editor-menu .title').html($('.editor-menu .title').html() + ' (disabled)').addClass('disabled')
        }
    },
    traversingDisable: function(){
        $('.traversingEnable, .traversingDisable').toggleClass('on')
        $('#container').trigger('disableTraversingGestures')
    },
    traversingEnable: function(){
        $('.traversingEnable, .traversingDisable').toggleClass('on')
        $('#container').enableTraversingGestures()
    }

}
