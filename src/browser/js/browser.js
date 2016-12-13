///////////////////////

SESSION = []
STATE = []

CLIPBOARD = null
EDITING = false


TABS = {}


PXSCALE =  getComputedStyle(document.documentElement).getPropertyValue("--pixel-scale")
INITIALZOOM = PXSCALE


///////////////////////

$ = jQuery = require('./libs/jquery.min')
require('./libs/jquery.ui')
require('./libs/jquery.drag')
require('./libs/jquery.resize')
require('./libs/jquery.fake-input')

///////////////////////

var callbacks = require('./app/callbacks'),
    ipc = require('./app/ipc'),
    osc = require('./app/osc')

osc.init()


///////////////////////
$(document).ready(function(){
    LOADING = require('./app/utils').loading('Connecting server...')
    ipc.send('ready')
})
