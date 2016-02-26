var editor = require('./editor'),
    enableEditor = editor.enable,
    disableEditor = editor.disable,
    utils = require('./utils')

var sidepanel = function() {
    $('#sidepanel').append(utils.createMenu([
        {
            label:'Fullscreen (F11)',
            click:utils.toggleFullscreen,
            icon:'tv'
        },
        {
            html: `
            <div>
                <div class="title"><i class="fa fa-sliders"></i>&nbsp;Snapshot</div>
                <div class="actions">
                    <a class="btn" data-action="utils.stateQuickSave">Store</a>
                    <a class="btn disabled quickload" data-action="utils.stateQuickLoad">Recall</a>
                    <a class="btn" data-action="utils.stateSend">Send</a>
                </div>
                <div class="actions">
                    <a class="btn" data-action="utils.stateLoad">Import</a>
                    <a class="btn" data-action="utils.stateSave">Export</a>
                </div>
            </div>

            `
        },
        {
            html:`<div class="editor">
                    <div class="title"><i class="fa fa-edit"></i>&nbsp;Session editor</div>
                    <div class="actions">
                        <a class="enable-editor btn" data-action="enableEditor">On</a>
                        <a class="disable-editor btn on" data-action="disableEditor">Off</a>
                        <a class="editor-root btn disabled">Root</a>
                    </div>
                    <div class="actions">
                        <a class="editor-import btn" data-action="utils.sessionBrowse">Load</a>
                        <a class="editor-export btn" data-action="utils.sessionSave">Save</a>
                    </div>
                    <div class="editor-container"></div>
                  </div>`,
        }
    ]))
    disableEditor()


    $('[data-action]').each(function(){
        $(this).click(function(){
            eval($(this).attr('data-action')+'()')
        })
    })

    $(`<a id="open-toggle">${utils.icon('navicon')}</a>`).appendTo('#container').click(function(){
        $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
    })

    // in case where are hot loading a session
    if ($('#sidepanel').hasClass('sidepanel-open')) {
        $('#open-toggle, #container').addClass('sidepanel-open')
    }

}

// Tabs...
var tabs = function() {
    $('.tablist a').click(function(){

        var id = $(this).data('tab')
        $(id).siblings('.on').removeClass('on')
        $(id).addClass('on')
        $(this).parents('ul').find('.on').removeClass('on')
        $(this).addClass('on');$(this).parent().addClass('on')

    })
}

// horizontal scrolling & zoom with mousewheel
// if shift is pressed (native), or if there is no vertical scrollbar,
//                               or if mouse is on h-scrollbar
var scrollbarHeight = 20
var scrolls = function(){
    if (WEBFRAME) {
        $('html').on('mousewheel.zoom',function(e) {
            // console.log(e)
            if (e.ctrlKey) {
                e.preventDefault()
                if (e.originalEvent.deltaY==0) return
                var d = -e.originalEvent.deltaY/Math.abs(e.originalEvent.deltaY)/20,
                    s = d+WEBFRAME.getZoomFactor()
                WEBFRAME.setZoomFactor(s)

            }
        })
        $(document).on('keydown.resetzoom', function(e){
            if (e.keyCode==96||e.keyCode==48) WEBFRAME.setZoomFactor(1)
        })

    }


    $('.tab').on('mousewheel.scroll',function(e) {
        if (!e.ctrlKey) {
            if ($(this).height()>$(this).get(0).scrollHeight) {
                var scroll = e.originalEvent.deltaY || e.originalEvent.deltaX
                $(this).scrollLeft($(this).scrollLeft()+scroll)
                e.preventDefault()
            } else if (e.pageY>window.innerHeight-scrollbarHeight) {
                $(this).scrollLeft($(this).scrollLeft()+e.originalEvent.deltaY)
                e.preventDefault()
            }
        }
    })

    $('.panel').on('mousewheel.scroll',function(e) {
        if (!e.ctrlKey) {

            var h = $(this).parent().innerHeight()-scrollbarHeight-$(this).parents('.tab').length*5
            if ($(this).get(0).scrollHeight+scrollbarHeight == $(this).parent().height()) {
                var scroll = e.originalEvent.deltaY || e.originalEvent.deltaX
                $(this).scrollLeft($(this).scrollLeft()+scroll)
                e.preventDefault()
            }

        }
    })
}


module.exports = function(){
    sidepanel()
    tabs()
    scrolls()
}
