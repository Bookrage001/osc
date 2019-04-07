// Dirty browser window shim

document = {
    createElement: x=>({
        style: {},
        contentWindow: {},
        nodeName: '',
        childNodes: [],
        setAttribute: ()=>{},
        appendChild: ()=>{},
        lastChild: {},
        toString: ()=>' ',
        removeChild: ()=>{},
        contentWindow: {
            document: {
                open: ()=>{},
                close: ()=>{},
                write: ()=>{},
            }
        }
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
        appendChild: ()=>{},
        addEventListener: ()=>{}
    },
    location: {},
    documentElement: {
        appendChild: ()=>{},
        removeChild: ()=>{}
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
