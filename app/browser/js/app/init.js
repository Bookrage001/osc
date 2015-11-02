init = function(session,callback) {

    parsetabs(session,$('#container'))

    // create sidepanel

    $('#sidepanel').append(createMenu([
        {
            label:'Save',
            click:saveState,
            icon:'save'
        },
        {
            label:'Load',
            click:loadState,
            icon:'folder-open'
        },
        {
            label:'Load last state',
            click:loadLastState,
            icon:'history'
        },
        {
            label:'Send all',
            click:sendState,
            icon:'feed'

        },
        {
            label:'Fullscreen',
            click:toggleFullscreen,
            icon:'tv'
        },
        {
            html:`<div class="editor btn">
                    <div class="title"><i class="fa fa-edit"></i>&nbsp;Editor</div>
                    <div class="actions">
                        <a class="enable-editor btn">Enabled</a>
                        <a class="disable-editor btn on">Disabled</a>
                        <a class="editor-root btn disabled">Root</a>
                    </div>
                    <div class="editor-container"></div>
                  </div>`,
        }
    ]))



    // MASTER DRAGGING (while shift key pressed)
    var target

    $(document).keydown(function (e) {
        if (e.keyCode == 16) {

            $('body').on('drag',function(ev,dd){
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




    function sidepanel() {
        $(`<a id="open-toggle">${icon('navicon')}</a>`).appendTo('#container').click(function(){
            $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
        })
    }
    sidepanel()

    // Widget Synchronization : widget that share the same id will update each other
    // without sending any extra osc message
    function sync() {
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
    function tabs() {
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
    function scrolls(){
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





    function getdata(obj){
        var path = []

        do {
            if (obj.hasClass('widget')) {
                path.unshift(obj.index())
                path.unshift('widgets')
            } else if (obj.hasClass('tab')){
                path.unshift(obj.index())
                path.unshift('tabs')
            } else if (obj.attr('id')=='container') {
                break
            }

        } while(obj = obj.parent() )

        path.splice(0,1)

        for (var i=0,obj=session, path=path, len=path.length; i<len; i++){
            obj = obj[path[i]];
        };
        return obj;

    }

    function enableEditor(){
        disableEditor()
        $('.widget').on('click.editor',function(e){
            e.preventDefault()
            e.stopPropagation()

            var container = $(this),
                parent = container.parent(),
                parentContainer = parent.parent().hasClass('content')?parent:parent.parent(),
                index = container.index(),
                data = getdata(container),
                form = $('<div class="form"></div>')

            $('.editing').removeClass('editing')
            container.addClass('editing')

            var updateWidget = function(){
                var newContainer = parsewidgets([data],parent)

                container.remove()

                if (index == parent.children().length-1) {
                    newContainer.detach().appendTo(parent)
                } else {
                    newContainer.detach().insertBefore(parent.children().eq(index))
                }
                enableEditor()
                sync()

                newContainer.children().first().click()

            }

            for (i in data) {
                if (i!='widgets' && i!='tabs') {
                    var type = typeof data[i]
                    var d = type == 'object'?JSON.stringify(data[i]):data[i]
                    var input = $(`
                        <label>${i}</label>
                        <input data-type="${type}" value='${d}' title="${i}"/>
                    `)
                    input.appendTo(form)
                    input.on('change',function(){
                        var v = $(this).data('type') == 'object'?JSON.parse($(this).val()):$(this).val()
                        data[$(this).attr('title')]= v=='true'||v=='false'?eval(v):v
                        updateWidget()
                    })

                }
            }
            if (data.widgets) {

                var list = $('<ul class="input"></ul>')

                for (i in data.widgets) {
                    var label = data.widgets[i].label!='auto'&&data.widgets[i].label!=false?data.widgets[i].label:data.widgets[i].id
                    var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}"><a class="btn small">${label}</a></li>`)
                                .appendTo(list)
                                .click(function(){
                                    container.find('.widget').first().parent().children('.widget').eq($(this).attr('data-index')).click()
                                })
                    var remove = $('<span><i class="fa fa-remove"></i></span>')
                                  .appendTo(item)
                                  .click(function(){
                                      data.widgets.splice($(this).parent().attr('data-index'),1)
                                      updateWidget()
                                  })
                }

                list.sortable({forcePlaceholderSize: true, items: '.sortables'}).on('sortupdate',function(e,ui){
                    var prevIndex = $(ui.item).attr('data-index')
                    var newIndex  = $(ui.item).index()

                    data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                    updateWidget()
                })

                var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
                    data.widgets = data.widgets || []
                    data.widgets.push({})

                    updateWidget()
                })

                $('<label>widgets</label>').appendTo(form)
                list.appendTo(form)

            }

            $('.editor-container').html(form)
            scrolls()
        })


        $('a[data-tab]').on('click.editor',function(e){
            e.preventDefault()
            e.stopPropagation()

            var link = $(this),
                container = $(link.attr('data-tab')),
                parent = container.parent(),
                parentContainer = container.parent().parent(),
                index = container.index(),
                data = getdata(container),
                form = $('<div class="form"></div>')

            $('.editing').removeClass('editing')
            link.addClass('editing')

            var ontab = []
            $('.tab.on').each(function(i){
                ontab.push($(this).attr('id'))
            })
            ontab.splice(ontab.indexOf(container.attr('id')),1)
            ontab.push(container.attr('id'))

            var updateTab = function() {

                container.empty()
                parsewidgets(data.widgets,container)

                enableEditor()
                sync()

                link.click()
            }

            var updateSession = function(){

                $('#container').empty()

                init(session,function(){
                    enableEditor()
                    for (i in ontab) {
                        $(`a[data-tab="#${ontab[i]}"]`).click()
                    }
                })

            }

            for (i in data) {
                if (i!='widgets' && i!='tabs') {
                    var type = typeof data[i]
                    var d = type == 'object'?JSON.stringify(data[i]):data[i]
                    var input = $(`
                        <label>${i}</label>
                        <input data-type="${type}" value='${d}' title="${i}"/>
                    `)
                    input.appendTo(form)
                    input.on('change',function(){
                        var v = $(this).data('type') == 'object'?JSON.parse($(this).val()):$(this).val()
                        data[$(this).attr('title')]= v=='true'||v=='false'?eval(v):v
                        updateSession()
                    })

                }
            }
            if (!data.tabs || data.tabs.length==0) {

                var list = $('<ul class="input"></ul>')

                for (i in data.widgets) {
                    var label = data.widgets[i].label!='auto'&&data.widgets[i].label!=false?data.widgets[i].label:data.widgets[i].id
                    var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}"><a class="btn small">${label}</a></li>`)
                                .appendTo(list)
                                .click(function(){
                                    container.find('.widget').first().parent().children('.widget').eq($(this).attr('data-index')).click()
                                })
                    var remove = $('<span><i class="fa fa-remove"></i></span>')
                                  .appendTo(item)
                                  .click(function(){
                                      data.widgets.splice($(this).parent().attr('data-index'),1)
                                      updateTab()
                                  })
                }

                list.sortable({forcePlaceholderSize: true, items: '.sortables'}).on('sortupdate',function(e,ui){
                    var prevIndex = $(ui.item).attr('data-index')
                    var newIndex  = $(ui.item).index()

                    data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                    updateTab()

                })

                var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
                    data.widgets = data.widgets || []
                    data.widgets.push({})

                    updateTab()
                })
                $('<label>widgets</label>').appendTo(form)
                list.appendTo(form)

            }

            if (!data.widgets || data.widgets.length==0) {
                //tabs
                var list = $('<ul class="input"></ul>')

                for (i in data.tabs) {
                    var label = data.tabs[i].label
                    var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${label}</a></li>`)
                                .appendTo(list)
                                .click(function(){
                                    var id = container.find('.tab').first().parent().children('.tab').eq($(this).attr('data-index')).attr('id')
                                    $(`a[data-tab="#${id}"]`).click()
                                })
                    var remove = $('<span><i class="fa fa-remove"></i></span>')
                                  .appendTo(item)
                                  .click(function(){
                                      data.tabs.splice($(this).parent().attr('data-index'),1)
                                      updateSession()
                                  })
                }

                list.sortable({forcePlaceholderSize: true, items: '.sortables'}).on('sortupdate',function(e,ui){
                    var prevIndex = $(ui.item).attr('data-index')
                    var newIndex  = $(ui.item).index()

                    data.tabs.splice(newIndex, 0, data.tabs.splice(prevIndex, 1)[0])

                    updateSession()
                })

                var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
                    data.tabs = data.tabs || []
                    data.tabs.push({})

                    updateSession()
                })
                $('<label>tabs</label>').appendTo(form)
                list.appendTo(form)
            }

            $('.editor-container').html(form)
            scrolls()
        })
        $('.editor-root').removeClass('disabled').on('click.editor',function(e){
            e.preventDefault()
            e.stopPropagation()

            var data = session,
                form = $('<div class="form"></div>'),
                container = $('#container')

            $('.editing').removeClass('editing')
            $(this).addClass('editing')

            var ontab = []
            $('.tab.on').each(function(i){
                ontab.push($(this).attr('id'))
            })
            ontab.splice(ontab.indexOf(container.attr('id')),1)
            ontab.push(container.attr('id'))


            var updateSession = function(){

                $('#container').empty()

                init(session,function(){
                    enableEditor()
                    for (i in ontab) {
                        $(`a[data-tab="#${ontab[i]}"]`).click()
                    }
                    $('.editor-root').click()
                })

            }


            var list = $('<ul class="input"></ul>')

            for (i in data) {
                var label = data[i].label
                var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${label}</a></li>`)
                            .appendTo(list)
                            .click(function(){
                                var id = $('#container > .content > .tab').eq($(this).attr('data-index')).attr('id')
                                $(`a[data-tab="#${id}"]`).click()
                            })
                var remove = $('<span><i class="fa fa-remove"></i></span>')
                              .appendTo(item)
                              .click(function(){
                                  data.splice($(this).parent().attr('data-index'),1)
                                  updateSession()
                              })
            }

            list.sortable({forcePlaceholderSize: true, items: '.sortables'}).on('sortupdate',function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.splice(newIndex, 0, data.splice(prevIndex, 1)[0])

                updateSession()
            })

            var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
                data = data || []
                data.push({})

                updateSession()
            })
            $('<label>tabs</label>').appendTo(form)
            list.appendTo(form)


            $('.editor-container').html(form)
        })

        $('.enable-editor').addClass('on')
        $('.disable-editor').removeClass('on')
    }
    function disableEditor(){
        $('.widget').off('click.editor')
        $('a[data-tab]').off('click.editor')
        $('.editor-root').off('click.editor').addClass('disabled')
        $('.enable-editor').removeClass('on')
        $('.disable-editor').addClass('on')
        $('.editing').removeClass('editing')
        $('.editor-container').empty()
    }


    // $('#open-toggle').click()

    $('.enable-editor').click(enableEditor)
    $('.disable-editor').click(disableEditor)


    if (callback) callback()

}
