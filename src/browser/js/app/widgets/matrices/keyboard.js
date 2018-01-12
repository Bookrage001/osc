var _matrices_base = require('./_matrices_base'),
    parser = require('../../parser')


module.exports = class Keyboard extends _matrices_base {

    static defaults() {

        return {
            type:'keyboard',
            id:'auto',


            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _matrix: 'Matrix',

            keys: 24,
            start:60,
            traversing:true,
            on:1,
            off:0,

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(options) {

        super(options)

        this.keys = parseInt(this.getProp('keys'))

        var strData = JSON.stringify(options.props),
            pattern = 'wbwbwwbwbwbw',
            wCount = 0

        for (var i = this.start; i < this.keys + this.start && i < 108; i++) {

            var data = JSON.parse(strData)


            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'push'
            data.id = this.getProp('id') + '/' + i
            data.label = false
            data.address = this.getProp('split') ? this.getProp('address') + '/' + i : this.getProp('address')
            data.preArgs = this.getProp('split') ? this.getProp('preArgs') : [].concat(this.getProp('preArgs'), i)
            data.css = ''

            var element = parser.parse([data], this.widget, this)
            element[0].classList.add('not-editable')

            if (pattern[i % 12] == 'w') {
                element.addClass('white')
                wCount++
            } else {
                element.addClass('black').data('wCount',wCount)

            }

            this.value[i-this.start] = this.getProp('off')

        }

        this.widget.find('.widget.white').css('width',`${100/wCount}%`)
        this.widget.find('.widget.black').each(function(){
            $(this).css({
                'width':`${100/wCount * 6/10}%`,
                'left':`${100/wCount * ($(this).data('wCount') - 3/10)}%`
            })

        })

        if (this.getProp('traversing')) this.widget.enableTraversingGestures()

    }

}
