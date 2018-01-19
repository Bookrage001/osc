var browserify = require('browserify'),
    uglifyify = require('uglifyify'),
    through = require('through'),
    minimatch = require('minimatch').Minimatch,
    licensify = require('licensify'),
    exorcist = require('exorcist'),
    path = require('path'),
    babelify = require('babelify'),
    prod = process.argv.indexOf('--prod') != -1,
    fast = process.argv.indexOf('--fast') != -1,
    b

var ignoreList = ['**/mathjs/dist/math.min.js', '**/jquery.slim.min.js', '**/jquery.ui.js', '**/socket.io.slim.js'],
    ignoreWrapper = function(transform){
        return function(file, opts){
             if (
                ignoreList.some(function(pattern) {
                    var match = minimatch(pattern)
                    return match.match(file)
                })
            ) {
                return through()
            } else {
                return transform(file, opts)
            }
        }
    }

if (prod) console.warn('\x1b[36m%s\x1b[0m', 'Building minified js bundle for production... This may take a while... ');

b = browserify(path.resolve(__dirname + '/../src/browser/js/browser.js'), {debug:!fast, insertGlobals:fast, noParse: ignoreList})

b = b.transform(ignoreWrapper(babelify), {presets: ["env"]})

if (prod) b = b.transform(ignoreWrapper(uglifyify), {global: true})

b.plugin(licensify)


b = b.bundle()

if (!fast) b = b.pipe(exorcist(path.resolve(__dirname + '/../app/browser/scripts.js.map')))

b.pipe(process.stdout)
