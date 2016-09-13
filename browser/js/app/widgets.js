var widgets = {
    // sliders
    fader: require('./widgets/fader'),
    knob: require('./widgets/knob'),

    // buttons
    toggle: require('./widgets/toggle'),
    switch: require('./widgets/switch'),
    push: require('./widgets/push'),

    // pads
    xy: require('./widgets/xy'),
    rgb: require('./widgets/rgb'),

    // matrices
    multitoggle: require('./widgets/multitoggle'),
    multipush: require('./widgets/multipush'),
    multifader: require('./widgets/multifader'),

    // plots
    led: require('./widgets/led'),
    plot: require('./widgets/plot'),
    eq: require('./widgets/eq'),
    visualizer: require('./widgets/visualizer'),
    meter: require('./widgets/meter'),
    text: require('./widgets/text'),

    // containers
    strip: require('./widgets/strip'),
    panel: require('./widgets/panel'),
}

module.exports.categories = {
    'Sliders':['fader','knob'],
    'Buttons':['toggle','push','switch'],
    'Pads':['xy','rgb'],
    'Matrices':['multifader','multitoggle','multipush'],
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
    $('body').off('sync.global').on('sync.global',function(e,id,widget,linkId){
        // Widget that share the same id will update each other
        // without sending any extra osc message
        if (WIDGETS[id] && WIDGETS[id].length>1) {
            var v = widget.getValue()
            for (i in WIDGETS[id]) {
                if (!WIDGETS[id][i].is(widget) && WIDGETS[id][i].setValue) {
                    WIDGETS[id][i].setValue(v,false,false)
                }
            }
        }
        // widgets that share the same linkId will update each other.
        // Updated widgets will send osc messages normally
        if (WIDGETS_LINKED[linkId] && WIDGETS_LINKED[linkId].length>1) {
            var v = widget.getValue()
            for (i in WIDGETS_LINKED[linkId]) {
                if (!WIDGETS_LINKED[linkId][i].is(widget) && WIDGETS_LINKED[linkId][i].setValue) {
                    WIDGETS_LINKED[linkId][i].setValue(v,true,false)
                }
            }
        }
    })
}
