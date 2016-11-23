var _matrices_base = require('./_matrices_base')

module.exports.options = {
    type:'keyboard',
    id:'auto',

    separator0: 'Matrix',

    keys: 24,
    start:60,

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    css:'',

    separator2:'behaviour',

    traversing:true,

    separator3:'osc',

    on:1,
    off:0,
    precision:2,
    address:'auto',
    preArgs:[],
    target:[]
}


var Keyboard = module.exports.Keyboard = function(widgetData) {

    _matrices_base.apply(this,arguments)


    var strData = JSON.stringify(widgetData),
        pattern = 'wbwbwwbwbwbw',
        wCount = 0

    for (var i=widgetData.start;i<widgetData.keys+widgetData.start;i++) {

        var data = JSON.parse(strData)


        data.top = data.left = data.height = data.width = 'auto'
        data.type = 'push'
        data.id = widgetData.id + '/' + i
        data.label = false
        data.address = widgetData.address + '/' + i

		var element = parsewidgets([data],this.widget)
		element[0].classList.add('not-editable')

        if (pattern[i % 12] == 'w') {
            element.addClass('white')
            wCount++
        } else {
            element.addClass('black').data('wCount',wCount)

        }

        this.value[i] = widgetData.off

	}

    this.widget.find('.widget.white').css('width',`${100/wCount}%`)
    this.widget.find('.widget.black').each(function(){
        $(this).css({
            'width':`${100/wCount * 6/10}%`,
            'left':`${100/wCount * ($(this).data('wCount') - 3/10)}%`
        })

    })

    if (widgetData.traversing) this.widget.enableTraversingGestures()


}

Keyboard.prototype = Object.create(_matrices_base.prototype)

Keyboard.prototype.constructor = Keyboard

module.exports.create = function(widgetData) {
    var keyboard = new Keyboard(widgetData)
    return keyboard.widget
}
