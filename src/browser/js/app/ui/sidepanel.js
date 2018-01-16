var state = require('../managers/state'),
    session = require('../managers/session'),
    editor = require('../editor/'),
    icon = require('../utils').icon,
    fullscreen = require('screenfull'),
    {enableTraversingGestures, disableTraversingGestures} = require('../events/drag')

var sidepanelData = [
    {
        actions: [
            {
                title:'Fullscreen',
                action:()=>{
                    if (fullscreen.enabled) fullscreen.toggle()
                },
                class:'fullscreenToggle'
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
                    DOM.get('.quickload').classList.remove('disabled')
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

        if (actionData.action) element.addEventListener('fake-click', actionData.action)

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


function toggleSidepanel() {

    var transitionLength = 275

    DOM.get('#open-toggle, #sidepanel, #container').forEach((el)=>{
        el.classList.toggle('sidepanel-open')
    })

    setTimeout(function(){
        $(window).resize()
    }, transitionLength)

}

DOM.get('#container')[0].addEventListener('fake-click', function(e){

    if (e.target.id == 'open-toggle') toggleSidepanel()

})

document.addEventListener('keydown', function(e){
    // F10
    if (e.keyCode==121) toggleSidepanel()
})

// Fullscreen

var fsToggle = $('#sidepanel').find('.fullscreenToggle')

if (fullscreen.enabled) {
    fullscreen.off('change')
    fullscreen.on('change', ()=>{
        fsToggle.toggleClass('on', fullscreen.isFullScreen)
    })
} else {
    fsToggle.addClass('disabled')
}
