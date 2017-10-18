window.ARGV = {}
location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (s,k,v)=>{
    ARGV[k]=v
})

window.PACKAGE = require('../../../../app/package.json')

window.CLIPBOARD = null

window.EDITING = false

window.READ_ONLY = false

window.PXSCALE = 1

window.INITIALZOOM = ARGV.zoom ? ARGV.zoom : 1

window.PXSCALE_RESET = ()=>{
    PXSCALE = INITIALZOOM
    document.documentElement.style.setProperty('font-size', PXSCALE + 'px')
}

PXSCALE_RESET()

window.CANVAS_SCALING = parseFloat(ARGV.forceHdpi) || ( ARGV.hdpi ? window.devicePixelRatio : 1 )

window.DOUBLE_TAP_TIME = ARGV.doubletap ? ARGV.doubletap : 375


window.JSON.parseFlex = require('json5').parse

///////////////////////

window.$ = require('jquery/dist/jquery.slim.min.js')

require('../libs/jquery.ui')
require('../libs/jquery.drag')
require('../libs/jquery.resize')

require('cardinal-spline-js/curve.js')
