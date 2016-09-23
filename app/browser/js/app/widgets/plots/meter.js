var {mapToScale, clip} = require('../utils')

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


    if (widgetData.horizontal) widget.addClass('horizontal')


    var rangeKeys = [],
        rangeVals = []

    for (k in widgetData.range) {
        var key = k=='min'?0:k=='max'?100:parseInt(k),
            val = typeof widgetData.range[k] == 'object'?
                        widgetData.range[k][Object.keys(widgetData.range[k])[0]]:
                        widgetData.range[k]

        rangeKeys.push(key)
        rangeVals.push(val)
    }



    widget.updateUi = function(v){
        var s = v/100,
            t = dimension=='height'?
                '1,'+s+',1'
                :s+',1,1'
        level[0].setAttribute('style','transform:scale3d('+t+')')
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
