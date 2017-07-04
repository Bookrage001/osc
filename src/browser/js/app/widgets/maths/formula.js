var _widgets_base = require('../common/_widgets_base'),
    {widgetManager} = require('../../managers'),
    {math} = require('../utils')


module.exports = class Formula extends _widgets_base {

    static defaults() {

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

    constructor(options) {

        var html = `
            <div class="formula">
                <div class="input"></div>
            </div>
        `
        super({...options, html: html})


        this.formula = String(this.getProp('formula'))
        this.condition = String(this.getProp('condition'))

        this.split = typeof this.getProp('split') == 'object' && this.getProp('split').length ? this.getProp('split') : false

        this.input = this.widget.find('.input').fakeInput({align:'center', disabled:true})

        this.linkedWidgets = []

        if (this.formula.length) {

            if (this.formula.match(/\$\{([^\}]*)\}/g) != null) this.linkedWidgets = this.linkedWidgets.concat(this.formula.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)}))

        }

        if (this.condition.length) {

            if (this.condition.match(/\$\{([^\}]*)\}/g) != null) this.linkedWidgets = this.linkedWidgets.concat(this.condition.match(/\$\{([^\}]*)\}/g).map((a)=>{return a.substr(2, a.length - 3)}))

        }


        this.formula = math.compile(this.formula.replace(/\$\{([^\}]*)\}/g, '_$1'))

        this.condition = math.compile(this.condition.replace(/\$\{([^\}]*)\}/g, '_$1'))

        this.conditionState = true


        $('body').on(`sync.${this.hash}`,this.syncHandle.bind(this))

        this.input.val('...')

    }

    onRemove() {

        $('body').off(`sync.${this.hash}`)
        super.onRemove()

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

        if (this.getProp('condition').length) {

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

            if (e.options.sync && this.conditionState) this.widget.trigger({type: 'change',id: this.getProp('id'),widget: this.widget, linkId: this.getProp('linkId'), options: e.options})
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
            (this.getProp('condition').length && !this.conditionState ? '* ' : '') +
            JSON.stringify(Formula.deepCopyWithPrecision(this.value, this.precision))
        )

    }


}
