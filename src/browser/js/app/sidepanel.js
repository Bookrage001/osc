var state = require('./managers/state'),
    session = require('./managers/session'),
    editor = require('./editor/'),
    icon = require('./utils').icon,
    fullscreen = require('screenfull')

var data = [
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
                    $('.quickload').removeClass('disabled')
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
                    $('.traversingEnable, .traversingDisable').toggleClass('on')
                    $('#container').enableTraversingGestures()
                },
                class:'traversingEnable'
            },
            {
                title:'Off',
                action:()=>{
                    $('.traversingEnable, .traversingDisable').toggleClass('on')
                    $('#container').disableTraversingGestures()
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

var sidepanel = $('<ul id="options"></ul>')

for (let i in data) {

    let itemData = data[i],
        item = $('<li></li>'),
        inner = $(`<div class="${itemData.class || ''}"></div>`).appendTo(item),
        wrapper = $('<div class="actions"></div>').appendTo(inner)

    if (itemData.title) $(`<div class="title">${itemData.title}</div>`).prependTo(wrapper)

    for (let j in itemData.actions) {

        let actionData = itemData.actions[j],
            element = $(`<a class="btn ${actionData.class || ''}">${actionData.title}</a>`).appendTo(wrapper)

        if (actionData.action) element.click(actionData.action)

    }

    item.appendTo(sidepanel)

}


$('#sidepanel').empty()
$('#sidepanel').append(`
    <div class="navigation"><ul><li><a>${PACKAGE.productName.toUpperCase()}</a></li></ul></div>
`)
$('#sidepanel').append(sidepanel)
$('#sidepanel').append('<div id="editor"></div>')

$('#container').on('fake-click.sidepanel', function(e){

    if (e.target.id != 'open-toggle') return

    var t = (!$('#sidepanel').hasClass('sidepanel-open')) ? 250 : 0


    setTimeout(function(){
        $('#open-toggle, #sidepanel').toggleClass('sidepanel-open')
    }, 25)

    setTimeout(function(){
        $('#container').toggleClass('sidepanel-open')
        $(window).resize()
    },t + 25)

})

$(document).on('keydown.sidepanel', function(e){
    if (e.keyCode==121) $('#open-toggle').trigger('fake-click')
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
