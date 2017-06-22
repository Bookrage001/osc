module.exports.widgets = {
    // tabs
    tab: require('./widgets/containers/tab'),
    root: require('./widgets/containers/root'),

    // sliders
    fader: require('./widgets/sliders/fader'),
    knob: require('./widgets/sliders/knob'),
    encoder: require('./widgets/sliders/encoder'),

    // buttons
    toggle: require('./widgets/buttons/toggle'),
    push: require('./widgets/buttons/push'),
    switch: require('./widgets/buttons/switch'),
    dropdown: require('./widgets/buttons/dropdown'),

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
    rgbled: require('./widgets/plots/rgbled'),
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
    formula: require('./widgets/maths/formula')
}

module.exports.categories = {
    'Sliders':['fader','knob', 'encoder'],
    'Buttons':['toggle','push','switch', 'dropdown'],
    'Pads':['xy','rgb','multixy'],
    'Matrices':['multifader','multitoggle','multipush', 'keyboard'],
    'Plots':['plot','eq','visualizer','led', 'rgbled','meter','text'],
    'Containers':['panel','strip','modal'],
    'Switchers':['switcher','crossfader'],
    'Maths':['formula']
}
