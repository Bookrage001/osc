var widgets = {
    // sliders
    fader: require('./widgets/sliders/fader'),
    knob: require('./widgets/sliders/knob'),

    // buttons
    toggle: require('./widgets/toggle'),
    switch: require('./widgets/switch'),
    push: require('./widgets/push'),

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
    strip: require('./widgets/strip'),
    panel: require('./widgets/panel'),
}

module.exports.categories = {
    'Sliders':['fader','knob'],
    'Buttons':['toggle','push','switch'],
    'Pads':['xy','rgb','multixy'],
    'Matrices':['multifader','multitoggle','multipush', 'keyboard'],
    'Plots':['plot','eq','visualizer','led','meter','text'],
    'Containers':['panel','strip']
}

module.exports.widgetOptions = function(){
    var r = {}
    for (i in widgets) {
        r[i] = widgets[i].options
    }
    return r
}()

module.exports.createWidget =  function(){
    var r = {}
    for (i in widgets) {
        r[i] = widgets[i].create
    }
    return r
}()

module.exports.sync = function() {
    $('body').off('sync.global').on('sync.global',function(e){
        var {id, widget, linkId, fromExternal, options} = e
        // Widget that share the same id will update each other
        // without sending any extra osc message
        if (WIDGETS[id] && WIDGETS[id].length>1) {
            var v = widget.getValue()
            for (i in WIDGETS[id]) {
                if (!WIDGETS[id][i].is(widget) && WIDGETS[id][i].setValue) {
                    WIDGETS[id][i].setValue(v,{send:false,sync:false})
                }
            }
        }
        // widgets that share the same linkId will update each other.
        // Updated widgets will send osc messages normally
        if (WIDGETS_LINKED[linkId] && WIDGETS_LINKED[linkId].length>1) {
            var v = widget.getValue()
            for (i in WIDGETS_LINKED[linkId]) {
                if (!WIDGETS_LINKED[linkId][i].is(widget) && WIDGETS_LINKED[linkId][i].setValue) {
                    WIDGETS_LINKED[linkId][i].setValue(v,{send:options.send,sync:false})
                }
            }
        }
    })
}
