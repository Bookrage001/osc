var _widgets_base = require('../common/_widgets_base'),
    {iconify} = require('../../ui/utils')

module.exports = class Dropdown extends _widgets_base {

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
            value:'',

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

        var i = 0
        for (var k in this.getProp('values')) {
            this.values[i] = this.getProp('values')[k]
            this.select.innerHTML += `<option value="${i}">${iconify(parseFloat(k) != k ? k : this.getProp("values")[k])}</option>`
            i++
        }

        this.select.addEventListener('change', ()=>{
            this.setValue(this.values[this.select.selectedIndex], {sync:true, send:true, fromLocal:true})
        })

        this.value = undefined
        this.select.selectedIndex = -1
        this.container.classList.add('noselect')

    }

    setValue(v,options={}) {

        var i = this.values.indexOf(v)

        if (i != -1) {
            this.value = this.values[i]
            if (!options.fromLocal) this.select.selectedIndex = i
            if (options.send) this.sendValue()
            if (options.sync) this.changed(options)
            this.container.classList.remove('noselect')
        } else {
            this.value = undefined
            this.select.selectedIndex = -1
            if (options.sync) this.changed(options)
            this.container.classList.add('noselect')
        }

    }}
