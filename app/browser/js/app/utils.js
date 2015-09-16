sendOsc = function(data){
    // Unpack args for osc sending function
    if (data[0]) {
        ipc.send('sendOsc', {target:data[0],path:data[1],args:data[2]});
    }
}

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
    var readEditableConfig = remote.getGlobal('readEditableConfig')
    var writeConfig = remote.getGlobal('writeConfig')
    var config = readEditableConfig()

    var form = $('<form></form>')


    $.each(config,function(i) {
        var item = $('<div>\
            <label for="'+i+'">'+i+'</label>\
            <p class="info">'+config[i].info+'</p>\
            </div>')


        var input = $('<input name="'+i+'" value="'+config[i].value+'"/>')

        input.change(function(){
            var v = input.val().trim().replace(/[\s]+/,' ')
            input.val(v)
            console.log([v,v.match(config[i].match)])
            if (v.match(config[i].match)==null) {
                input.addClass('invalid')
            } else {
                input.removeClass('invalid')
            };

        })

        item.append(input)

        form.append(item)

    })

    var submit = $('<a class="btn submit">'+icon('save')+'&nbsp;Save</a>')

    form.append(submit)

    popup = createPopup(icon('gear')+'&nbsp;Preferences',form)

    submit.click(function(e){
        e.preventDefault()

        if ($('input.invalid').length>0) {
            return
        }

        var data = form.serializeArray(),
            newconfig = {}

        for (i in data) {
            newconfig[data[i].name] = data[i].value
        }

        writeConfig(newconfig)

        popup.close();

    })
}

hsbToRgb = function (hsb) {
	var rgb = {};
	var h = hsb.h;
	var s = hsb.s*255/100;
	var v = hsb.b*255/100;
	if(s == 0) {
		rgb.r = rgb.g = rgb.b = v;
	} else {
		var t1 = v;
		var t2 = (255-s)*v/255;
		var t3 = (t1-t2)*(h%60)/60;
		if(h==360) h = 0;
		if(h<60) {rgb.r=t1;	rgb.b=t2; rgb.g=t2+t3}
		else if(h<120) {rgb.g=t1; rgb.b=t2;	rgb.r=t1-t3}
		else if(h<180) {rgb.g=t1; rgb.r=t2;	rgb.b=t2+t3}
		else if(h<240) {rgb.b=t1; rgb.r=t2;	rgb.g=t1-t3}
		else if(h<300) {rgb.b=t1; rgb.g=t2;	rgb.r=t2+t3}
		else if(h<360) {rgb.r=t1; rgb.g=t2;	rgb.b=t1-t3}
		else {rgb.r=0; rgb.g=0;	rgb.b=0}
	}
	return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
};
rgbToHsb = function (rgb) {
    var hsb = {h: 0, s: 0, b: 0};
    var min = Math.min(rgb.r, rgb.g, rgb.b);
    var max = Math.max(rgb.r, rgb.g, rgb.b);
    var delta = max - min;
    hsb.b = max;
    hsb.s = max != 0 ? 255 * delta / max : 0;
    if (hsb.s != 0) {
        if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
        else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
        else hsb.h = 4 + (rgb.r - rgb.g) / delta;
    } else hsb.h = 0;
    hsb.h *= 60;
    if (hsb.h < 0) hsb.h += 360;
    hsb.s *= 100/255;
    hsb.b *= 100/255;
    return hsb;
};


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
