var _widgets_base = require('../common/_widgets_base'),
    {iconify} = require('../../ui/utils')

module.exports = class Switch extends _widgets_base {

    static defaults() {

        return {
            type:'switch',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _switch:'switch',

            horizontal:false,
            showValues:false,
            values:{"Value 1":1,"Value 2":2},
            value:'',


            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        super({...options, html: '<div class="switch"></div>'})


        if (this.getProp('horizontal')) this.widget.classList.add('horizontal')

        this.values = []
        this.stringValues = []

        var isArray = Array.isArray(this.getProp('values'))

        for (var k in this.getProp('values')) {

            this.values.push(this.getProp('values')[k])

            if (typeof this.getProp('values')[k] == 'object') {
                this.stringValues.push(JSON.stringify(this.getProp('values')[k]))
            } else {
                this.stringValues.push(-1)
            }

            var label = isArray ? this.getProp('values')[k]: k
            if (this.getProp('showValues') && !isArray) label = label + ': ' + this.getProp('values')[k]

            this.widget.appendChild(DOM.create(`
                <div class="value"> ${iconify(label)}</div>
            `))

        }

        this.value = undefined

        this.on('draginit', (e)=>{

            var index = 0,
                node = e.target

            while ( (node = node.previousSibling) ) {
                if (node.nodeType != 3) {
                    index++;
                }
            }

            var value = this.values[index]

            if (value!=this.value || this.value===undefined) this.setValue(value,{sync:true,send:true})

        }, {element: this.widget})

    }

    setValue(v, options={}) {

        var i = typeof v == 'object' ?
                this.stringValues.indexOf(JSON.stringify(v)) :
                this.values.indexOf(v)

        DOM.each(this.widget, '.on', (el)=>{el.classList.remove('on')})

        if (i!=-1) {
            this.value = this.values[i]
            DOM.get(this.widget, '.value')[i].classList.add('on')
            if (options.send) this.sendValue(this.value)
            if (options.sync) this.changed(options)
        } else {
            this.value = undefined
            if (options.sync) this.changed(options)
        }

    }}
