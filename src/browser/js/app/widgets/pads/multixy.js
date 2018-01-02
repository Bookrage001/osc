var _pads_base = require('./_pads_base'),
    Xy = require('./xy'),
    {clip} = require('../utils')

var xyDefaults = Xy.defaults()


module.exports = class MultiXy extends _pads_base {

    static defaults() {

        return {
            type:'xy',
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

            _mutlixy:'multi xy',

            points: 2,
            pointSize: 20,
            snap:false,
            spring:false,
            pips: true,
            rangeX:{min:0,max:1},
            rangeY:{min:0,max:1},
            logScaleX:false,
            logScaleY:false,
            value:'',

            _osc:'osc',

            precision:2,
            address:'auto',
            touchAddress:'',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(options) {

        super(options)

        this.npoints = typeof this.getProp('points') == 'object' ? this.getProp('points').length : this.getProp('points')
        this.labels = typeof this.getProp('points') == 'object'
        this.pointSize = parseInt(this.getProp('pointSize'))

        this.split = this.getProp('split')?
                        typeof this.getProp('split') == 'object' && this.getProp('split').length == 2 * this.npoints ?
                            this.getProp('split')
                            : (()=>{
                                var s={},
                                    t
                                for (var i=0; i<this.npoints * 2;i=i+2) {
                                    t = this.labels ? this.getProp('points')[i/2] : i/2
                                    s[i]=this.getProp('address') + '/' + t + '/x'
                                    s[i+1]=this.getProp('address') + '/' + t + '/y'
                                };
                                return s
                            })()
                        : false

        this.handles = []
        this.handlesPositions = []
        this.handlesToPads = []

        this.pads = []

        for (var i=this.npoints-1;i>=0;i--) {
            this.pads[i] = new Xy({props:{
                ...xyDefaults,
                snap:this.getProp('snap'),
                spring:this.getProp('spring'),
                value:this.getProp('value').length == this.getProp('points') * 2 ? [this.getProp('value')[i*2], this.getProp('value')[i*2 + 1]] : '',
                rangeX:this.getProp('rangeX'),
                rangeY:this.getProp('rangeY'),
                precision:this.precision,
                logScaleX:this.getProp('logScaleX'),
                logScaleY:this.getProp('logScaleY'),
                pointSize: this.getProp('pointSize'),
                pips: this.getProp('pips') && i == this.npoints-1,
                input:false
            }})
            this.pads[i].sendValue = ()=>{}
            this.wrapper.append(this.pads[i].widget)

            this.handles[i] = $(`<div class="handle"></div>`)

            this.wrapper.append(this.handles[i])

        }


        this.value = []

        this.handles.forEach((handle, index)=>{

            handle.on('draginit',(e, data, traversing)=>{

                if (!traversing) {
                    handle.addClass('active')
                }

                var id, ndiff, diff = -1

                for (var i in this.handles) {
                    if (this.handlesToPads.indexOf(i) != -1) continue
                    ndiff = Math.abs(data.offsetX -  this.handlesPositions[i][0]) + Math.abs(data.offsetY - (this.handlesPositions[i][1] + this.height))
                    if (diff == -1 || ndiff < diff) {
                        id = i
                        diff = ndiff
                    }
                }

                this.handlesToPads[index] = id

                if (this.pads[id]) this.pads[id].wrapper.trigger(e.type, [data, traversing])

            })

            handle.on('drag',(e, data, traversing)=>{

                var id = this.handlesToPads[index]
                if (this.pads[id]) this.pads[id].wrapper.trigger(e.type, [data, traversing])

            })

            handle.on('dragend',(e, data, traversing)=>{

                var id = this.handlesToPads[index]
                if (this.pads[id]) this.pads[id].wrapper.trigger(e.type, [data, traversing])
                handle.removeClass('active')
                this.handlesToPads[index] = false

            })

        })

        this.wrapper.on('change',(e)=>{
            e.stopPropagation()
            this.setValue(this.getValue(), e.options)
        })


        var v = []
        for (var i=0;i<this.npoints * 2;i=i+2) {
            [v[i],v[i+1]]  = this.pads[i/2].getValue()
        }

        this.setValue(v)

    }

    resizeHandle() {

        super.resizeHandle(...arguments)
        this.updateHandlesPosition()

    }

    updateHandlesPosition() {

        for (var i=0;i<this.npoints;i++) {

            this.handlesPositions[i] = [clip(this.pads[i].faders.x.percent,[0,100]) / 100 * (this.width - (this.pointSize * 2 + 2) * PXSCALE) + (this.pointSize + 1) * PXSCALE
                                        ,- clip(this.pads[i].faders.y.percent,[0,100]) / 100 * (this.height - (this.pointSize * 2 + 2) * PXSCALE) - (this.pointSize + 1) * PXSCALE]

        }

    }

    draw() {

        this.clear()

        for (var i=0;i<this.npoints;i++) {
            var margin = (this.pointSize + 1) * PXSCALE,
                x = clip(this.pads[i].faders.x.percent,[0,100]) / 100 * (this.width - 2 * margin) + margin,
                y = (100 - clip(this.pads[i].faders.y.percent,[0,100])) / 100 * (this.height - 2 * margin) + margin,
                t = (this.labels ? this.getProp('points')[i] : i) + '',
                length = this.fontSize * t.length

            this.ctx.globalAlpha = 1
            this.ctx.fillStyle = this.colors.text
            this.ctx.fillText(t, x + 0.5 * PXSCALE, y + 0.5 * PXSCALE)

            this.clearRect[i] = [x - length / 2, y - this.fontSize / 2, length, this.fontSize]

        }

    }

    getValue() {

        var v = []
        for (var i=0;i<this.pads.length * 2;i=i+2) {
            [v[i],v[i+1]] = this.pads[i/2].getValue()
        }
        return v

    }

    setValue(v, options={}) {

        if (!v || !v.length || v.length!=this.npoints * 2) return
        if (this.touched && !options.dragged) return this.setValueTouchedQueue = [v, options]

        for (var i=0;i<this.npoints;i++) {
            if (!options.dragged) {
                this.pads[i].setValue([v[i*2],v[i*2+1]])
            }
        }

        this.updateHandlesPosition()
        this.draw()

        for (var i=0;i<this.npoints * 2;i=i+2) {
            [this.value[i],this.value[i+1]]  = this.pads[i/2].getValue()
        }

        if (options.send) this.sendValue()
        if (options.sync) this.widget.trigger({type:'change', id:this.getProp('id'),widget:this, linkId:this.getProp('linkId'), options:options})

    }

}
