var browserify = require('browserify'),
    exorcist = require('exorcist'),
    path = require('path')


var b = browserify(path.resolve(__dirname + '/../src/browser/js/browser.js'),{debug:true});

// bypass syntax-error check if node version is < 6
if (parseInt(process.version.split('.')[0].replace('v',''))<6) {
    b.pipeline.get('syntax').splice(0, 1);
}

b.bundle()
 .pipe(exorcist(path.resolve(__dirname + '/../app/browser/scripts.js.map')))
 .pipe(process.stdout)
