var _matrices_base = require('./_matrices_base'),
    parser = require('../../parser')

module.exports = class Multifader extends _matrices_base {

    static defaults() {

        return {
            type:'multifader',
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

            _matrix:'Matrix',

            strips:2,
            start:0,
            traversing:true,
            value:'',

            _fader: 'fader',

            range:{min:0,max:1},
            logScale:false,
            unit:'',
            origin: 'auto',
            snap:true,

            meter:false,
            alignRight:false,
            horizontal:false,
            pips:false,
            input:true,
            compact:false,
            dashed:false,


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

        this.strips = parseInt(this.getProp('strips'))

        if (this.getProp('horizontal')) {
            this.widget.addClass('horizontal')
        }

        if (this.getProp('compact')) {
            this.widget.addClass('compact')
        }

        var strData = JSON.stringify(options.props)

        for (var i = this.start; i < this.strips + this.start; i++) {

            var data = JSON.parse(strData)

            data.top = data.left = data.height = data.width = 'auto'
            data.type = 'fader'
            data.id = this.getProp('id') + '/' + i
            data.label = i
            data.address = this.getProp('split') ? this.getProp('address') + '/' + i : this.getProp('address')
            data.preArgs = this.getProp('split') ? this.getProp('preArgs') : [].concat(this.getProp('preArgs'), i)
            data.color = typeof this.getProp('color') == 'object' ? '' + this.getProp('color')[i % this.getProp('color').length] : this.getProp('color')
            data.css = ''

            var element = parser.parse([data],this.widget)
            element[0].classList.add('not-editable')

            if (this.getProp('traversing')) element.find('canvas').off('drag')

            this.value[i-this.start] = this.getProp('range').min

        }

        if (this.getProp('traversing')) this.widget.enableTraversingGestures({ctrlKeyCancel:true})

        this.registerHashes()

    }

}
