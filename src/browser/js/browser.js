window.ARGV={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){ARGV[k]=v})

///////////////////////

window.PACKAGE = require('../../../app/package.json')

///////////////////////

window.SESSION = []
window.STATE = []

window.CLIPBOARD = null
window.EDITING = false
window.READ_ONLY = false


window.TABS = {}


window.PXSCALE = 1
window.INITIALZOOM = ARGV.zoom ? ARGV.zoom : 1
window.PXSCALE_RESET = ()=>{
    PXSCALE = INITIALZOOM
    document.documentElement.style.setProperty('font-size', PXSCALE + 'px')
}
PXSCALE_RESET()

window.CANVAS_SCALING = parseFloat(ARGV.forceHdpi) || ARGV.hdpi ? window.devicePixelRatio : 1

window.DOUBLE_TAP_TIME = ARGV.doubletap ? ARGV.doubletap : 375

///////////////////////

window.sourceMap = require('./libs/source-map.min.js')

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

window.$ = require('jquery/dist/jquery.slim.min.js')
require('./libs/jquery.ui')
require('./libs/jquery.drag')
require('./libs/jquery.resize')

///////////////////////

var callbacks = require('./app/callbacks'),
    ipc = require('./app/ipc'),
    osc = require('./app/osc')

osc.init()


///////////////////////
$(document).ready(function(){
    window.LOADING = require('./app/utils').loading('Connecting server...')
    ipc.send('ready')
})
