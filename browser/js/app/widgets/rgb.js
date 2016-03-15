var utils = require('./utils'),
    clip = utils.clip,
    mapToScale = utils.mapToScale,
    hsbToRgb = utils.hsbToRgb,
    rgbToHsb = utils.rgbToHsb,
    sendOsc = utils.sendOsc

module.exports.options = {
    type:'rgb',
    id:'auto',
    linkId:'',

    separator1:'style',

    label:'auto',
    left:'auto',
    top:'auto',
    width:'auto',
    height:'auto',
    css:'',

    separator2:'behaviour',

    absolute:false,

    separator3:'osc',

    precision:0,
    path:'auto',
    split:false,
    target:[]
}
module.exports.create = function(widgetData,container) {

        var widget = $(`
            <div class="xy-wrapper rgb-wrapper">
                <div class="xy rgb">
                    <div class="bg"></div>
                    <div class="handle"></div>
                </div>
                <div class="hue">
                    <div class="bg"></div>
                    <div class="handle"></div>
                </div>
                <div class="value">
                    <div class="input disabled">R</div><div class="input disabled">G</div><div class="input disabled">B</div>
                    <div class="input r"></div><div class="input g"></div><div class="input b"></div>
                </div>
            </div>`),
            rgbHandle = widget.find('.rgb .handle'),
            hueHandle = widget.find('.hue .handle'),
            pad = widget.find('.xy'),
            huePad = widget.find('.hue'),
            rgbBg = pad.find('.bg')[0],
            value = {r:widget.find('.r').fakeInput({align:'center'}),g:widget.find('.g').fakeInput({align:'center'}),b:widget.find('.b').fakeInput({align:'center'})},
            absolute = widgetData.absolute,
            split = widgetData.split?
                        typeof widgetData.split == 'object'?
                            widgetData.split:{r:widgetData.path+'/r',g:widgetData.path+'/g',b:widgetData.path+'/b'}
                            :false

        if (widgetData.height!='auto') widget.addClass('manual-height')


        pad.width = 0
        pad.height = 0
        rgbHandle.height = 0
        rgbHandle.width = 0
        hueHandle.width = 0

        pad.resize(function(){
            var width = pad.innerWidth(),
                height = pad.innerHeight()
            if (!width || (pad.height==height && pad.width==width)) return
            pad.width = width
            pad.height = height
            rgbHandle[0].setAttribute('style',`transform:translate3d(${pad.width*rgbHandle.width/100}px, -${pad.height*rgbHandle.height/100}px,0)`)

        })


        var rgbOff = {x:0,y:0}
        pad.on('draginit',function(e,data){
            if (absolute || TRAVERSING) {
                var h = ((pad.height-data.offsetY) * 100 / pad.height),
                    w = (data.offsetX * 100 / pad.width)

                rgbHandle[0].setAttribute('style',`transform:translate3d(${pad.width*w/100}px, -${pad.height*h/100}px,0)`)
                rgbHandle.height = h
                rgbHandle.width = w

                var v = widget.getValue()
                widget.sendValue(v)
                widget.showValue(v)
                widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

            }

            rgbOff = {x:rgbHandle.width,y:rgbHandle.height}

        })
        pad.on('drag',function(e,data){
            e.stopPropagation()

            if (TRAVERSING) return

            var h = clip((-data.deltaY)*100/pad.height+rgbOff.y,[0,100]),
                w = clip(data.deltaX*100/pad.width+rgbOff.x,[0,100])

            rgbHandle[0].setAttribute('style',`transform:translate3d(${pad.width*w/100}px, -${pad.height*h/100}px,0)`)
            rgbHandle.height = h
            rgbHandle.width = w

            var v = widget.getValue()
            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

        })


        var hueOff = 0
        huePad.on('draginit',function(e,data){
            if (absolute || data.ctrlKey || data.shiftKey) {
                var d = (data.offsetX * 100 / pad.width)
                hueHandle[0].setAttribute('style',`transform:translate3d(${pad.width*d/100}px,0,0)`)
                hueHandle.width = d


                var h = clip(hueHandle.width*3.6,[0,360]),
                    rgb = hsbToRgb({h:h,s:100,b:100}),
                    v = widget.getValue()

                rgbBg.setAttribute('style','background-color:rgb('+rgb.r+','+rgb.g+','+rgb.b+')')



                widget.sendValue(v)
                widget.showValue(v)
                widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

            }

            hueOff = hueHandle.width

        })


        huePad.on('drag',function(e,data){
            e.stopPropagation()

            if (data.shiftKey) return

            var w = clip(data.deltaX*100/pad.width+hueOff,[0,100])
            hueHandle[0].setAttribute('style',`transform:translate3d(${pad.width*w/100}px,0,0)`)
            hueHandle.width = w

            var h = clip(hueHandle.width*3.6,[0,360]),
                rgb = hsbToRgb({h:h,s:100,b:100}),
                v = widget.getValue()

            rgbBg.setAttribute('style','background-color:rgb('+rgb.r+','+rgb.g+','+rgb.b+')')
            widget.sendValue(v)
            widget.showValue(v)

            widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])

        })





        widget.getValue = function() {
            var s = clip(rgbHandle.width,[0,100]),
                l = clip(rgbHandle.height,[0,100]),
                h = mapToScale(hueHandle.width,[0,100],[0,360],widgetData.precision),
                rgb = hsbToRgb({h:h,s:s,b:l})
            return [rgb.r,rgb.g,rgb.b]
        }
        widget.setValue = function(v,send,sync) {
            if (!v || v.length!=3) return

            for (i in [0,1,2]) {
                v[i] = clip(v[i],[0,255])
            }


            var hsb = rgbToHsb({r:v[0],g:v[1],b:v[2]})

            var w = mapToScale(hsb.s,[0,100],[0,100],widgetData.precision),
                h = mapToScale(hsb.b,[0,100],[0,100],widgetData.precision),
                hueW = mapToScale(hsb.h,[0,360],[0,100],widgetData.precision)

            rgbHandle[0].setAttribute('style',`transform:translate3d(${pad.width*w/100}px, -${pad.height*h/100}px,0)`)
            hueHandle[0].setAttribute('style',`transform:translate3d(${pad.width*hueW/100}px,0,0)`)

            rgbHandle.height = h
            rgbHandle.width = w
            hueHandle.width = hueW


            var rgb = hsbToRgb({h:hsb.h,s:100,b:100})
            rgbBg.setAttribute('style','background-color:rgb('+rgb.r+','+rgb.g+','+rgb.b+')')

            widget.showValue(v)



            if (sync) widget.trigger('sync',[widgetData.id,widget,widgetData.linkId])
            if (send) widget.sendValue(v)
        }
        widget.sendValue = function(v) {
            sendOsc({
                target:split?false:widgetData.target,
                path:widgetData.path,
                args:v,
                precision:widgetData.precision,
            })
            if (split) {
                sendOsc({
                    target:widgetData.target,
                    path:split.r,
                    args:v[0],
                    precision:widgetData.precision,
                    sync:false
                })
                sendOsc({
                    target:widgetData.target,
                    path:split.g,
                    args:v[1],
                    precision:widgetData.precision,
                    sync:false
                })
                sendOsc({
                    target:widgetData.target,
                    path:split.b,
                    args:v[2],
                    precision:widgetData.precision,
                    sync:false
                })
            }
        }



        widget.showValue = function(v) {
            value.r.val(v[0])
            value.g.val(v[1])
            value.b.val(v[2])
        }
        value.r.change(function(){
            var r = clip(value.r.val(),[0,255])
            var v = widget.getValue()
            widget.setValue([r,v[1],v[2]],true,true)
        })
        value.g.change(function(){
            var g = clip(value.g.val(),[0,255])
            var v = widget.getValue()
            widget.setValue([v[0],g,v[2]],true,true)
        })
        value.b.change(function(){
            var b = clip(value.b.val(),[0,255])
            var v = widget.getValue()
            widget.setValue([v[0],v[1],b],true,true)
        })

        widget.setValue([0,0,0])

        return widget
}
