///////////////////////

WIDGETS = {}
WIDGETS_LINKED = {}
WIDGETS_ID_BY_PATH = {}
SESSION = []
STATE = []

CLIPBOARD = null
EDITING = false

TRAVERSING = false

TABS = {}


MISC = {
    iterators: {
        widget:{},
        tab:{}
    }
}


PXSCALE =  getComputedStyle(document.documentElement).getPropertyValue("--pixel-scale")



///////////////////////

$ = jQuery = require('./jquery/jquery.min')
require('./jquery/jquery.ui')
require('./jquery/jquery.drag')
require('./jquery/jquery.resize')
require('./jquery/jquery.fake-input')

///////////////////////

var callbacks = require('./app/callbacks')

var bindCallback = function(i) {
    IPC.on(i,function(event,data){
        callbacks[i](event,data)
    })
}

for (i in callbacks) {
    bindCallback(i)
}

///////////////////////


IPC.send('ready')
