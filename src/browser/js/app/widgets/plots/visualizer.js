var {mapToScale, clip} = require('../utils'),
    _plots_base = require('./_plots_base'),
    {widgetManager} = require('../../managers')

module.exports = class Visualizer extends _plots_base {

    static defaults() {

        return {
            type:'visualizer',
            id:'auto',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            pips:true,
            color:'auto',
            css:'',

            _plot:'plot',

            widgetId:'',
            duration:1,
            range: {min:0,max:1},
            origin: 'auto',
            logScale: false,

            _osc:'osc',

            value:'',
            address:'auto',
            preArgs:[],
        }

    }

    constructor(options) {

        super(options)

        this.fps = 30
        this.pips.y.min = Math.abs(this.getProp('range').min) >= 1000? this.getProp('range').min/1000+'k' : this.getProp('range').min
        this.pips.y.max = Math.abs(this.getProp('range').max) >= 1000? this.getProp('range').max/1000+'k' : this.getProp('range').max
        this.pips.x = false
        this.length = Math.round(clip(this.fps * this.getProp('duration'), [8, 4096]))
        this.data = new Array(this.length)
        this.value = this.getProp('range').min
        this.cancel = false
        this.looping = false
        this.clock = 0
        this.lastUpdate = 0
        this.watchDuration = 1000 * this.getProp('duration')
        this.ticks = 0

    }

    syncHandle(e) {

        if (this.getProp('widgetId')!=e.id || !widgetManager.getWidgetById(e.id).length || !e.widget) return
        this.setValue(e.widget.getValue())

    }

    startLoop() {

        this.clock = new Date().getTime()
        if (!this.looping) {
            this.lastUpdate = new Date().getTime()
            this.looping = true
            this.ticks = 0
            this.loop()
        }
    }

    loop() {

        var t = new Date().getTime()

        if (t -this.clock >= this.watchDuration) {
            this.looping = false
        }

        this.ticks += (t - this.lastUpdate) / (1000/this.fps)

        if (Math.floor(this.ticks) > 0) {
            this.shiftData(Math.floor(this.ticks))
            this.ticks -= Math.floor(this.ticks)
            this.draw()
        }

        this.lastUpdate = t

        if (!this.looping) return

        setTimeout(()=>{
            this.loop()
        }, (1000/this.fps))

    }


    draw_data() {

        var first = true
        var point = []

        for (var i=0;i<this.length;i++) {
            var newpoint = [
                mapToScale(i,[0,this.length-1],[0,this.width],1),
                mapToScale(this.data[i],[this.getProp('range').min,this.getProp('range').max],[this.height-PXSCALE,PXSCALE],1,this.getProp('logScale'),true),
            ]
            if (first) {
                this.ctx.moveTo(newpoint[0],newpoint[1])
                first = false
            } else {
                if (this.getProp('logScale')) {
                    this.ctx.quadraticCurveTo(newpoint[0], point[1], newpoint[0], newpoint[1])
                } else {
                    this.ctx.lineTo(newpoint[0],newpoint[1])
                }

            }
            point = newpoint
        }

    }

    shiftData(n) {

        for (var i=0; i<n; i++) {
            this.data.push(this.value)
            this.data.splice(0,1)
        }

    }

    setValue(v) {

        this.value = v
        this.startLoop()

    }

}
