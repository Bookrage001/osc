var _widgets_base = require('../common/_widgets_base'),
    $document = $(document)

module.exports.options = {
    type:'switch',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    horizontal:false,
    color:'auto',
    css:'',

    separator2:'osc',

    values:{"Value 1":1,"Value 2":2},
    value:'',
    precision:2,
    address:'auto',
    preArgs:[],
    target:[]
}

var Switch = module.exports.Switch = function(widgetData,container) {

        _widgets_base.apply(this, arguments)

        this.widget = $(`
            <div class="switch">
            </div>
            `)

        if (this.widgetData.horizontal) {
            this.widget.addClass('horizontal')
        }

        this.values = []

        for (k in this.widgetData.values) {
            this.values.push(this.widgetData.values[k])
            $('<div class="value">'+k+'</div>').data({value:this.widgetData.values[k]}).appendTo(this.widget)
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


Switch.prototype = Object.create(_widgets_base.prototype)

Switch.prototype.constructor = Switch


Switch.prototype.setValue = function(v,options={}) {
    var i = this.values.indexOf(v)
    if (i!=-1) {
        this.value = this.values[i]
        this.widget.find('.on').removeClass('on')
        this.widget.find('.value').eq(i).addClass('on')
        if (options.send) this.sendValue(this.value)
        if (options.sync) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options})
    }

}

module.exports.create = function(widgetData, container) {
    var _switch = new Switch(widgetData, container)
    return _switch
}
