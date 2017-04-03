var _pads_base = require('./_pads_base'),
    Xy = require('./xy'),
    {clip} = require('../utils')

module.exports = class MultiXy extends _pads_base {

    static options() {

        return {
            type:'xy',
            id:'auto',
            linkId:'',

            _mutlixy:'multi xy',

            points: 2,
            pointSize: 20,
            snap:false,
            spring:false,

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            css:'',

            _osc:'osc',

            rangeX:{min:0,max:1},
            rangeY:{min:0,max:1},
            logScaleX:false,
            logScaleY:false,
            value:'',
            precision:2,
            address:'auto',
            preArgs:[],
            split:false,
            target:[]
        }

    }

    constructor(widgetData) {

        super(...arguments)

        this.npoints = typeof widgetData.points == 'object' ? widgetData.points.length : widgetData.points
        this.labels = typeof widgetData.points == 'object'
        this.pointSize = parseInt(widgetData.pointSize)
        this.widget[0].style.setProperty("--point-size",this.pointSize + 'rem')

        this.split = widgetData.split?
                        typeof widgetData.split == 'object' && widgetData.split.length == 2 * this.npoints ?
                            widgetData.split
                            : (()=>{
                                var s={},
                                    t
                                for (var i=0; i<this.npoints * 2;i=i+2) {
                                    t = this.labels ? widgetData.points[i/2] : i/2
                                    s[i]=widgetData.address + '/' + t + '/x'
                                    s[i+1]=widgetData.address + '/' + t + '/y'
                                };
                                return s
                            })()
                        : false

        this.handles = []
        this.handlesPositions = []
        this.handlesToPads = []

        this.pads = []

        for (var i=this.npoints-1;i>=0;i--) {
            this.pads[i] = new Xy({
                snap:widgetData.snap,
                spring:widgetData.spring,
                value:widgetData.value.length == widgetData.points * 2 ? [widgetData.value[i*2], widgetData.value[i*2 + 1]] : '',
                rangeX:widgetData.rangeX,
                rangeY:widgetData.rangeY,
                precision:widgetData.precision,
                logScaleX:widgetData.logScaleX,
                logScaleY:widgetData.logScaleY
            }, false)
            this.pads[i].sendValue = ()=>{}
            this.pads[i].draw = ()=>{}
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

        this.wrapper.on('sync',(e)=>{
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

        this.ctx.clearRect(0,0,this.width,this.height)

        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'

        for (var i=0;i<this.npoints;i++) {
            var x = clip(this.pads[i].faders.x.percent,[0,100]) / 100 * (this.width - (this.pointSize * 2 + 2) * PXSCALE) + (this.pointSize + 1) * PXSCALE,
                y = (100 - clip(this.pads[i].faders.y.percent,[0,100])) / 100 * (this.height - (this.pointSize * 2 + 2) * PXSCALE) + (this.pointSize + 1) * PXSCALE,
                t = this.labels ? this.widgetData.points[i] : i

                this.ctx.globalAlpha = 0.3
                this.ctx.strokeStyle = this.colors.custom
                this.ctx.fillStyle = this.colors.custom
                this.ctx.lineWidth = PXSCALE * 2

                this.ctx.beginPath()
                this.ctx.arc(x, y, this.pointSize * PXSCALE, Math.PI * 2, false)
                this.ctx.fill()
                this.ctx.beginPath()
                this.ctx.arc(x, y, (this.pointSize-1) * PXSCALE, Math.PI * 2, false)
                this.ctx.stroke()

                this.ctx.globalAlpha = 1
                this.ctx.fillStyle = this.colors.text
                this.ctx.strokeStyle = this.colors.text
                this.ctx.lineWidth = PXSCALE
                this.ctx.font = PXSCALE * 11 + 'px Droid Sans'
                this.ctx.fillText(t, x, y)
                this.ctx.strokeText(t, x, y)

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
        if (options.sync) this.widget.trigger({type:'sync', id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})

    }

}
