var {widgetManager} = require('./managers'),
    ipc = require('./ipc'),
    fullscreen = require('screenfull'),
    {saveAs} = require('file-saver')


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
        var state = JSON.stringify(module.exports.stateGet(),null,'    ')
        var blob = new Blob([state],{type : 'application/x-javascript'})
        saveAs(blob, new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16))
        down[0].dispatchEvent(event)
    },

    stateGet: function (){
        var data = []
        for (let i in widgetManager.widgets) {
            var widget = widgetManager.widgets[i]
            if (widget.setValue && widget.getValue) {
                var v = widget.getValue()
                if (v!=undefined) {
                    data.push([widget.getProp('id'),v])
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

        for (let i in preset) {
            var data = preset[i],
                widgets = widgetManager.getWidgetById(data[0])
            if (widgets.length) {
                for (var j=widgets.length-1;j>=0;j--) {
                    if (widgets[j].setValue) {
                        widgets[j].setValue(data[1],{send:send,sync:true})
                    }
                }
            }
        }
    },

    toggleFullscreen: function(){

        if (fullscreen.enabled) fullscreen.toggle()

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
        var blob = new Blob([sessionfile],{type : 'application/x-javascript'})
        saveAs(blob, new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.js')
        ipc.send('savingSession')
    },

    editorEnable: function(){
        window.GRIDWIDTH =  getComputedStyle(document.documentElement).getPropertyValue("--grid-width")
        $('.editor-root').attr('data-widget', $('.root-container').attr('data-widget')).removeClass('disabled')
        $('.enable-editor').addClass('on')
        $('.disable-editor').removeClass('on')
        $('body').addClass('editor-enabled')
                 .toggleClass('no-grid', GRIDWIDTH==1)

        window.EDITING = true


        var f = $('<div class="form" id="grid-width-input"></div>'),
            h = $('<div class="separator"><span>Grid</span></div>').appendTo(f),
            w = $('<div class="input-wrapper"><label>Width</label></div>').appendTo(f),
            i = $('<input class="input" type="number" step="1" min="1" max="100"></div>').appendTo(w)

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
