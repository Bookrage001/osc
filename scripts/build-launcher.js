var browserify = require('browserify'),
    licensify = require('licensify'),
    path = require('path'),
    ignoreList = ['**/mathjs/dist/math.min.js']


browserify(path.resolve(__dirname + '/../src/launcher/index.js'), {
    debug: true,
    ignoreMissing: false    ,
    detectGlobals: false,
    bare: true,
    noParse: ignoreList
})
.plugin(licensify)
.bundle()
.pipe(process.stdout)
