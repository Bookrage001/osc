var Widget = require('../common/widget')
var morph = require('nanomorph')

class Svg extends Widget {

    static defaults() {

        return {
            type:'svg',
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

            _svg:'svg',

            svg:'',

            _osc:'osc',

            preArgs:[],
            address:'auto'

        }

    }

    constructor(options) {

        var html = `
            <div class="svg">
                <svg></svg>
            </div>
        `

        super({...options, html: html})

        this.height = undefined
        this.width = undefined

        this.on('resize', this.resizeHandleProxy.bind(this), {element: this.widget})

    }

    updateSvg(){

        if (!this.width || !this.height) return

        var svg = this.getProp('svg')

        svg = svg.replace(/([0-9\.]+%)[\s\n]*,/g, m => (parseFloat(m) * this.width / 100).toFixed(2) + ',')
        svg = svg.replace(/,[\s\n]*([0-9\.]+%)/g, m => ',' + (parseFloat(m.slice(1)) * this.height / 100).toFixed(2))


        morph(this.widget, DOM.create('<div class="svg"><svg>' + svg + '</svg></div>'))

    }

    resizeHandleProxy() {

        this.resizeHandle(...arguments)

    }

    resizeHandle(event){

        var {width, height, style} = event,
            ratio = CANVAS_SCALING * this.scaling

        this.height = height
        this.width = width

        this.updateSvg()

    }


    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'svg':
                this.updateSvg()
                return

        }

    }


}

Svg.dynamicProps = Svg.prototype.constructor.dynamicProps.concat(
    'svg'
)

module.exports = Svg
