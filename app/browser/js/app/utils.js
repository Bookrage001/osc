sendOsc = function(data){
    ipc.send('sendOsc', data)
}

var state

stateQuickSave = function(preset){
    if (preset) {
        state = preset
    } else {
        state = stateGet()
    }
    $('[data-action="stateQuickLoad"]').removeClass('disabled')
}
stateQuickLoad = function(){
    stateSet(state,true)
}
stateSave = function() {
    state = stateGet()
    if (webFrame) {
        ipc.send('stateSave',state)
    } else {
        var down = $('<a download="'+new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.preset"></a>')
        var blob = new Blob([state],{type : 'text/plain'});
        down.attr('href', window.URL.createObjectURL(blob))
        down[0].click()
    }

}
stateGet = function (){
    var data = []
    $.each(__widgets__,function(i,widget) {
        var v = widget[widget.length-1].getValue()
        if (v!=undefined) data.push(i+' '+v)
    })
    return data.join('\n')
}
stateLoad = function() {
    if (webFrame) {
        ipc.send('stateLoad')
    } else {
        var prompt = $('<input type="file" accept=".preset"/>')
        prompt.click()
        prompt.on('change',function(e){
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var preset = e.target.result
                stateSet(preset,true)
                laststate = preset
            }
            reader.readAsText(e.target.files[0],'utf-8');
        })
    }
}

stateSend = function(){
    var data = stateGet()
    stateSet(data,true)

}
stateSet = function(preset,send){

    $.each(preset.split('\n'),function(i,d) {
        var data = d.split(' ')

        setTimeout(function(){
            if (__widgets__[data[0]]!=undefined) {
                __widgets__[data[0]][__widgets__[data[0]].length-1].setValue(data[1].split(','),send,true)
            }
        },i)
    })
}
toggleFullscreen = function(){

    if (webFrame) {
        ipc.send('fullscreen')
    } else {
        var isInFullScreen = document.webkitIsFullScreen

        if (isInFullScreen) {
            document.webkitExitFullscreen()
        } else {
            document.documentElement.webkitRequestFullScreen()
        }
    }
}

sessionBrowse = function(){

    if (webFrame) {
        ipc.send('sessionBrowse')
    } else {
        var prompt = $('<input type="file" accept=".js"/>')
        prompt.click()
        prompt.on('change',function(e){
            var reader = new FileReader();
            reader.onloadend = function(e) {
                var session = e.target.result
                ipc.send('sessionOpen',{file:session})
            }
            reader.readAsText(e.target.files[0],'utf-8');
        })
    }
}

sessionSave = function() {
    var sessionfile = JSON.stringify(session,null,'    ')
    if (webFrame) {
        ipc.send('sessionSave',sessionfile)
    } else {
        var down = $('<a download="'+new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16)+'.js"></a>')
        var blob = new Blob([sessionfile],{type : 'text/plain'});
        down.attr('href', window.URL.createObjectURL(blob))
        down[0].click()
    }

}


icon = function(i) {
    return `<i class="fa fa-fw fa-${i}"></i>`
}

createMenu = function(template) {
    var menu = $('<ul id="options"></ul>')

    var closureClick = function(item) {
        return function() {
          item.click()
          return false
        }
    }

    for (i in template) {
        var item = template[i],
            label = item.label || 'undefined',
            classname = item.class || '',
            wrapper = $('<li></li>'),
            html

        if (!item.html) {
            html = $(`<a class="${classname} btn">${label}</a>`)
        } else {
            html = $(item.html)
        }

        if (item.icon) html.prepend(icon(item.icon)+'&nbsp;')

        if (item.click) html.on('click',closureClick(item))

        wrapper.append(html)
        menu.append(wrapper)
    }

    return menu

}



createPopup = function(title,content) {
    var popup = $(`
        <div class="popup">
            <div class="popup-wrapper">
            <div class="popup-title">${title}<span class="closer">${icon('remove')}</span></div>
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
}
