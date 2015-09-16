
// mainProcess & renderProcess communication engine
ipc = require('ipc');

// filesystem
fs = require('fs');

// jquery
window.$ = window.jQuery = require( __dirname + "/jquery/jquery.min.js")



// third-party js libraries
require( __dirname + "/jquery/jquery.event.drag-2.2.js")
require( __dirname + "/jquery/jquery.ba-resize.js")

// main js
require( __dirname + "/app/app.js")

ipc.send('ready');
