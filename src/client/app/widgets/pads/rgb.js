var Pad = require('./pad'),
    Xy = require('./xy'),
    Fader = require('./_fake_fader'),
    {mapToScale, hsbToRgb, rgbToHsb} = require('../utils'),
    Input = require('../inputs/input'),
    html = require('nanohtml')

var faderDefaults = Fader.defaults()._props(),
    xyDefaults = Xy.defaults()._props()

module.exports = class Rgb extends Pad {

    static defaults() {

        return super.defaults({

            _rgb:'rgb',

            snap: {type: 'boolean', value: false, help: [
                'By default, the points are dragged from their initial position.',
                'If set to `true`, touching anywhere on the widget\'s surface will make them snap to the touching coordinates',
            ]},
            spring: {type: 'boolean', value: false, help: 'When set to `true`, the widget will go back to its default value when released'},
            range: {type: 'object', value: {min: 0, max: 255}, help: 'Defines the widget\'s output scale.'},
            input: {type: 'boolean', value: true, help: 'Set to `false` to hide the built-in input widget'},
            alphaChannel:{type:'boolean',value:true,help:'add alpha channel'}

        }, ['color'], {

            split: {type: 'boolean|object', value: false, help: [
                'Set to `true` to send separate osc messages for for r and g & b. The address will be the same as the widget\'s with `/r`, `/g` or `/b` appended to it',
                'Can be set as an `object` to specify a different address : `[\'/r\', \'/g\', \'b\']`',
                'Note: the widget will only respond to its original osc address, not to the splitted version'
            ]}
        })

    }

    constructor(options) {

        options.props.pointSize = 10

        super(options)

        this.hueWrapper = this.widget.appendChild(html`<div class="hue-wrapper"></div>`)

        this.hue = new Fader({props:{
            ...faderDefaults,
            id:'h',
            compact:true,
            pips:false,
            horizontal:true,
            snap:this.getProp('snap'),
            range:{min:0,max:360},
            input:false,
            precision:2
        }, cancelDraw: false, parent: this})
        this.hue.sendValue = ()=>{}
        this.hueWrapper.appendChild(this.hue.widget)

        this.pad = new Xy({props:{
            ...xyDefaults,
            snap:this.getProp('snap'),
            spring:this.getProp('spring'),
            rangeX:{min:0,max:100},
            rangeY:{min:0,max:100},
            precision:2,
            pointSize: this.getProp('pointSize'),
            pips: false,
            input:false
        }, parent: this})
        this.pad.sendValue = ()=>{}
        this.wrapper.appendChild(this.pad.widget)


        this.value = []
        this.hsb = {h:0,s:0,b:0}

        this.hue.on('change',(e)=>{
            e.stopPropagation = true
            this.dragHandle(true)
        })

        this.pad.on('change',(e)=>{
            e.stopPropagation = true
            this.dragHandle()
        })

        if (this.getProp('alphaChannel')) {
            this.alphaWrapper = this.widget.appendChild(html`<div class="alpha-wrapper"></div>`)
            this.alpha = new Fader({props:{
                ...faderDefaults,
                id:'a',
                compact:true,
                pips:false,
                horizontal:true,
                snap:this.getProp('snap'),
                range:{min:0,max:255},
                default: 255,
                input:false,
                precision:2
            }, cancelDraw: false, parent: this})
            this.alpha.sendValue = ()=>{}
            this.alphaWrapper.appendChild(this.alpha.widget)
            this.alpha.on('change',(e)=>{
                e.stopPropagation = true
                this.dragAlphaHandle()
            })
        }

        if (this.getProp('input')) {

            this.input = new Input({
                props:{...Input.defaults()._props(), precision:this.getProp('precision'), unit:this.getProp('unit')},
                parent:this, parentNode:this.widget
            })
            this.widget.appendChild(this.input.widget)
            this.input.on('change', (e)=>{
                e.stopPropagation = true
                this.setValue(this.input.getValue(), {sync:true, send:true})
                this.showValue()
            })

        }


        this.setValue([this.getProp('range').min, this.getProp('range').min, this.getProp('range').min])

    }

    dragHandle(hue) {
        var h = this.hue.value,
            s = this.pad.value[0],
            b = this.pad.value[1]

        if (h != this.hsb.h ||s != this.hsb.s || b != this.hsb.b) {

            this.hsb.h = this.hue.value
            this.hsb.s = this.pad.value[0]
            this.hsb.b = this.pad.value[1]

            this.update({nohue:!hue})

            var rgb = hsbToRgb(this.hsb),
                {min, max} = this.getProp('range')

            if (min !== 0 || max !== 255) {
                for (var k in rgb) {
                    rgb[k] = min + max * rgb[k] / 255
                }
            }

            if (rgb.r != this.value[0] || rgb.g != this.value[1] || rgb.b != this.value[2]) {
                this.setValue([rgb.r, rgb.g, rgb.b],{send:true,sync:true,dragged:true,nohue:!hue})
            }
        }

    }

    dragAlphaHandle() {

        var alpha = this.alpha.value
        if (alpha !== this.value[3]) {
            this.setValue([this.value[0], this.value[1], this.value[2], alpha],{send:true,sync:true,dragged:true,nohue:true})
        }


    }

    setValue(v, options={}) {

        if (!v || v.length < 3) return
        if (this.touched && !options.dragged) return this.setValueTouchedQueue = [v, options]

        var value = Array(this.getProp('alphaChannel') ? 4 : 3)
        for (var i = 0; i < value.length; i++) {
            value[i] = mapToScale(v[i], [0, 255], [this.getProp('range').min, this.getProp('range').max])
        }

        var hsb = rgbToHsb({
            r: value[0],
            g: value[1],
            b: value[2]
        })

        if (!options.dragged) {
            this.pad.setValue([hsb.s, hsb.b], {sync: false, send:false, dragged:false})
            if (value.length === 4) this.alpha.setValue(value[3], {sync: false, send:false, dragged:false})
        }

        this.hsb = hsb
        this.value = value


        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

        this.update({dragged:options.dragged, nohue:options.nohue || (v[0]==v[1]&&v[1]==v[2])})

    }

    update(options={}) {

        if (!options.nohue && !options.dragged) {
            var hue = hsbToRgb({h:this.hsb.h,s:100,b:100}),
                hueStr = `rgb(${Math.round(hue.r)},${Math.round(hue.g)},${Math.round(hue.b)})`
            this.canvas.setAttribute('style',`background-color:${hueStr}`)
            this.hue.setValue(this.hsb.h, {sync: false, send:false, dragged:false})
        }


        this.showValue()

    }

    draw() {}

    showValue() {

        if (this.getProp('input')) this.input.setValue(this.value)

    }

    getSplit() {

        return this.getProp('split')?
            typeof this.getProp('split') == 'object' && this.getProp('split').length == 3 ?
                this.getProp('split')
                : [this.getProp('address') + '/r', this.getProp('address') + '/g', this.getProp('address') + '/b']
            : false

    }

    onPropChanged(propName, options, oldPropValue) {

        if (super.onPropChanged(...arguments)) return true

        switch (propName) {

            case 'color':
                for (var w of [this.hue, this.pad]) {
                    w.onPropChanged('color')
                }
                if (this.input) this.input.onPropChanged('color')
                return

        }

    }

    onRemove() {
        this.hue.onRemove()
        this.pad.onRemove()
        if (this.input) this.input.onRemove()
        super.onRemove()
    }

}
