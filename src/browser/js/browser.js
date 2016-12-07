///////////////////////

SESSION = []
STATE = []

CLIPBOARD = null
EDITING = false

TRAVERSING = false

OSCSYNCONLY = false

TABS = {}


MISC = {
    iterators: {
        widget:{},
        tab:{}
    }
}


PXSCALE =  getComputedStyle(document.documentElement).getPropertyValue("--pixel-scale")
INITIALZOOM = PXSCALE


///////////////////////

$ = jQuery = require('./jquery/jquery.min')
require('./jquery/jquery.ui')
require('./jquery/jquery.drag')
require('./jquery/jquery.resize')
require('./jquery/jquery.fake-input')

///////////////////////

var callbacks = require('./app/callbacks'),
    ipc = require('./app/ipc')



///////////////////////
$(document).ready(function(){
    LOADING = require('./app/utils').loading('Connecting server...')
    ipc.send('ready')
})
