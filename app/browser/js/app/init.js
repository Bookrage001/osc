init = function(session,callback) {

    $('#container').empty()

    parsetabs(session,$('#container'),true)

    // create sidepanel

    $('#sidepanel').append(createMenu([
        {
            label:'Fullscreen (F11)',
            click:toggleFullscreen,
            icon:'tv'
        },
        {
            html: `
            <div>
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
            html:`<div class="editor">
                    <div class="title"><i class="fa fa-edit"></i>&nbsp;Session editor</div>
                    <div class="actions">
                        <a class="enable-editor btn" data-action="enableEditor">On</a>
                        <a class="disable-editor btn on" data-action="disableEditor">Off</a>
                        <a class="editor-root btn disabled">Root</a>
                    </div>
                    <div class="actions">
                        <a class="editor-import btn" data-action="sessionBrowse">Load</a>
                        <a class="editor-export btn" data-action="sessionSave">Save</a>
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



    // MASTER DRAGGING (while shift key pressed)
    var target

    $(document).keydown(function (e) {
        if (e.keyCode == 16) {

            $('body').on('drag',function(ev,dd){
                dd.target = dd.originalEvent.changedTouches?
                        document.elementFromPoint(dd.originalEvent.changedTouches[0].clientX, dd.originalEvent.changedTouches[0].clientY)
                        :dd.target

                $(dd.target).trigger('draginit',[dd])
                target = dd.target

            })
        }
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 16) {
            $('body').off('drag')
        }
    });




    sidepanel = function() {
        $(`<a id="open-toggle">${icon('navicon')}</a>`).appendTo('#container').click(function(){
            $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
        })

        // in case where are hot loading a session
        if ($('#sidepanel').hasClass('sidepanel-open')) {
            $('#open-toggle, #container').addClass('sidepanel-open')
        }
    }
    sidepanel()

    // Widget Synchronization
    sync = function() {
        // Widget that share the same id will update each other
        // without sending any extra osc message
        $.each(__widgets__,function(i,widget) {
            if (widget.length>1) {
                var closureSync = function(x) {
                    return function() {
                        var v = widget[x].getValue()
                        for (k=0;k<widget.length;k++) {
                            if (x!=k) {
                                if (document.body.contains(widget[k][0].parentNode))
                                    widget[k].setValue(v,false,false)
                            }
                        }
                    }
                }
                for (j in widget) {
                    widget[j].off('sync.id').on('sync.id',closureSync(j))
                }
            }
        })
        // widgets that share the same linkId will update each other.
        // Updated widgets will send osc messages normally
        $.each(__widgetsLinks__,function(i,widget) {
            if (widget.length>1) {
                var closureSync = function(x) {
                    return function() {
                        var v = widget[x].getValue()
                        for (k=0;k<widget.length;k++) {
                            if (x!=k) {
                                if (document.body.contains(widget[k][0].parentNode))
                                    widget[k].setValue(v,true,false)
                            }
                        }
                    }
                }
                for (j in widget) {
                    widget[j].off('sync.link').on('sync.link',closureSync(j))
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
            $('html').on('mousewheel.zoom',function(e) {
                // console.log(e)
                if (e.ctrlKey) {
                    e.preventDefault()
                    if (e.originalEvent.deltaY==0) return
                    var d = -e.originalEvent.deltaY/Math.abs(e.originalEvent.deltaY)/20,
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
