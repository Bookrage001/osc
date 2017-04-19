///////////////////////

PACKAGE = require('../../../app/package.json')

///////////////////////

SESSION = []
STATE = []

CLIPBOARD = null
EDITING = false
READ_ONLY = false


TABS = {}


PXSCALE = 1
INITIALZOOM = 1
PXSCALE_RESET = ()=>{
    PXSCALE = getComputedStyle(document.documentElement).getPropertyValue("--pixel-scale")
    document.documentElement.style.setProperty("--pixel-scale", PXSCALE)
    INITIALZOOM = PXSCALE
}
PXSCALE_RESET()

///////////////////////

sourceMap = require('./libs/source-map.min.js')

var request = new XMLHttpRequest()

request.open('GET', 'scripts.js.map', true)

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText),
        smc = new sourceMap.SourceMapConsumer(data)

    window.onerror = function(error,url,row,col) {
        var data = smc.originalPositionFor({line:row,column:col})
        ipc.send('log', `[Renderer process error]\n${error}\nSource: ${data.source} @ line ${data.line}`)
    }
  }
}

request.send()

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
