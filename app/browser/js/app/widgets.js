var strip = require('./widgets/strip'),
    panel = require('./widgets/panel'),
    led = require('./widgets/led'),
    fader = require('./widgets/fader'),
    knob = require('./widgets/knob'),
    xy = require('./widgets/xy'),
    rgb = require('./widgets/rgb'),
    toggle = require('./widgets/toggle'),
    swiitch = require('./widgets/switch'),
    push = require('./widgets/push')

widgetOptions = {
    strip: strip.options,
    panel: panel.options,
    led: led.options,
    fader: fader.options,
    knob: knob.options,
    xy: xy.options,
    rgb: rgb.options,
    toggle: toggle.options,
    switch: swiitch.options,
    push: push.options
}

createWidget = {
    strip: strip.create,
    panel: panel.create,
    led: led.create,
    fader: fader.create,
    knob: knob.create,
    xy: xy.create,
    rgb: rgb.create,
    toggle: toggle.create,
    switch: swiitch.create,
    push: push.create
}
