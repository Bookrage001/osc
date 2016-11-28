// browserify without syntax checking for building browser-js with node 4

var browserify = require('browserify'),
    path = require('path')


var b = browserify(path.resolve(__dirname + '/../src/browser/js/browser.js'));

// bypass syntax-error check
b.pipeline.get('syntax').splice(0, 1);

b.bundle().pipe(process.stdout);
