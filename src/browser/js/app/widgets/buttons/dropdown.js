var Widget = require('../common/widget'),
    {iconify} = require('../../ui/utils')

class Dropdown extends Widget {

    static defaults() {

        return {
            type:'dropdown',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style: 'style',

            label:'auto',
            color:'auto',
            css:'',

            _dropdown:'dropdown',

            values:{"Value 1":1,"Value 2":2},

            _value: 'value',
            default:'',
            value: '',

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        super({...options, html: '<div class="select"></div>'})

        this.select = this.widget.appendChild(DOM.create(`<select></select>`))

        this.values = []
        this.keys = []

        this.parseValues()

        this.select.addEventListener('change', ()=>{
            this.setValue(this.values[this.select.selectedIndex - 1], {sync:true, send:true, fromLocal:true})
        })

        this.value = undefined
        this.select.selectedIndex = -1
        this.container.classList.add('noselect')

    }

    parseValues() {

        var i = 0,
            values = this.getProp('values'),
            html = ''

        if (!Array.isArray(values) && !(typeof values === 'object' && values !== null)) {
            values = values !== '' ? [values] : []
        }

        html += `<option value=""></option>`

        this.values = []

        for (var k in values) {
            this.values.push(values[k])
            html += `<option value="${i}">${iconify(parseFloat(k) != k ? k : values[k])}</option>`
            i++
        }

        this.select.innerHTML = html

    }

    setValue(v,options={}) {

        var i = this.values.indexOf(v)

        this.value = this.values[i]

        if (!options.fromLocal) this.select.selectedIndex = i + 1

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    onPropChanged(propName, options, oldPropValue) {

        var ret = super.onPropChanged(...arguments)

        switch (propName) {

            case 'values':
                this.parseValues()
                this.setValue(this.value)
                return

        }

        return ret

    }

}

Dropdown.dynamicProps = Dropdown.prototype.constructor.dynamicProps.concat(
    'values'
)


module.exports = Dropdown
