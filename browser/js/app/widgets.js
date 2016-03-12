var strip = require('./widgets/strip'),
    panel = require('./widgets/panel'),
    led = require('./widgets/led'),
    fader = require('./widgets/fader'),
    knob = require('./widgets/knob'),
    xy = require('./widgets/xy'),
    rgb = require('./widgets/rgb'),
    toggle = require('./widgets/toggle'),
    swiitch = require('./widgets/switch'),
    push = require('./widgets/push'),
    multitoggle = require('./widgets/multitoggle'),
    multipush = require('./widgets/multipush'),
    multifader = require('./widgets/multifader')

module.exports.widgetOptions = {
    strip: strip.options,
    panel: panel.options,
    led: led.options,
    fader: fader.options,
    knob: knob.options,
    xy: xy.options,
    rgb: rgb.options,
    toggle: toggle.options,
    switch: swiitch.options,
    push: push.options,
    multitoggle: multitoggle.options,
    multipush: multipush.options,
    multifader: multifader.options
}

module.exports.createWidget = {
    strip: strip.create,
    panel: panel.create,
    led: led.create,
    fader: fader.create,
    knob: knob.create,
    xy: xy.create,
    rgb: rgb.create,
    toggle: toggle.create,
    switch: swiitch.create,
    push: push.create,
    multitoggle: multitoggle.create,
    multipush: multipush.create,
    multifader: multifader.create
}

module.exports.categories = {
    'Sliders':['fader','knob'],
    'Buttons':['toggle','push','switch'],
    'Pads':['xy','rgb'],
    'Matrix':['multifader','multitoggle','multipush'],
    'Plots':['led'],
    'Containers':['panel','strip']
}

module.exports.sync = function() {
    // Widget that share the same id will update each other
    // without sending any extra osc message
    $.each(WIDGETS,function(i,widget) {
        if (widget.length>1) {
            var closureSync = function(x) {
                return function() {
                    var v = widget[x].getValue()
                    for (k=0;k<widget.length;k++) {
                        if (x!=k) {
                            if (document.body.contains(widget[k][0].parentNode))
                                widget[k].setValue(v,false,false)
                        }
                    }
                }
            }
            for (j in widget) {
                widget[j].off('sync.id').on('sync.id',closureSync(j))
            }
        }
    })
    // widgets that share the same linkId will update each other.
    // Updated widgets will send osc messages normally
    $.each(WIDGETS_LINKED,function(i,widget) {
        if (widget.length>1) {
            var closureSync = function(x) {
                return function() {
                    var v = widget[x].getValue()
                    for (k=0;k<widget.length;k++) {
                        if (x!=k) {
                            if (document.body.contains(widget[k][0].parentNode))
                                widget[k].setValue(v,true,false)
                        }
                    }
                }
            }
            for (j in widget) {
                widget[j].off('sync.link').on('sync.link',closureSync(j))
            }
        }
    })
}
