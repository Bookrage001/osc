var {clip} = require('../utils'),
    _plots_base = require('./_plots_base')

module.exports = class Visualizer extends _plots_base {

    static defaults() {

        return super.defaults({

            _visualizer:'visualizer',

            duration: {type: 'number', value: 1, help: 'Defines visualization duration in seconds'},
            range: {type: 'object', value: {min:0,max:1}, help: 'Defines the min and max values for the y axis'},
            origin: {type: 'number', value: 'auto', help: 'Defines the y axis origin. Set to `false` to disable it'},
            logScale: {type: 'boolean', value: false, help: 'Set to `true` to use logarithmic scale for the y axis'},
            smooth: {type: 'boolean|number', value: false, help: 'Set to `true` to make the line smooth. Float values are also acceptable (works fine between `0` and `0.5`)'},
            pips:{type: 'boolean', value: true, help: 'Set to `false` to hide the scale'},

        }, ['target', 'precision', 'bypass'], {})

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }

        super(options)

        this.fps = CANVAS_FRAMERATE
        this.pips.y.min = Math.abs(this.getProp('range').min) >= 1000? this.getProp('range').min/1000+'k' : this.getProp('range').min
        this.pips.y.max = Math.abs(this.getProp('range').max) >= 1000? this.getProp('range').max/1000+'k' : this.getProp('range').max
        this.pips.x = false
        this.rangeY = this.getProp('range') || {min:0,max:1}
        this.logScaleY = this.getProp('logScale')
        this.length = Math.round(clip(this.fps * this.getProp('duration'), [8, 4096]))
        this.value = new Array(this.length).fill(this.rangeY.min)
        this.cancel = false
        this.looping = false
        this.clock = 0
        this.lastUpdate = 0
        this.watchDuration = 1000 * this.getProp('duration')
        this.ticks = 0

    }

    startLoop() {

        this.clock = Date.now()
        if (!this.looping) {
            this.lastUpdate = Date.now()
            this.looping = true
            this.ticks = 0
            this.loop()
        }
    }

    loop() {

        var t = Date.now()

        if (t -this.clock >= this.watchDuration) {
            this.looping = false
        }

        this.ticks += (t - this.lastUpdate) / (1000/this.fps)

        if (Math.floor(this.ticks) > 0) {
            this.shiftData(Math.floor(this.ticks))
            this.ticks -= Math.floor(this.ticks)
            this.batchDraw()
        }

        this.lastUpdate = t

        if (!this.looping) return

        setTimeout(()=>{
            this.loop()
        }, (1000/this.fps))

    }

    shiftData(n) {

        for (var i=0; i<n; i++) {
            this.value.push(this.value[this.length - 1])
            this.value.splice(0,1)
        }

    }

    getValue() {

        return this.value[this.length - 1]

    }

    setValue(v, options={}) {

        if (Array.isArray(v) && v.length == this.length) {

            this.value = v
            this.startLoop()

            if (options.sync) this.changed(options)


        } else if (typeof(v) == 'number'){

            this.value[this.length - 1] = v
            this.startLoop()

            if (options.sync) this.changed(options)


        }

    }


}
