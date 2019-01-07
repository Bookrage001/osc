var state = require('../managers/state'),
    session = require('../managers/session'),
    editor = require('../editor/'),
    {icon} = require('./utils'),
    fullscreen = require('./fullscreen'),
    notifications = require('./notifications'),
    {enableTraversingGestures, disableTraversingGestures} = require('../events/drag'),
    locales = require('../locales'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw')

var sidepanelData = [
    {
        actions: [
            {
                title: locales('sidepanel_fs') + (ELECTRON_FULLSCREEN ? ' (F11)' : ''),
                action:()=>{
                    if (fullscreen.enabled) fullscreen.toggle()
                },
                class:'toggle fullscreenToggle' + (!fullscreen.enabled ||  ELECTRON_FULLSCREEN ? ' disabled' : '')
            }

        ]
    },
    {
        title: icon('sliders-h') + '&nbsp; ' + locales('sidepanel_state'),
        actions: [
            {
                title: locales('state_store'),
                action:()=>{
                    state.quickSave()
                    DOM.get('.quickload')[0].classList.remove('disabled')
                    notifications.add({
                        icon: 'sliders-h',
                        message: locales('state_storesuccess')
                    })
                }
            },
            {
                title: locales('state_recall'),
                action: ()=>{
                    state.quickLoad()
                    notifications.add({
                        icon: 'sliders-h',
                        message: locales('state_recallsuccess')
                    })
                },
                class:'disabled quickload'
            },
            {
                title: locales('state_send'),
                action: ()=>{
                    state.send()
                    notifications.add({
                        icon: 'sliders-h',
                        message: locales('state_sendsuccess')
                    })
                }
            },
            {
                title: locales('state_import'),
                action:state.load.bind(state)
            },
            {
                title: locales('state_export'),
                action:state.save.bind(state)
            }
        ]
    },
    {
        title: icon('magic') + '&nbsp; ' + locales('sidepanel_traversing'),
        actions: [
            {
                title: locales('traversing_on'),
                action:(el)=>{
                    DOM.each(el.parentNode, 'a', (el)=>{
                        el.classList.remove('on')
                    })
                    el.classList.add('on')
                    var container = document.getElementById('container')
                    disableTraversingGestures(container)
                    enableTraversingGestures(container)
                },
                class:'traversingEnable'
            },
            {
                title: locales('traversing_smart'),
                action:(el)=>{
                    DOM.each(el.parentNode, 'a', (el)=>{
                        el.classList.remove('on')
                    })
                    el.classList.add('on')
                    var container = document.getElementById('container')
                    disableTraversingGestures(container)
                    enableTraversingGestures(container, {smart: true})
                },
                class:'traversingSmart'
            },
            {
                title: locales('traversing_off'),
                action:(el)=>{
                    DOM.each(el.parentNode, 'a', (el)=>{
                        el.classList.remove('on')
                    })
                    el.classList.add('on')
                    disableTraversingGestures(document.getElementById('container'))
                },
                class:'traversingDisable on'
            }
        ]
    },
    {
        title: icon('edit') + '&nbsp; ' + locales('sidepanel_editor'),
        class:'editor-menu',
        actions: [
            {
                title: locales('editor_on'),
                action:editor.enable.bind(editor),
                class:'enable-editor'
            },
            {
                title: locales('editor_off'),
                action:editor.disable.bind(editor),
                class:'on disable-editor'
            },
            {
                title: locales('editor_root'),
                class:'editor-root disabled'
            },
            {
                title: locales('editor_load'),
                action:session.browse.bind(session)
            },
            {
                title: locales('editor_save'),
                action:session.save.bind(session)
            },
            {
                title: locales('editor_save_as'),
                action:session.saveAs.bind(session)
            }
        ]
    },
]


if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {

    var NoSleep = require('nosleep.js'),
        noSleep = new NoSleep(),
        noSleepState = false

    sidepanelData[0].actions.push({
        title: locales('sidepanel_nosleep'),
        class: 'toggle',
        action:(el)=>{
            noSleepState = el.classList.toggle('on')
            if (noSleepState) {
                noSleep.enable()
            } else {
                noSleep.disable()
            }
        }
    })

}



var options = html`<ul id="options"></ul>`

for (let i in sidepanelData) {

    let data = sidepanelData[i],
        item = html`
            <li>
                <div class="${data.class || ''}">
                    <div class="actions">
                        ${data.title ? html`<div class="title">${raw(data.title)}</div>` : ''}
                    </div>
                </div>
            </li>
        `,
        wrapper = DOM.get(item, '.actions')[0]

    for (let j in data.actions) {

        let actionData = data.actions[j],
            element = html`<a class="btn ${actionData.class || ''}">${actionData.title}</a>`

        if (actionData.action) element.addEventListener('click', ()=>{actionData.action(element)})

        wrapper.appendChild(element)
    }

    options.appendChild(item)

}


var sidepanel = document.getElementById('sidepanel')

sidepanel.appendChild(html`
    <div class="navigation"><ul><li><a>${PACKAGE.productName.toUpperCase()}</a></li></ul></div>
`)

sidepanel.appendChild(options)

sidepanel.appendChild(html`<div id="editor"></div>`)


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

    DOM.get('#sidepanel')[0].classList.remove('hide')
    
    setTimeout(function(){
        DOM.each(document, '#open-toggle, #sidepanel', (el)=>{
            el.classList.add('sidepanel-open')
        })
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

    DOM.each(document, '#open-toggle, #sidepanel, #container', (el)=>{
        el.classList.remove('sidepanel-open')
    })

    setTimeout(function(){
        DOM.get('#sidepanel')[0].classList.add('hide')
    }, 250)

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
        e.detail.preventOriginalEvent = true
        sidepanelToggle()
    }

})

document.addEventListener('keydown', function(e){
    // F10
    if (e.keyCode==121) sidepanelToggle()
})


// Sidepanel resize

var resizeHandle = html`<div id="sidepanel-handle">${raw(icon('bars'))}</div>`,
    sidepanelWidth


sidepanel.appendChild(resizeHandle)

$(resizeHandle).draggable({
    cursor:'col-resize',
    start: ()=>{
        sidepanelWidth = parseInt(sidepanel.offsetWidth) / PXSCALE
        sidepanel.classList.add('resizing')
    },
    drag: (event, ui)=>{
        var delta = (ui.originalPosition.left - ui.position.left) / PXSCALE,
            newWidth = Math.max(sidepanelWidth + delta, 300)
        if (!isNaN(sidepanelWidth)) {
            document.documentElement.style.setProperty('--sidepanel-size', newWidth + 'rem')
        }
    },
    stop: ()=>{
        sidepanel.classList.remove('resizing')
    }
})



module.exports = {
    open: sidepanelOpen,
    close: sidepanelClose,
    toggle: sidepanelToggle
}
