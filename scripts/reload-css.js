var WS = require('../app/node_modules/ws')

var ipc = new WS('ws://127.0.0.1:8080/dev')

ipc.on('open', ()=>{
    ipc.send('["reloadCss"]')
    process.exit()
})
