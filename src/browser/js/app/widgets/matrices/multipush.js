var _matrices_base = require('./_matrices_base'),
    parser = require('../../parser')

module.exports = class Multipush extends _matrices_base {

    static defaults() {

        return {
            type:'multipush',
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

            matrix: [2,2],
            start:0,
            spacing:0,
            traversing:true,
            on:1,
            off:0,
            norelease:false,
            value:'',

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

        this.widget[0].style.setProperty('--columns', this.getProp('matrix')[0])
        this.widget[0].style.setProperty('--rows', this.getProp('matrix')[1])
        this.widget[0].style.setProperty('--spacing', this.getProp('spacing') + 'rem')

        var strData = JSON.stringify(options.props)

        for (var i = this.start; i < this.getProp('matrix')[0] * this.getProp('matrix')[1] + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'push'
            data.id = this.getProp('id') + '/' + i
            data.label = i
            data.address = this.getProp('split') ? this.getProp('address') + '/' + i : this.getProp('address')
            data.preArgs = this.getProp('split') ? this.getProp('preArgs') : [].concat(this.getProp('preArgs'), i)
            data.color = typeof this.getProp('color') == 'object' ? '' + this.getProp('color')[i % this.getProp('color').length] : this.getProp('color')
            data.css = ''

            var element = parser.parse([data], this.widget, this)
            element[0].classList.add('not-editable')

            this.value[i-this.start] = this.getProp('off')

        }

        if (this.getProp('traversing')) this.widget.enableTraversingGestures()

    }

}
