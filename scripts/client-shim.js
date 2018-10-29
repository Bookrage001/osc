// Dirty browser window shim

document = {
    createElement: x=>({
        nodeName: '',
        childNodes: [],
        setAttribute: ()=>{},
        appendChild: ()=>{},
        lastChild: {},
        toString: ()=>' ',
        removeChild: ()=>{}
    }),
    createTextNode: x=>({
        nodeValue: '',
        nodeName: '',
        childNodes: [],
        setAttribute: ()=>{},
        appendChild: ()=>{},
        lastChild: {},
        toString: ()=>' '
    }),
    createElementNS: x=>[],
    addEventListener: ()=>{},
    createRange: ()=>{
        return {
            createContextualFragment:()=>{return {
                firstChild: {
                    querySelectorAll: x=>[]
                }
            }},
            selectNode: ()=>{}
        }
    },
    body: {
        appendChild: ()=>{}
    }
}

window = {
    addEventListener: ()=>{},
    location: {},
    document: document,
    navigator: {
        platform:''
    },
    NodeList: Array,
    WebSocket: Object
}

Object.assign(global, window)

// Required globals

DOM = require('../src/client/app/dom')
DOM.get = x=>[{addEventListener:()=>{}}]
DOM.init()
CANVAS_FRAMERATE = 1
LANG = 'en'
