var _pads_base = require('./_pads_base'),
    {Xy} = require('./xy'),
    {clip} = require('../utils')

module.exports.options = {
    type:'xy',
    id:'auto',
    linkId:'',

    separator1:'multi xy',

    points: 2,
    pointSize: 15,

    separator2:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    color:'auto',
    css:'',

    separator3:'osc',

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

var MultiXy = module.exports.MultiXy = function(widgetData) {

    _pads_base.apply(this,arguments)

    this.pointSize = parseInt(this.widgetData.pointSize)
    this.widget[0].style.setProperty("--point-size",this.pointSize + 'rem')

    this.split = this.widgetData.split?
                    typeof this.widgetData.split == 'object'?
                        this.widgetData.split
                        : (()=>{
                            var s={};
                            for (var i=0; i<this.widgetData.points * 2;i=i+2) {
                                s[i]=this.widgetData.address + '/' + i/2 + '/x'
                                s[i+1]=this.widgetData.address + '/' + i/2 + '/y'
                            };
                            return s
                        })()
                    : false

    this.handles = []
    this.pads = []
    for (var i=0;i<this.widgetData.points;i++) {
        this.pads[i] = new Xy({
            snap:widgetData.snap,
            rangeX:widgetData.rangeX,
            rangeY:widgetData.rangeY,
            precision:widgetData.precision,
            logScale:widgetData.logScaleY
        })
        this.pads[i].sendValue = ()=>{}
        this.pads[i].draw = ()=>{}
        this.wrapper.append(this.pads[i].widget)

        this.handles[i] = $(`<div class="handle">${i}</div>`)
        this.wrapper.append(this.handles[i])
    }

    this.value = []


    this.handles.forEach((handle, i)=>{
        handle.on('draginit drag',(e, data, traversing)=>{
            this.pads[i].wrapper.trigger(e.type, [data, traversing])
            var v = this.pads[i].widget.getValue()
            if (v < [this.value[i*2], this.value[i*2+1]] || v > [this.value[i*2], this.value[i*2+1]]) {
                var n = this.widget.getValue()
                n[i] = v
                this.setValue(n, {sync:true,send:true, dragged:true})
            }
        })
    })

    this.wrapper.on('sync',(e)=>{
        e.stopPropagation()
    })

    this.widget.getValue = () => {
        var v = []
        for (var i=0;i<this.pads.length * 2;i=i+2) {
            [v[i],v[i+1]] = this.pads[i/2].widget.getValue()
        }
        return v
    }
    this.widget.setValue = (v, options) => {
        this.setValue(v, options)
    }

    var v = []
    for (var i=0;i<this.widgetData.points * 2;i=i+2) {
        [v[i],v[i+1]]  = this.pads[i/2].widget.getValue()
    }
    this.setValue(v)

}


MultiXy.prototype = Object.create(_pads_base.prototype)

MultiXy.prototype.constructor = MultiXy

MultiXy.prototype.resizeHandle = function(){
    _pads_base.prototype.resizeHandle.call(this)
    this.updateHandlesPosition()
}

MultiXy.prototype.updateHandlesPosition = function(){
    for (var i=0;i<this.widgetData.points;i++) {
        this.handles[i][0].setAttribute('style',`
            transform:translate3d(${clip(this.pads[i].faders.x.percent,[0,100]) / 100 * (this.width - (this.pointSize * 2 + 2) * PXSCALE) + (this.pointSize + 1) * PXSCALE}px,
                                  ${- clip(this.pads[i].faders.y.percent,[0,100]) / 100 * (this.height - (this.pointSize * 2 + 2) * PXSCALE) - (this.pointSize + 1) * PXSCALE}px,
                                  0);
        `)
    }
}

MultiXy.prototype.draw = function(){

    this.ctx.clearRect(0,0,this.width,this.height)

    this.ctx.fillStyle = this.colors.text
    this.ctx.lineWidth = PXSCALE
    this.ctx.strokeStyle = this.colors.custom
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    for (var i=0;i<this.widgetData.points;i++) {
        var x = clip(this.pads[i].faders.x.percent,[0,100]) / 100 * (this.width - (this.pointSize * 2 + 2) * PXSCALE) + (this.pointSize + 1) * PXSCALE,
            y = (100 - clip(this.pads[i].faders.y.percent,[0,100])) / 100 * (this.height - (this.pointSize * 2 + 2) * PXSCALE) + (this.pointSize + 1) * PXSCALE

            this.ctx.save()
            this.ctx.globalAlpha = 0.3
            this.ctx.fillStyle = this.colors.custom

            this.ctx.beginPath()
            this.ctx.arc(x, y, this.pointSize * PXSCALE, Math.PI * 2, false)
            this.ctx.fill()

            this.ctx.restore()

            this.ctx.font =  PXSCALE * 11 + 'px Droid Sans'
            this.ctx.fillText(i,x,y)

    }
}


MultiXy.prototype.setValue = function(v, options={}){
    if (!v || v.length!=this.widgetData.points * 2) return

    for (var i=0;i<this.widgetData.points;i++) {
        if (!options.dragged) {
            this.pads[i].setValue([v[i*2],v[i*2+1]])
        }
    }

    this.updateHandlesPosition()
    this.draw()

    for (var i=0;i<this.widgetData.points * 2;i=i+2) {
        [this.value[i],this.value[i+1]]  = this.pads[i/2].widget.getValue()
    }


    if (options.send) this.sendValue()
    if (options.sync) this.widget.trigger({type:'sync', id:this.widgetData.id,widget:this.widget, linkId:this.widgetData.linkId, options:options})

}




module.exports.create = function(widgetData) {
    var xy = new MultiXy(widgetData)
    return xy.widget
}
