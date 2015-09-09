

saveState = function () {
    var data = getState()
    ipc.send('save',data.join('\n'))
}
getState = function (){
    var data = []
    $.each(__widgets__,function(i,widget) {
        data.push(widget[0].type+':'+i+':'+widget[0].getValue())
    })
    return data
}
loadState = function() {
    ipc.send('load')
}

sendState = function(){
    var data = getState().join('\n')
    setState(data)

}
setState = function(preset){

    $.each(preset.split('\n'),function(i,d) {
        var data = d.split(':')

        setTimeout(function(){
            if (__widgets__[data[1]]!=undefined) {
                __widgets__[data[1]][0].setValue(data[2].split(','),true,true)
            }
        },i)
    })
}


// inspector
findNode = function(searchID, searchObject) {
    var result=false;
    $.each(searchObject,function(id,object){

        if (id==searchID) {
            result = searchObject[id]
            return false
        } else if (typeof  searchObject[id] === 'object'){
            result = findNode(searchID, searchObject[id])
        }
        if (result !== false) {return false}
    })
    return result
}

icon = function(i) {
    return '<i class="fa fa-fw fa-'+i+'"></i>'
}

createMenu = function(template) {
    var menu = $('<ul id="options"></ul>')

    var closureClick = function(item) {
        return function() {
          item.click();
          return false
        };
    }

    for (i in template) {
        var item = template[i],
            label = item.label || 'undefined',
            classname = item.class || '',
            wrapper = $('<li></li>'),
            html

        if (!item.html) {
            html = $('<a class="'+classname+' btn">'+label+'</a>')
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
    var popup = $('\
        <div class="popup">\
            <div class="popup-wrapper">\
            <div class="popup-title">'+title+'<span class="closer">'+icon('remove')+'</span></div>\
            <div class="popup-content"></div>\
            </div>\
        </div>'),
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




var remote = require('remote');
configPanel = function(){
    var readConfig = remote.getGlobal('readConfig')
    var writeConfig = remote.getGlobal('writeConfig')
    var config = readConfig()

    var form = $('<form></form>')

    for (i in config) {
        var html = $('\
            <label for="'+i+'">'+i+'</label>\
            <p class="info">'+config[i].info+'</p>\
            <input name="'+i+'" value="'+config[i].value+'"/>')
        form.append(html)
    }

    var submit = $('<a class="btn submit">'+icon('save')+'&nbsp;Save configuration</a>')

    form.append(submit)

    popup = createPopup(icon('gear')+'&nbsp;Configuration panel',form)

    submit.click(function(e){
        e.preventDefault()
        var data = form.serializeArray(),
            newconfig = {}

        for (i in data) {
            newconfig[data[i].name] = data[i].value
        }

        writeConfig(newconfig)

        popup.close();

    })



}
