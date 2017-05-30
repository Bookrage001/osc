var _widgets_base = require('../common/_widgets_base'),
    {iconify} = require('../../utils'),
    $document = $(document)

module.exports = class Switch extends _widgets_base {

    static defaults() {

        return {
            type:'switch',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            horizontal:false,
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

    constructor(props) {

        var widgetHtml = `
            <div class="switch"></div>
        `

        super(...arguments, widgetHtml)

        if (this.getProp('horizontal')) this.widget.addClass('horizontal')

        this.values = []

        for (var k in this.getProp('values')) {
            this.values.push(this.getProp('values')[k])
            $(`<div class="value">${iconify(parseFloat(k) != k ? k : this.getProp("values")[k])}</div>`).data({value:this.getProp('values')[k]}).appendTo(this.widget)
        }

        this.value = undefined

        this.widget.find('.value').on('draginit',(e,dd)=>{
            var index = 0,
                node = e.target

            while ( (node = node.previousSibling) ) {
                if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
                    index++;
                }
            }

            var value = this.values[index]

            if (value!=this.value || this.value===undefined) this.setValue(value,{sync:true,send:true})
        })

    }

    setValue(v,options={}) {

        var i = this.values.indexOf(v)
        if (i!=-1) {
            this.value = this.values[i]
            this.widget.find('.on').removeClass('on')
            this.widget.find('.value').eq(i).addClass('on')
            if (options.send) this.sendValue(this.value)
            if (options.sync) this.widget.trigger({type:'sync',id:this.getProp('id'),widget:this.widget, linkId:this.getProp('linkId'), options})
        } else {
            this.widget.find('.on').removeClass('on')
            this.value = undefined
            if (options.sync) this.widget.trigger({type:'sync',id:this.getProp('id'),widget:this.widget, linkId:this.getProp('linkId'), options})
        }

    }}
