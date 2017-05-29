var _matrices_base = require('./_matrices_base')

module.exports = class Keyboard extends _matrices_base {

    static options() {

        return {
            type:'keyboard',
            id:'auto',

            _matrix: 'Matrix',

            keys: 24,
            start:60,

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _behaviour:'behaviour',

            traversing:true,

            _osc:'osc',

            on:1,
            off:0,
            precision:2,
            address:'auto',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(widgetData) {

        super(...arguments)

        this.keys = parseInt(this.getOption('keys'))

        var strData = JSON.stringify(widgetData),
            pattern = 'wbwbwwbwbwbw',
            wCount = 0

        var parsers = require('../../parser'),
            parsewidgets = parsers.widgets

        for (var i = this.start; i < this.keys + this.start && i < 108; i++) {

            var data = JSON.parse(strData)


            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'push'
            data.id = this.getOption('id') + '/' + i
            data.label = false
            data.address = this.getOption('split') ? this.getOption('address') + '/' + i : this.getOption('address')
            data.preArgs = this.getOption('split') ? this.getOption('preArgs') : [].concat(this.getOption('preArgs'), i)
            data.css = ''

            var element = parsewidgets([data],this.widget)
            element[0].classList.add('not-editable')

            if (pattern[i % 12] == 'w') {
                element.addClass('white')
                wCount++
            } else {
                element.addClass('black').data('wCount',wCount)

            }

            this.value[i-this.start] = this.getOption('off')

        }

        this.widget.find('.widget.white').css('width',`${100/wCount}%`)
        this.widget.find('.widget.black').each(function(){
            $(this).css({
                'width':`${100/wCount * 6/10}%`,
                'left':`${100/wCount * ($(this).data('wCount') - 3/10)}%`
            })

        })

        if (this.getOption('traversing')) this.widget.enableTraversingGestures()

    }

}
