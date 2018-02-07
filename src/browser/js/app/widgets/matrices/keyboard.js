var Matrix = require('./matrix'),
    parser = require('../../parser')


module.exports = class Keyboard extends Matrix {

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
            whiteKeys = 0, whiteKeys2 = 0, i

        for (i = this.start; i < this.keys + this.start && i < 108; i++) {
            if (pattern[i % 12] == 'w') whiteKeys++
        }

        for (i = this.start; i < this.keys + this.start && i < 108; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'push'
            data.id = this.getProp('id') + '/' + i
            data.label = false
            data.address = this.getProp('split') ? '@{parent.address}/' + i : '@{parent.address}'
            data.preArgs = this.getProp('split') ? '@{parent.preArg}' : '#{concat(@{parent.preArg}),' + i + '}'
            data.css = ''

            var key = parser.parse([data], this.widget, this)
            key.container.classList.add('not-editable')

            if (pattern[i % 12] == 'w') {
                key.container.classList.add('white')
                key.container.style.width = `${100/whiteKeys}%`
                whiteKeys2++
            } else {
                key.container.classList.add('black')
                key.container.style.width = `${60 / whiteKeys}%`
                key.container.style.left = `${100 / whiteKeys * (whiteKeys2 - 3/10)}%`
            }

            this.value[i-this.start] = this.getProp('off')

        }

    }

}
