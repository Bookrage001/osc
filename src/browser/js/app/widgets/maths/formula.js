var _widgets_base = require('../common/_widgets_base'),
    widgetManager = require('../../managers/widgets'),
    {math} = require('../utils'),
    Input = require('../inputs/input')


module.exports = class Formula extends _widgets_base {

    static defaults() {

        return {
            type:'formula',
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

            _math: 'math',

            formula: '',
            condition: '',
            unit: '',

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
            </div>
        `
        super({...options, html: html})


        this.formula = String(this.getProp('formula'))
        this.condition = String(this.getProp('condition'))

        this.split = typeof this.getProp('split') == 'object' && this.getProp('split').length ? this.getProp('split') : false

        this.input = new Input({
            props:{
                ...Input.defaults(),
                editable:false,
                precision:this.getProp('precision'),
                unit: this.getProp('unit')
            },
            parent:this, parentNode:this.widget
        })

        this.widget.appendChild(this.input.widget)

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


        widgetManager.on(`change.${this.hash}`,this.syncHandle.bind(this))
        this.updateValue({options:{}})

    }

    onRemove() {

        widgetManager.off(`change.${this.hash}`)
        super.onRemove()

    }

    syncHandle(e) {

        if (this.linkedWidgets.indexOf(e.id)==-1 || !widgetManager.getWidgetById(e.id).length) return
        this.updateValue(e)

    }

    updateValue(e){

        var variables = {},
            id, n = 0

        for (let id of this.linkedWidgets) {
            if (id !== undefined) {
                let widgets = widgetManager.getWidgetById(id)
                for (let w of widgets) {
                    if (w.getValue) {
                        variables['_'+id] = w.getValue()
                        n++
                        break
                    }
                }

            }
        }

        if (!this.linkedWidgets.length || n < this.linkedWidgets.length) return


        if (this.getProp('condition').length) {

            try {

                var s = this.condition.eval(variables).valueOf()

                if (Array.isArray(s) && s.length == 1) s = s[0]

                this.conditionState = s.data !== undefined ? s.data : s

            } catch(err) {

                throw 'Error parsing formula "' + this.condition + '" (' + err + ')'

            }

        }

        try {

            var v = this.formula.eval(variables).valueOf()

            if (Array.isArray(v) && v.length == 1) v = v[0]

            this.value = v.data ? v.data : v

            this.showValue()

            if (e.options.sync && this.conditionState) this.changed(e.options)
            if (e.options.send && this.conditionState) this.sendValue()

        } catch(err) {

            throw 'Error parsing formula "' + this.formula + '" (' + err + ')'

        }

    }

    showValue() {

        this.input.setValue(this.value)

        if (this.getProp('condition').length && !this.conditionState) {
            this.input.stringValue = '* ' + this.input.stringValue
            this.input.batchDraw()
        }

    }

}
