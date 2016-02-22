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


hsbToRgb = function (hsb) {
	var rgb = {}
	var h = hsb.h
	var s = hsb.s*255/100
	var v = hsb.b*255/100
	if(s == 0) {
		rgb.r = rgb.g = rgb.b = v
	} else {
		var t1 = v
		var t2 = (255-s)*v/255
		var t3 = (t1-t2)*(h%60)/60
		if(h==360) h = 0
		if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
		else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
		else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
		else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
		else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
		else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
		else {rgb.r=0; rgb.g=0;	rgb.b=0}
	}
	return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)}
}
rgbToHsb = function (rgb) {
    var hsb = {h: 0, s: 0, b: 0}
    var min = Math.min(rgb.r, rgb.g, rgb.b)
    var max = Math.max(rgb.r, rgb.g, rgb.b)
    var delta = max - min
    hsb.b = max
    hsb.s = max != 0 ? 255 * delta / max : 0
    if (hsb.s != 0) {
        if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta
        else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta
        else hsb.h = 4 + (rgb.r - rgb.g) / delta
    } else hsb.h = 0
    hsb.h *= 60
    if (hsb.h < 0) hsb.h += 360
    hsb.s *= 100/255
    hsb.b *= 100/255
    return hsb
}

sizeToAngle = function(size) {
    return clip(Math.acos((size/100))*180/Math.PI,[0,90])
}
clip = function(value,range) {
    var max = Math.max,
        min = Math.min,
        value = parseFloat(value)
        if (isNaN(value)) value = range[0]

        return max(min(range[0],range[1]),min(parseFloat(value),max(range[0],range[1])))

}

// map a value from a scale to another input and output must be range arrays
mapToScale = function(value,rangeIn,rangeOut,reverse) {

    var max = Math.max,
        min = Math.min,
      round = Math.round,
      value = clip(value,[rangeIn[0],rangeIn[1]])

    value = ((value-rangeIn[0])/(rangeIn[1]-rangeIn[0])) * (rangeOut[1]-rangeOut[0]) + rangeOut[0]

    if (reverse) value = max(rangeOut[0],rangeOut[1])+min(rangeOut[0],rangeOut[1])-value

    value = max(min(rangeOut[0],rangeOut[1]),min(value,max(rangeOut[0],rangeOut[1])))

    value = round(value*100)/100

    return value

}

function isSame(a1, a2){
    if (a1.sort && a2.sort) {
        return !(a1.sort() > a2.sort() || a1.sort() < a2.sort());
    } else {
        return a1==a2
    }
}


$.fn.ripple = function() {
    $(this).removeClass('ripple').addClass('ripple').delay(250).queue(function(next){
        $(this).removeClass('ripple');
        next();
    });
}
