var widgets = {
    // sliders
    fader: require('./widgets/sliders/fader'),
    knob: require('./widgets/sliders/knob'),

    // buttons
    toggle: require('./widgets/buttons/toggle'),
    push: require('./widgets/buttons/push'),
    switch: require('./widgets/buttons/switch'),

    // pads
    xy: require('./widgets/pads/xy'),
    rgb: require('./widgets/pads/rgb'),
    multixy: require('./widgets/pads/multixy'),

    // matrices
    multitoggle: require('./widgets/matrices/multitoggle'),
    multipush: require('./widgets/matrices/multipush'),
    multifader: require('./widgets/matrices/multifader'),
    keyboard: require('./widgets/matrices/keyboard'),

    // plots
    led: require('./widgets/plots/led'),
    plot: require('./widgets/plots/plot'),
    eq: require('./widgets/plots/eq'),
    visualizer: require('./widgets/plots/visualizer'),
    meter: require('./widgets/plots/meter'),
    text: require('./widgets/plots/text'),

    // containers
    strip: require('./widgets/containers/strip'),
    panel: require('./widgets/containers/panel'),
    modal: require('./widgets/containers/modal'),

    // state switchers
    switcher: require('./widgets/switchers/switcher'),
    crossfader: require('./widgets/switchers/crossfader'),

    // maths
    math: require('./widgets/maths/math')
}

module.exports.categories = {
    'Sliders':['fader','knob'],
    'Buttons':['toggle','push','switch'],
    'Pads':['xy','rgb','multixy'],
    'Matrices':['multifader','multitoggle','multipush', 'keyboard'],
    'Plots':['plot','eq','visualizer','led','meter','text'],
    'Containers':['panel','strip','modal'],
    'Switchers':['switcher','crossfader'],
    'Maths':['math']
}

module.exports.widgetOptions = function(){
    var r = {}
    for (i in widgets) {
        r[i] = widgets[i].options()
    }
    return r
}()

module.exports.createWidget =  function(){
    var r = {}
    for (i in widgets) {
        let x = i,
            f = function(){
            return new widgets[x](...arguments)
        }
        r[i] = f
    }
    return r
}()
