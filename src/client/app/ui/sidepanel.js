var state = require('../managers/state'),
    session = require('../managers/session'),
    editor = require('../editor/'),
    {icon} = require('./utils'),
    fullscreen = require('./fullscreen'),
    notifications = require('./notifications'),
    {enableTraversingGestures, disableTraversingGestures} = require('../events/drag'),
    locales = require('../locales'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw'),
    contextMenu = require('./context-menu')

var sidepanelData = [
    {
        actions: [
            {
                label: locales('sidepanel_fs') + (ELECTRON_FULLSCREEN ? ' (F11)' : ''),
                action:()=>{
                    if (fullscreen.enabled) fullscreen.toggle()
                },
                class:'toggle fullscreenToggle' + (!fullscreen.enabled ||  ELECTRON_FULLSCREEN ? ' disabled' : '')
            }

        ]
    },
    {
        label: icon('sliders-h') + '&nbsp; ' + locales('sidepanel_state'),
        actions: [
            {
                label: locales('state_store'),
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
                label: locales('state_recall'),
                action: ()=>{
                    state.quickLoad()
                },
                class:'disabled quickload'
            },
            {
                label: locales('state_send'),
                action: ()=>{
                    state.send()
                    notifications.add({
                        icon: 'sliders-h',
                        message: locales('state_sendsuccess')
                    })
                }
            },
            {
                label: locales('editor_load'),
                action:()=>{
                    state.browse()
                }
            },
            {
                label: locales('editor_save'),
                action:()=>{
                    state.save(state.statePath)
                }
            },
            {
                label: raw(icon('ellipsis-h')),
                class: 'narrow',
                menu: [
                    {
                        label: locales('editor_save_as'),
                        action:()=>{
                            state.saveAs()
                        }
                    },
                    {
                        label: locales('state_import'),
                        click: true,
                        action:state.import.bind(state)
                    },
                    {
                        label: locales('state_export'),
                        click: true,
                        action:state.export.bind(state)
                    },
                ]
            }
        ]
    },
    {
        label: icon('magic') + '&nbsp; ' + locales('sidepanel_traversing'),
        actions: [
            {
                label: locales('traversing_on'),
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
                label: locales('traversing_smart'),
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
                label: locales('traversing_off'),
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
        label: icon('edit') + '&nbsp; ' + locales('sidepanel_editor'),
        class:'editor-menu',
        actions: [
            {
                label: locales('editor_on'),
                action:editor.enable.bind(editor),
                class:'enable-editor'
            },
            {
                label: locales('editor_off'),
                action:editor.disable.bind(editor),
                class:'on disable-editor'
            },
            {
                label: raw(icon('vector-square')),
                class:'editor-root disabled narrow',
                title: locales('editor_root')
            },
            {
                label: locales('editor_load'),
                action:session.browse.bind(session)
            },
            {
                label: locales('editor_save'),
                action:()=>{
                    session.save()
                }
            },
            {
                label: raw(icon('ellipsis-h')),
                class: 'narrow',
                menu: [
                    {
                        label: locales('editor_save_as'),
                        action:()=>{
                            session.saveAs()
                        }
                    },
                    {
                        label: locales('editor_import'),
                        click: true,
                        action: ()=>{
                            session.import()
                        }
                    },
                    {
                        label: locales('editor_export'),
                        click: true,
                        action: ()=>{
                            session.export()
                        }
                    }
                ]
            }
        ]
    },
]


if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {

    var NoSleep = require('nosleep.js'),
        noSleep = new NoSleep(),
        noSleepState = false

    sidepanelData[0].actions.push({
        label: locales('sidepanel_nosleep'),
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
                        ${data.label ? html`<div class="title">${raw(data.label)}</div>` : ''}
                    </div>
                </div>
            </li>
        `,
        wrapper = DOM.get(item, '.actions')[0]

    for (let j in data.actions) {

        let actionData = data.actions[j],
            element = html`<a class="btn ${actionData.class || ''}" title="${actionData.title || ''}">${actionData.label}</a>`

        if (actionData.action) element.addEventListener('click', ()=>{actionData.action(element)})

        if (actionData.menu) {

            element.addEventListener('fast-click', (e)=>{
                contextMenu.open(e.detail, actionData.menu)
            })

        }

        wrapper.appendChild(element)
    }

    options.appendChild(item)

}


var sidepanel = document.getElementById('sidepanel-wrapper'),
    sidepanelContainer = document.getElementById('sidepanel')

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
        if (sidepaneLock) return
        DOM.get('#sidepanel')[0].classList.add('hide')
    }, 250)

    setTimeout(function(){
        DOM.dispatchEvent(window, 'resize')
    }, 25)

}

function sidepanelToggle() {

    if (sidepanelContainer.classList.contains('sidepanel-open')) {
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

var sidepanelWidth

$('#sidepanel-handle').draggable({
    cursor:'col-resize',
    start: ()=>{
        sidepanelWidth = parseInt(sidepanelContainer.offsetWidth) / PXSCALE
        sidepanelContainer.classList.add('resizing')
    },
    drag: (event, ui)=>{
        var delta = (ui.originalPosition.left - ui.position.left) / PXSCALE,
            newWidth = Math.max(sidepanelWidth + delta, 300)
        if (!isNaN(sidepanelWidth)) {
            document.documentElement.style.setProperty('--sidepanel-size', newWidth + 'rem')
        }
    },
    stop: ()=>{
        sidepanelContainer.classList.remove('resizing')
    }
})



module.exports = {
    open: sidepanelOpen,
    close: sidepanelClose,
    toggle: sidepanelToggle
}
