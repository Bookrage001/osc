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
    WebSocket = require('ws'),
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
var pendingSocket
const wsAddress = 'ws://127.0.0.1:8080/dev'
if(autoRefresh){
    var WS = require('../app/node_modules/ws')
    pendingSocket = new WS(wsAddress)
    pendingSocket.on('error', (err)=>{console.error(err)})
    pendingSocket.on('open', ()=>{})
    pendingSocket.on('close', ()=>{pendingSocket = null;})
}

var hasError = false
function bundle() {

    var output =  b.bundle()
    output.on('end', (err)=> {
        console.log('build successful',pendingSocket?'sending refresh':'')
        if(autoRefresh && pendingSocket && hasError){
            pendingSocket.send('["refresh"]')
            hasError = false
            //pendingSocket.close();
        }
    })
    output.on('error', (err)=> {
        console.error(err.stack)
        var Convert = require('ansi-to-html');
        var convert = new Convert(
            {fg: '#0F0',
            bg: '#000'});
        const errFilePath = err.stack.split(':')?'file://'+err.stack.split(':')[1].trim()+':'+err.loc.line:''
        let formattedStack = err.stack.replace(new RegExp(path.resolve(__dirname + '/..'), 'g'),'.');
        // let stackWithoutAnsi = formattedStack.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,'')// escape ANSI codes
        
        
        fs.createWriteStream(outputPath).write(`
        window.onload = ()=>{
            document.write(\`<body> <div>${convert.toHtml(formattedStack)}</div><button onclick="refresh()"></button></body>\`)
            document.body.style['color']='#0F0'
            document.body.style['white-space']='pre-wrap'
            console.error(\`${errFilePath}\`)
        }
        `)

        if(autoRefresh ){
            if(pendingSocket){
                pendingSocket.send('["refresh"]')
            }
        }
  })
    
    
    if (!fast) output.pipe(exorcist(outputPath + '.map'))

    output.pipe(fs.createWriteStream(outputPath))

}
