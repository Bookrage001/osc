var utils = require('./utils'),
    sizeToAngle = utils.sizeToAngle,
    clip = utils.clip,
    mapToScale = utils.mapToScale

module.exports.options = {
    type:'fader',
    id:'auto',

    separator1:'style',

    label:'auto',
    unit:'',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    horizontal:false,
    color:'auto',
    css:'',

    separator3:'osc',

    range:{min:0,max:1},
    logScale:false,
    path:'auto',
    preArgs:[]
}

module.exports.create = function(widgetData,container) {
    var widget = $(`
        <div class="meter">
			<div class="level"></div>
		</div>
		`),
        level = widget.find('.level'),
        logScale = widgetData.logScale,
		dimension = widgetData.horizontal?'width':'height',
    	axe = dimension=='height'?'X':'Y'


    if (widgetData.horizontal) level.addClass('horizontal')



	var range = {}
    for (k in widgetData.range) {
        if (k=='min') {
            range[0]=widgetData.range[k]
        } else if (k=='max') {
            range[100]=widgetData.range[k]
        } else {
            range[parseInt(k)]=widgetData.range[k]
        }
    }

    var rangeKeys = Object.keys(range).map(function (key) {return parseInt(key)}),
        rangeVals = Object.keys(range).map(function (key) {return parseFloat(range[key])})




    widget.updateUi = function(v){
        var r = sizeToAngle(v)
        level[0].setAttribute('style','transform:rotate'+axe+'('+ r +'deg)')
    }


    widget.setValue = function(v) {
        if (typeof v != 'number') return

        var h,
            v=clip(v,[rangeVals[0],rangeVals.slice(-1)[0]])
        for (var i=0;i<rangeVals.length-1;i++) {
            if (v <= rangeVals[i+1] && v >= rangeVals[i]) {
                h = mapToScale(v,[rangeVals[i],rangeVals[i+1]],[rangeKeys[i],rangeKeys[i+1]],2,logScale,true)
                break
            }
        }

        widget.updateUi(h)

    }

    widget.setValue(rangeVals[0])

    return widget
}
