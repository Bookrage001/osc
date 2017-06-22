var _widgets_base = require('../common/_widgets_base'),
    {iconify} = require('../../utils'),
    $document = $(document)

module.exports = class Select extends _widgets_base {

    static defaults() {

        return {
            type:'select',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _osc:'osc',

            values:{"Value 1":1,"Value 2":2},
            value:'',
            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(options) {

        super({...options, html: '<div class="select"></div>'})

        this.select = $(`<select></select>`).appendTo(this.widget)

        this.values = []

        var i = 0
        for (var k in this.getProp('values')) {
            this.values[i] = this.getProp('values')[k]
            this.select.append(`<option value="${i}">${iconify(parseFloat(k) != k ? k : this.getProp("values")[k])}</option>`)
            i++
        }

        this.select.change(()=>{
            this.setValue(this.values[this.select[0].selectedIndex], {sync:true, send:true, fromLocal:true})
        })

        this.value = undefined
        this.select[0].selectedIndex = -1
        this.container.addClass('noselect')

    }

    setValue(v,options={}) {

        var i = this.values.indexOf(v)

        if (i != -1) {
            this.value = this.values[i]
            if (!options.fromLocal) this.select[0].selectedIndex = i
            if (options.send) this.sendValue()
            if (options.sync) this.widget.trigger({type:'sync',id:this.getProp('id'),widget:this.widget, linkId:this.getProp('linkId'), options})
            this.container.removeClass('noselect')
        } else {
            this.value = undefined
            this.select[0].selectedIndex = -1
            if (options.sync) this.widget.trigger({type:'sync',id:this.getProp('id'),widget:this.widget, linkId:this.getProp('linkId'), options})
            this.container.addClass('noselect')
        }

    }}
