var state = require('../managers/state'),
    session = require('../managers/session'),
    editor = require('../editor/'),
    {icon} = require('./utils'),
    fullscreen = require('./fullscreen'),
    {enableTraversingGestures, disableTraversingGestures} = require('../events/drag')

var sidepanelData = [
    {
        actions: [
            {
                title:'Fullscreen' + (ELECTRON_FULLSCREEN ? ' (F11)' : ''),
                action:()=>{
                    if (fullscreen.enabled) fullscreen.toggle()
                },
                class:'fullscreenToggle' + (!fullscreen.enabled ||  ELECTRON_FULLSCREEN ? ' disabled' : '')
            }

        ]
    },
    {
        title: icon('sliders-h') + '&nbsp; State',
        actions: [
            {
                title:'Store',
                action:()=>{
                    state.quickSave()
                    DOM.get('.quickload')[0].classList.remove('disabled')
                }
            },
            {
                title:'Recall',
                action:state.quickLoad.bind(state),
                class:'disabled quickload'
            },
            {
                title:'Send All',
                action:state.send.bind(state)
            },
            {
                title:'Import',
                action:state.load.bind(state)
            },
            {
                title:'Export',
                action:state.save.bind(state)
            }
        ]
    },
    {
        title: icon('magic') + '&nbsp; Traversing gestures',
        actions: [
            {
                title:'On',
                action:()=>{
                    DOM.each(document, '.traversingEnable, .traversingDisable', (el)=>{
                        el.classList.toggle('on')
                    })
                    enableTraversingGestures(document.getElementById('container'))
                },
                class:'traversingEnable'
            },
            {
                title:'Off',
                action:()=>{
                    DOM.each(document, '.traversingEnable, .traversingDisable', (el)=>{
                        el.classList.toggle('on')
                    })
                    disableTraversingGestures(document.getElementById('container'))
                },
                class:'traversingDisable on'
            }
        ]
    },
    {
        title: icon('edit') + '&nbsp; Editor',
        class:'editor-menu',
        actions: [
            {
                title:'On',
                action:editor.enable.bind(editor),
                class:'enable-editor'
            },
            {
                title:'Off',
                action:editor.disable.bind(editor),
                class:'on disable-editor'
            },
            {
                title:'Root',
                class:'editor-root disabled'
            },
            {
                title:'Load',
                action:session.browse.bind(session)
            },
            {
                title:'Save',
                action:session.save.bind(session)
            }
        ]
    },
]

var options = DOM.create('<ul id="options"></ul>')

for (let i in sidepanelData) {

    let data = sidepanelData[i],
        item = DOM.create(`
            <li>
                <div class="${data.class || ''}">
                    <div class="actions">
                        ${data.title ? `<div class="title">${data.title}</div>` : ''}
                    </div>
                </div>
            </li>
        `),
        wrapper = DOM.get(item, '.actions')[0]

    for (let j in data.actions) {

        let actionData = data.actions[j],
            element = DOM.create(`<a class="btn ${actionData.class || ''}">${actionData.title}</a>`)

        if (actionData.action) element.addEventListener('click', actionData.action)

        wrapper.appendChild(element)
    }

    options.appendChild(item)

}


var sidepanel = document.getElementById('sidepanel')

sidepanel.appendChild(DOM.create(`
    <div class="navigation"><ul><li><a>${PACKAGE.productName.toUpperCase()}</a></li></ul></div>
`))

sidepanel.appendChild(options)

sidepanel.appendChild(DOM.create('<div id="editor"></div>'))


// Fullscreen

var fsToggle = DOM.get(sidepanel, '.fullscreenToggle')[0]

if (fullscreen.enabled) {
    fullscreen.on('change', ()=>{
        fsToggle.classList.toggle('on', fullscreen.isFullScreen)
    })
}

// open / close / toggle

var sidepaneLock = false

function sidepanelOpen() {

    sidepaneLock = true

    DOM.get('#open-toggle, #sidepanel').forEach((el)=>{
        el.classList.add('sidepanel-open')
    })

    setTimeout(function(){
        DOM.get('#container')[0].classList.add('sidepanel-open')
        setTimeout(function(){
            DOM.dispatchEvent(window, 'resize')
            sidepaneLock = false
        }, 25)
    }, 250)

}

function sidepanelClose() {

    if (sidepaneLock) return

    DOM.get('#open-toggle, #sidepanel, #container').forEach((el)=>{
        el.classList.remove('sidepanel-open')
    })

    setTimeout(function(){
        DOM.dispatchEvent(window, 'resize')
    }, 25)

}

function sidepanelToggle() {

    if (sidepanel.classList.contains('sidepanel-open')) {
        sidepanelClose()
    } else {
        sidepanelOpen()
    }

}


DOM.get('#container')[0].addEventListener('fast-click', function(e){

    if (e.target.id == 'open-toggle') {
        e.stopPropagation()
        sidepanelToggle()
    }

})

document.addEventListener('keydown', function(e){
    // F10
    if (e.keyCode==121) sidepanelToggle()
})


module.exports = {
    open: sidepanelOpen,
    close: sidepanelClose,
    toggle: sidepanelToggle
}
