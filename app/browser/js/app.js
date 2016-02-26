// Global defs

WIDGETS = {} //__widgets__
WIDGETS_LINKED = {} //__widgetdId__
WIDGETS_ID_BY_PATH = {} // __widgetsLinks__
SESSION = [] // session

MISC = {
    iterators: {
        widget:{},
        tab:{}
    }
}

// jquery

window.$ = window.jQuery = require('./jquery/jquery.min')


// third-party js libraries
require('./jquery/jquery.resizable-draggable')
require('./jquery/jquery.sortable')
require('./jquery/jquery.drag')
require('./jquery/jquery.resize')
require('./jquery/jquery.fake-input')


require('./app/utils')



var callbacks = require('./app/callbacks')

var bindCallback = function(i) {
    IPC.on(i,function(event,data){
        callbacks[i](event,data)
    })
}

for (i in callbacks) {
    bindCallback(i)
}


IPC.send('ready')
