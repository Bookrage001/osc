var {remote, ipcRenderer, shell} = eval('require(\'electron\')'),
    {dialog, Menu, MenuItem, app} = remote.require('electron'),
    menu = new Menu(),
    settings = remote.require('./main/settings'),
    packageInfos = remote.require('./package.json'),
    packageVersion = packageInfos.version,
    packageUrl = packageInfos.repository.url,
    argv_remote = settings.read('argv'),
    argv = {},
    $ = require('jquery/dist/jquery.slim.min.js')

for (i in argv_remote) {
    argv[i] = argv_remote[i]
}

$(document).ready(()=>{

    var form = $(`
        <form class="form" id="form">
            <div class="btn header"><span id="title">Open Stage Control</span> <span id="version">(v${packageVersion})</span><span id="new-version"</div>
        </form>
    `)

    $.each(settings.options, (i, option)=>{

        if (option.launcher === false) return

        var name = option.alias || i,
            value = (argv[name] == undefined ? '' : argv[name]) || (argv[i] == undefined ? '' : argv[i]), // compat fix for 0.34.2 ,
            wrapper = $('<div class="item-wrapper"></div>'),
            item = $(`
            <div class="input-wrapper">
                <label>${name}</label>
            </div>
            `).appendTo(wrapper),
            input,
            cancel

        delete argv[i] // compat fix for 0.34.2

        var strValue
        if (Array.isArray(value)) {
            strValue = value.map(x=>x.includes(' ') ? '"'+x+'"' : x).join(' ')
        } else {
            strValue = value
        }

        input = $(`<input class="input" name="${name}" data-type="${option.type}" placeholder="${option.describe}"/>`)
        input.val(strValue)

        if (option.type == 'boolean') {

            var toggle = $(`<span class="checkbox ${value?'on':''}"><i class="fa fa-fw fa-check"></i></span>`)
            toggle.appendTo(item)

            toggle.click(function(e){
                e.preventDefault()
                input.val(!eval(input.val())).trigger('change')
                toggle.toggleClass('on')
            })

        }

        if (option.file) {

            var browse = $('<span class="checkbox">...</span>')
            browse.appendTo(item)

            browse.click(function(e){
                e.preventDefault()
                dialog.showOpenDialog({filters:[{name:option.file.name,extensions:option.file.extensions}]},function(file){
                    input.val(file).change()
                })
            })

        }



        input.appendTo(item)

        input.on('change',function(e,stop){

            var v = $(this).val().trim(),
                fail = false

            try {
                if (option.type == 'boolean') {
                    v = v == 'true' ? true : ''
                    input.val(v)
                } else if (v && option.type == 'array'){
                    v = v.replace(/("[^"]*"|'[^'*]*')/g, (m)=>{
                        return m.replace(/\s/, '_SPÂCE_').substr(1, m.length - 2)
                    })
                    v = v.split(' ')
                    v = v.map(x=>x.replace(new RegExp('_SPÂCE_', 'g'), ' '))
                } else if (v && option.type == 'number'){
                    v = parseFloat(v)
                }
            } catch (err) {
                fail = err
            }

            if (fail || v !== '' && option.check && option.check(v, argv) !== true) {
                wrapper.addClass('error')
                wrapper.find('.error-msg').remove()
                wrapper.append(`<div class="error-msg">${fail || option.check(v, argv   )}</div>`)
            } else {
                wrapper.removeClass('error')
                wrapper.find('.error-msg').remove()
                argv[name] = v
            }

            if (option.restart && v!=value && !wrapper.hasClass('restart')) {
                wrapper.addClass('restart')
                wrapper.append('<div class="restart-msg">The app must be restarted for this change to take effect.</div>')
            } else if (option.restart && wrapper.hasClass('restart')) {
                wrapper.removeClass('restart')
                wrapper.find('.restart-msg').remove()
            }

            if (!stop) $('input').not(input).trigger('change',true)
        })

        cancel = $('<div class="btn clear"><i class="fa fa-times fa-fw"></i></div>')
        cancel.click((e)=>{
            e.preventDefault()
            if (option.type == 'boolean') {
                input.val('false')
            } else {
                input.val('')
            }
            input.trigger('change')
        })
        cancel.appendTo(item)

        form.append(wrapper)

    })


    var save = $('<div class="btn start save">Save</div>').appendTo(form),
        saveWithCallback = function(callback) {
            $('input').change()
            if (form.find('.error').length) return

            setTimeout(()=>{

                for (i in argv) {
                    if (argv[i] === '') {
                        argv[i] = undefined
                    }
                }
                try {
                    settings.makeDefaultConfig(argv)
                    settings.write('argv',argv)
                    save.addClass('saved')
                    setTimeout(()=>{
                        save.removeClass('saved')
                    }, 250)
                    if (callback) callback()
                } catch (err) {

                }

            },1)
        }

    save.click((e)=>{

        e.preventDefault()
        saveWithCallback()

    })

    // Starter (oneshot)

    var start = $('<div class="btn start">Start</div>').appendTo(form)
    start.click((e)=>{

        e.preventDefault()
        saveWithCallback(()=>{
            start.off('click')
            save.off('click')
            $('input').attr('disabled','true')
            $('.clear').addClass('disabled')
            $('.checkbox').addClass('disabled')
            ipcRenderer.send('start')
        })

    })

    form.appendTo('body')


    // server started callback
    ipcRenderer.on('started',function(){
        start.remove()
        save.remove()
        terminal.show()
        document.body.scrollTop = document.body.offsetHeight + document.body.scrollHeight
    })

    // Fake console
    var terminal = $('<div class="terminal"></div>').appendTo(form).hide(),
        autoscoll = true

    ipcRenderer.on('stdout', function(e, msg){
        terminal.append(`<div class="log">${msg}</div>`)
        if (autoscoll) document.body.scrollTop = document.body.offsetHeight + document.body.scrollHeight
    })

    ipcRenderer.on('stderr', function(e, msg){
        terminal.append(`<div class="error">${msg}</div>`)
        if (autoscoll) document.body.scrollTop = document.body.offsetHeight + document.body.scrollHeight
    })


    // context-menu

    menu.append(new MenuItem({role: 'copy'}))
    menu.append(new MenuItem({role: 'paste'}))
    menu.append(new MenuItem({type: 'submenu' , label: 'Console', submenu: [
        new MenuItem({
            label: 'Clear',
            click: ()=>{
                terminal.empty()
            }
        }),
        new MenuItem({
            label: 'Autoscroll',
            type: 'checkbox',
            checked: true,
            click: function(e){
                autoscoll = e.checked
            }
        })
    ]}))
    menu.append(new MenuItem({type: 'submenu' , label: 'App', submenu: [
        new MenuItem({
            label: 'Relaunch',
            click: ()=>{
                app.relaunch()
                app.exit(0)
            }
        }),
    ]}))


    window.addEventListener('contextmenu', function(e) {
        menu.items[0].enabled = !!window.getSelection().toString()
        menu.items[1].enabled = $(e.target).is('input:not([disabled])')
        menu.popup({ window: remote.getCurrentWindow(), x: e.pageX, y: e.pageY - document.body.scrollTop})
    }, false)


    // ready

    $('input').trigger('change')


    $('#loading').remove()
    setTimeout(()=>{
        form.addClass('loaded')
    },0)


    // open links in system's browser
    $(document).click((e)=>{
        var url = $(e.target).attr('href')
        if (url) {
            e.preventDefault()
            shell.openExternal(url)
        }
    })

    // New version info
    if (navigator.onLine) {

        var request = new XMLHttpRequest()
        request.open('GET', 'https://api.github.com/repos/jean-emmanuel/open-stage-control/tags', true)

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText)

                if (data[0].name != 'v' + packageVersion) {
                    $('#new-version').html(` [<a href="${packageUrl}/releases" target="_blank">${data[0].name} is available</a>]`)
                }

            }
        }

        request.send()

    }

})
