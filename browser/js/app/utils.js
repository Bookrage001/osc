

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
            html = $('<a href="" class="'+classname+' btn">'+label+'</a>')
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
