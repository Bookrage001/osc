
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



// Sass (add stylesheets to var styles)
var Sass = require( __dirname + "/sass/sass.js")
    Sass.setWorkerUrl(__dirname +  "/sass/sass.worker.js");
    var sass = new Sass()
    sass.options({style: Sass.style.compact})

var styles = ["/../css/style.scss"]
  , stylesdata = ''
  , done = 0;

for (i in styles) {

    fs.readFile(__dirname + styles[i], 'utf8', function (err,data) {
        if (err) {return console.log(err);}
        stylesdata +=  "\n" + data;
        done += 1;
        if (done==styles.length) {
            sass.compile(stylesdata,function(d){
                $('body').append('<style>'+d.text+'<\/style>')
                ipc.send('ready');
            })
        }
    });

}
