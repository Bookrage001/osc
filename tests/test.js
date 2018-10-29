// Very simple test: load a session with 1 widget of each type
var fs = require('fs')

// create tmp session file

var session = [{tabs:[{widgets:[]}]}],
    sessionPath = 'test-session.json'

require('../scripts/client-shim')

var {widgets} = require('../src/client/app/widgets')
for (let type in widgets) {
    session[0].tabs[0].widgets.push({type: type})
}

fs.writeFileSync(sessionPath, JSON.stringify(session))


// spawn o-s-c in headless mode and load tmp session

var {spawn} = require('child_process')

var proc = spawn('npx', `xvfb-run npm start -- -l ${sessionPath}`.split(' '), {detached: true})

proc.stdout.on('data', std)
proc.stderr.on('data', std)


function std(data){

    if (data.includes('process error')) {
        console.error(data.toString())
        end()
    }

}

// timeout after 5s -> no error
setTimeout(end, 5000)

function end(fail){
    process.kill(-proc.pid)
    fs.unlinkSync(sessionPath)
    process.exit(fail ? 1 : 0)
}
