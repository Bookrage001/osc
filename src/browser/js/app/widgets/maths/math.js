var _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers')


module.exports = class Math extends _widgets_base {

    static options() {

        return {
            type:'math',
            id:'auto',
            linkId:'',

            _math: 'math',

            formula: '',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _osc:'osc',

            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(widgetData) {

        var widgetHtml = `
            <div class="math">
                <div class="input"></div>
            </div>
        `

        super(...arguments, widgetHtml)

        this.input = this.widget.find('.input').fakeInput({align:'center', disabled:true})

        this.linkedWidgets = widgetData.formula.match(/\$\{([^\}]*)\}/g) == null ? [] : widgetData.formula.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)})

        $('body').on(`sync.${this.hash}`,this.syncHandle.bind(this))

    }

    onRemove() {

        $('body').off(`sync.${this.hash}`)

    }

    syncHandle(e) {

        if (this.linkedWidgets.indexOf(e.id)==-1 || !widgetManager.getWidgetById(e.id).length) return
        this.updateValue(e)

    }

    updateValue(e){

        var formula = this.widgetData.formula,
            id

        for (id of this.linkedWidgets) {
            if (id !== undefined) {
                formula = formula.replace('${' + id + '}', widgetManager.getWidgetById(id)[0].getValue())
            }
        }

        try {

            this.value = eval(formula)

            this.input.val(typeof this.value != 'object' ? this.value.toFixed(this.widgetData.precision) : this.value.map((a)=>{return a.toFixed(this.widgetData.precision)}))

            if (e.options.sync) this.widget.trigger({type: 'sync',id: this.widgetData.id,widget: this.widget, linkId: this.widgetData.linkId, options: e.options})
            if (e.options.send) this.sendValue(this.value)

        } catch(err) {

            throw 'Error parsing formula "' + formula + '"'

        }

    }

}
