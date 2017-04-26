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
            css:'',


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
            value:this.ticks/2,
            compact:true,
            noPip:true,
            precision:0
        }, true)

        this.wrapper.append(this.knob.widget)

        this.knob.setValue(this.ticks/2)
        this.previousValue = this.ticks/2

        this.wrapper.on('sync',(e)=>{
            e.stopPropagation()

            var value = this.knob.getValue()

            if (Math.round(value) == Math.round(this.previousValue)) return

            var direction

            if (value < this.previousValue) direction = widgetData.back
            if (value > this.previousValue) direction = widgetData.forth

            if ((0 < value && value < this.ticks / 4) && (this.ticks * .75 < this.previousValue && this.previousValue < this.ticks)) direction = widgetData.forth
            if ((this.ticks * .75 < value && value < this.ticks) && (0 < this.previousValue && this.previousValue < this.ticks / 4)) direction = widgetData.back

            if (direction) this.setValue(direction, {sync:true, send:true})

            this.previousValue = value

        })

        this.wrapper.on('dragend', (e)=>{
            this.knob.setValue(this.ticks/2)
            this.previousValue = this.ticks/2

            if (widgetData.release !== '') {
                this.setValue(widgetData.release, {sync:true, send:true})
            }
        })


    }

    setValue(v,options={}) {

        var match = true

        if (v === this.widgetData.back) {
            this.value = this.widgetData.back
        } else if (v === this.widgetData.forth) {
            this.value = this.widgetData.forth
        } else if (v === this.widgetData.release && this.widgetData.release != '') {
            this.value = this.widgetData.release
        } else {
            match = false
        }

        if (options.sync && match) this.widget.trigger({type:'sync',id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})
        if (options.send && match) this.sendValue()
    }

}
