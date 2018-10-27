var browserify = require('browserify'),
    uglifyify = require('uglifyify'),
    through = require('through'),
    minimatch = require('minimatch').Minimatch,
    licensify = require('licensify'),
    exorcist = require('exorcist'),
    path = require('path'),
    fs = require('fs'),
    babelify = require('babelify'),
    prod = process.argv.indexOf('--prod') != -1,
    fast = process.argv.indexOf('--fast') != -1,
    watch = process.argv.indexOf('--watch') != -1,
    autoRefresh = process.argv.indexOf('--auto-refresh') != -1,
    b

var inputPath = path.resolve(__dirname + '/../src/browser/js/index.js'),
    outputPath = path.resolve(__dirname + '/../app/browser/scripts.js')


var ignoreList = ['**/*.min.js', '**/jquery.ui.js'],
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

if (prod) console.warn('\x1b[36m%s\x1b[0m', 'Building minified js bundle for production... This may take a while... ')


var plugins = [licensify]

if (watch) plugins.push(require('watchify'))

b = browserify(inputPath, {
    debug:!fast,
    insertGlobals:fast,
    noParse: ignoreList,
    cache: {},// needed by watchify
    packageCache: {},// needed by watchify
    plugin: plugins
 })

b = b.transform(ignoreWrapper(babelify), {presets: ["env"]})

if (prod) b = b.transform(ignoreWrapper(uglifyify), {global: true})


if (watch) {
    b.on('update', bundle)
    b.on('log', function(msg) {console.warn('\x1b[36m%s\x1b[0m', msg)})
}

bundle()

if (autoRefresh) {
    var ansiHTML = require('ansi-html')
    var WS = require('../app/node_modules/ws')
    function send(msg, data){
        var ipc = new WS('ws://127.0.0.1:8080/dev')
        ipc.on('error', ()=>{})
        ipc.on('open', ()=>{
            ipc.send(JSON.stringify([msg, data]))
            ipc.close()
        })
    }
}


function bundle() {

    var output =  b.bundle()

    output.on('end', (err)=> {
        console.log('Build successful', autoRefresh ? 'reloading...' : '')
        if (autoRefresh) send('reload')
    })

    output.on('error', (err)=> {

        console.error(err.stack)
        if (autoRefresh) {
            send('errorPopup',
                '<div class="error-stack">' +
                    ansiHTML(
                        err.stack
                        .replace(/^    at .*/gm, '') // remove useless stack
                        .replace(new RegExp(path.resolve(__dirname + '/..'), 'g'),'.') // shorten file path
                        .trim()
                        .replace('\n','\n\n') // add 1 new line after 1st line
                    ) +
                '</div>'
            )
        }

    })


    if (!fast) output = output.pipe(exorcist(outputPath + '.map'))

    output.pipe(fs.createWriteStream(outputPath))

}
