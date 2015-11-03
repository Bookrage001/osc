init = function(session,callback) {

    $('#container').empty()

    parsetabs(session,$('#container'))

    // create sidepanel

    $('#sidepanel').append(createMenu([
        {
            html: `
            <div class="btn">
                <div class="title"><i class="fa fa-sliders"></i>&nbsp;Snapshot</div>
                <div class="actions">
                    <a class="btn" data-action="stateQuickSave">Store</a>
                    <a class="btn disabled" data-action="stateQuickLoad">Recall</a>
                    <a class="btn" data-action="stateSend">Send</a>
                </div>
                <div class="actions">
                    <a class="btn" data-action="stateLoad">Import</a>
                    <a class="btn" data-action="stateSave">Export</a>
                </div>
            </div>

            `
        },
        {
            label:'Fullscreen (F11)',
            click:toggleFullscreen,
            icon:'tv'
        },
        {
            html:`<div class="editor btn">
                    <div class="title"><i class="fa fa-edit"></i>&nbsp;Session editor</div>
                    <div class="actions">
                        <a class="enable-editor btn" data-action="enableEditor">On</a>
                        <a class="disable-editor btn on" data-action="disableEditor">Off</a>
                        <a class="editor-root btn disabled">Root</a>
                    </div>
                    <div class="actions">
                        <a class="editor-import btn" data-action="sessionBrowse">Open</a>
                        <a class="editor-export btn" data-action="sessionSave">Save</a>
                    </div>
                    <div class="editor-container"></div>
                  </div>`,
        }
    ]))

    $('[data-action]').each(function(){
        $(this).click(function(){
            eval($(this).attr('data-action')+'()')
        })
    })



    // MASTER DRAGGING (while shift key pressed)
    var target

    $(document).keydown(function (e) {
        if (e.keyCode == 16) {

            $('body').on('drag',function(ev,dd){
                dd.target = dd.originalEvent.changedTouches?
                        document.elementFromPoint(dd.originalEvent.changedTouches[0].clientX, dd.originalEvent.changedTouches[0].clientY)
                        :dd.target

                if ($('#sidepanel').has(dd.target)[0]) return
                dd.absolute=true
                dd.shiftKey=false
                $(dd.target).trigger('draginit',[dd])
                if (target!=dd.target) $(dd.target).click()
                target = dd.target

            })
        }
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 16) {
            $('body').off('draginit')
            $('body').off('drag')
            $('body').off('dragend')
        }
    });




    sidepanel = function() {
        $(`<a id="open-toggle">${icon('navicon')}</a>`).appendTo('#container').click(function(){
            $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
        })
    }
    sidepanel()

    // Widget Synchronization : widget that share the same id will update each other
    // without sending any extra osc message
    sync = function() {
        $.each(__widgets__,function(i,widget) {
            if (widget.length>1) {
                var script =''

                var closureSync = function(x) {
                    return function() {
                        var v = widget[x].getValue()
                        for (k=0;k<widget.length;k++) {
                            if (x!=k) {
                                widget[k].setValue(v,false,false)
                            }
                        }
                    }
                }

                for (j in widget) {
                    widget[j].on('sync',closureSync(j))
                }


            }
        })
    }
    sync()

    // Tabs...
    tabs = function() {
        $('.tablist a').click(function(){

            var id = $(this).data('tab')
            $(id).siblings('.on').removeClass('on')
            $(id).addClass('on')
            $(this).parents('ul').find('.on').removeClass('on')
            $(this).addClass('on');$(this).parent().addClass('on')

        })
    }
    tabs()







    // horizontal scrolling & zoom with mousewheel
    // if shift is pressed (native), or if there is no vertical scrollbar,
    //                               or if mouse is on h-scrollbar
    var scrollbarHeight = 20
    scrolls = function(){
        if (webFrame) {
            $('.tab').on('mousewheel.zoom',function(e) {
                // console.log(e)
                if (e.ctrlKey) {
                    e.preventDefault()
                    var d = -e.originalEvent.deltaY/Math.abs(e.originalEvent.deltaY)/10,
                        s = d+webFrame.getZoomFactor()
                    webFrame.setZoomFactor(s)

                }
            })
            $(document).on('keydown.resetzoom', function(e){
                if (e.keyCode==96||e.keyCode==48) webFrame.setZoomFactor(1)
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
    scrolls()





    if (callback) callback()

}
