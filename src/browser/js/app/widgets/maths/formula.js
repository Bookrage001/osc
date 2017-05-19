var _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers'),
    {math} = require('../utils')


module.exports = class Formula extends _widgets_base {

    static options() {

        return {
            type:'formula',
            id:'auto',
            linkId:'',

            _math: 'math',

            formula: '',
            condition: '',

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
            split:[],
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

        widgetData.formula = String(widgetData.formula)
        widgetData.condition = String(widgetData.condition)

        this.split = typeof widgetData.split == 'object' && widgetData.split.length ? widgetData.split : false

        this.input = this.widget.find('.input').fakeInput({align:'center', disabled:true})

        this.linkedWidgets = []

        if (widgetData.formula.length) {

            if (widgetData.formula.match(/\$\{([^\}]*)\}/g) != null) this.linkedWidgets = this.linkedWidgets.concat(widgetData.formula.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)}))

        }

        if (widgetData.condition.length) {

            if (widgetData.condition.match(/\$\{([^\}]*)\}/g) != null) this.linkedWidgets = this.linkedWidgets.concat(widgetData.condition.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)}))

        }


        this.formula = math.compile(widgetData.formula.replace(/\$\{([^\}]*)\}/g, '_$1'))

        this.condition = math.compile(widgetData.condition.replace(/\$\{([^\}]*)\}/g, '_$1'))

        this.conditionState = true


        $('body').on(`sync.${this.hash}`,this.syncHandle.bind(this))

        this.input.val('...')

    }

    onRemove() {

        $('body').off(`sync.${this.hash}`)

    }

    syncHandle(e) {

        if (this.linkedWidgets.indexOf(e.id)==-1 || !widgetManager.getWidgetById(e.id).length) return
        this.updateValue(e)

    }

    updateValue(e){

        var variables = {},
            id

        for (let id of this.linkedWidgets) {
            if (id !== undefined) {
                variables['_'+id] = widgetManager.getWidgetById(id)[0].getValue()
            }
        }

        if (this.widgetData.condition.length) {

            try {

                var s = this.condition.eval(variables).valueOf()

                this.conditionState = s.data !== undefined ? s.data : s

            } catch(err) {

                throw 'Error parsing formula "' + this.condition + '" (' + err + ')'

            }

        }

        try {

            var v = this.formula.eval(variables).valueOf()

            this.value = v.data ? v.data : v

            this.showValue()

            if (e.options.sync && this.conditionState) this.widget.trigger({type: 'sync',id: this.widgetData.id,widget: this.widget, linkId: this.widgetData.linkId, options: e.options})
            if (e.options.send && this.conditionState) this.sendValue()

        } catch(err) {

            throw 'Error parsing formula "' + this.formula + '" (' + err + ')'

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
                return parseFloat(copy.toFixed(precision))
            }

            return copy

    }

    showValue() {

        this.input.val(
            (this.widgetData.condition.length && !this.conditionState ? '* ' : '') +
            JSON.stringify(Formula.deepCopyWithPrecision(this.value, this.widgetData.precision))
        )

    }


}
