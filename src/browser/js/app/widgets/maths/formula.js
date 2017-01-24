var _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers'),
    {mathEval} = require('../utils')


module.exports = class Formula extends _widgets_base {

    static options() {

        return {
            type:'formula',
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
            <div class="formula">
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

            this.value = mathEval(formula).valueOf()

            this.showValue()
            if (e.options.sync) this.widget.trigger({type: 'sync',id: this.widgetData.id,widget: this.widget, linkId: this.widgetData.linkId, options: e.options})
            if (e.options.send) this.sendValue(this.value)

        } catch(err) {

            throw 'Error parsing formula "' + formula + '" (' + err + ')'

        }

    }

    static deepCopyWithPrecision(obj, precision) {

            var copy = obj,
                key

            if (typeof obj === 'object') {
                copy = Array.isArray(obj) ? [] : {}
                for (key in obj) {
                    copy[key] = Formula.deepCopyWithPrecision(obj[key], precision)
                }
            } else if (typeof obj == 'number') {
                return copy.toFixed(precision)
            }

            return copy

    }

    showValue() {

        this.input.val(Formula.deepCopyWithPrecision(this.value, this.widgetData.precision))

    }


}
