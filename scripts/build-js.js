var browserify = require('browserify'),
    exorcist = require('exorcist'),
    path = require('path'),
    babelify = require('babelify')



var b = browserify(path.resolve(__dirname + '/../src/browser/js/browser.js'), {debug:true});

b.transform(babelify, {presets: ["es2015"], plugins: ["transform-object-rest-spread"]})
 .transform('uglifyify')
 .bundle()
 .pipe(exorcist(path.resolve(__dirname + '/../app/browser/scripts.js.map')))
 .pipe(process.stdout)
