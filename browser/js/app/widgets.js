var strip = require('./widgets/strip'),
    panel = require('./widgets/panel'),
    led = require('./widgets/led'),
    plot = require('./widgets/plot'),
    visualizer = require('./widgets/visualizer'),
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
    plot: plot.options,
    visualizer: visualizer.options,
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
    plot: plot.create,
    visualizer: visualizer.create,
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
    'Plots':['plot','visualizer','led'],
    'Containers':['panel','strip']
}

module.exports.sync = function() {
    $('body').off('sync.global').on('sync.global',function(e,id,widget){
        // Widget that share the same id will update each other
        // without sending any extra osc message
        if (WIDGETS[id] && WIDGETS[id].length>1) {
            var v = widget.getValue()
            for (i in WIDGETS[id]) {
                if (WIDGETS[id][i]!=widget) {
                    WIDGETS[id][i].setValue(v,false,false)
                }
            }
        }
        // widgets that share the same linkId will update each other.
        // Updated widgets will send osc messages normally
        if (WIDGETS_LINKED[id] && WIDGETS_LINKED[id].length>1) {
            var v = widget.getValue()
            for (i in WIDGETS_LINKED[id]) {
                if (WIDGETS_LINKED[id][i]!=widget) {
                    WIDGETS_LINKED[id][i].setValue(v,true,false)
                }
            }
        }
    })
}
