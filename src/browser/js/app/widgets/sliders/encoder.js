var {clip, mapToScale} = require('../utils'),
    Knob = require('./knob'),
    _widgets_base = require('../common/_widgets_base')

module.exports = class Encoder extends _widgets_base {

    static options() {

        return {
            type:'encoder',
            id:'auto',
            linkId:'',

            _style:'style',

            label:'auto',
            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',
            color:'auto',
            compact:true,
            css:'',

            _behaviour:'behaviour',

            snap:false,

            _osc:'osc',

            ticks:360,
            back:-1,
            forth:1,
            release:'',
            precision:2,
            address:'auto',
            preArgs:[],
            target:[]
        }

    }

    constructor(widgetData) {

        super(...arguments, `
            <div class="encoder">
                <div class="wrapper">
                </div>
            </div>
        `)

        this.wrapper = this.widget.find('.wrapper')
        this.ticks = Math.abs(parseInt(widgetData.ticks))

        this.knob = new Knob({
            label:false,
            angle:360,
            snap:true,
            range:{min:0,max:this.ticks},
            noPip:true,
        }, true)

        this.knob.noDraw = true

        this.display = new Knob({
            label:false,
            angle:360,
            range:{min:0,max:this.ticks},
            compact:widgetData.compact,
            noPip:true,
        }, true)

        this.wrapper.append(this.knob.widget.addClass('drag-knob'))
        this.wrapper.append(this.display.widget.addClass('display-knob'))

        this.knob.setValue(this.ticks/2)
        this.display.setValue(this.ticks/2)

        this.previousValue = this.ticks/2

        this.knob.draginitHandle= function(e, data, traversing) {

            this.percent = clip(this.percent,[0,100])

            this.lastOffsetX = data.offsetX
            this.lastOffsetY = data.offsetY

            if (!(traversing || this.widgetData.snap)) return

            this.percent = this.angleToPercent(this.coordsToAngle(data.offsetX, data.offsetY))

            this.setValue(this.percentToValue(this.percent), {send:true,sync:true,dragged:true, draginit:true})

        }

        this.wrapper.on('sync',(e)=>{
            e.stopPropagation()

            var value = this.knob.getValue()

            var direction

            if (value < this.previousValue ||
                ((this.ticks * .75 < value && value < this.ticks) && (0 < this.previousValue && this.previousValue < this.ticks / 4))
            ) {
                direction = widgetData.back
            }

            if ((value > this.previousValue) ||
                ((0 < value && value < this.ticks / 4) && (this.ticks * .75 < this.previousValue && this.previousValue < this.ticks))
            ) {
                direction = widgetData.forth
            }



            if (direction && (Math.round(value) != Math.round(this.previousValue))) this.setValue(direction, {sync:true, send:true, dragged: e.options.dragged, draginit: e.options.draginit})
            this.previousValue = value

        })

        this.wrapper.on('dragend', (e)=>{
            if (widgetData.release !== '') {
                this.knob.setValue(this.ticks/2)
                this.display.setValue(this.ticks/2)
                this.setValue(widgetData.release, {sync:true, send:true, dragged:false})
            }
        })


    }

    setValue(v,options={}) {

        var match = true

        if (v === this.widgetData.back) {
            this.value = this.widgetData.back
        } else if (v === this.widgetData.forth) {
            this.value = this.widgetData.forth
        } else if (v === this.widgetData.release && this.widgetData.release !== '') {
            this.value = this.widgetData.release
        } else {
            match = false
        }

        if (options.dragged || options.draginit) this.updateDisplay(options.draginit)

        if (options.sync && match) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
        if (options.send && match) this.sendValue()
    }

    updateDisplay(init){

        if (this.widgetData.snap) {
            this.display.setValue(this.knob.value)
            return
        }

        if (init) {

            this.offset = this.knob.value - this.display.value

        } else {

            var v = this.knob.value - this.offset,
                updateOffset

            if (v > this.ticks) {

                v = this.ticks - v
                updateOffset = true


            } else if (v < 0) {

                v = v + this.ticks
                updateOffset = true

            }

            this.display.setValue(v)

            if (updateOffset) {
                this.offset = this.knob.value - this.display.value
            }
        }

        if (this.offset > this.ticks) this.offset = this.ticks - this.offset
        if (this.offset < 0) this.offset = this.offset + this.ticks

    }

}
