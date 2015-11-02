

init = function(session,callback) {

    parsetabs(session,$('#container'))



    // Widget Synchronization : widget that share the same id will update each other
    // without sending any extra osc message

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




    // Tabs...
    $('.tablist a').click(function(){

        var id = $(this).data('tab')
        $(id).siblings('.on').removeClass('on')
        $(id).addClass('on')
        $(this).parents('ul').find('.on').removeClass('on')
        $(this).addClass('on');$(this).parent().addClass('on')

    })




    // Activate first tabs
    $('.tablist li:first-child a').click()


    // horizontal scrolling & zoom with mousewheel
    // if shift is pressed (native), or if there is no vertical scrollbar,
    //                               or if mouse is on h-scrollbar
    var scrollbarHeight = 20
    var contentPanels = $('.content')


    function scrollBindings(){

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
    scrollBindings()


    // sidepanel
    $('#container').append('\
        <a id="open-toggle">'+icon('navicon')+'</a>\
    ')


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
            html:'<div class="editor btn">\
                  </div>',
        },
        {
            html:'<div class="inspector btn">\
                    Inspector\
                    <div class="result"><em>Click on a widges\'s label to inspect</em></div>\
                  </div>',
            icon:'terminal'
        }
    ]))


    $('#open-toggle').click(function(){
        $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
    })

    $('.widget').click(function(e){
        if (!$('#sidepanel').hasClass('sidepanel-open')){return}
        var data = String(JSON.stringify($(e.target).parents('.widget').first().data('widgetData'),null,2)).split('\n').join('<br/>&nbsp;&nbsp;')
        $('.inspector .result').html(data)
    })

    // MASTER DRAGGING (while shift key pressed)
    var target

    $(document).keydown(function (e) {
        if (e.keyCode == 16) {
            // $('body').addClass('master-dragging')

            $('body').on('drag',function(ev,dd){
                dd.absolute=true
                dd.shiftKey=false
                $(dd.target).trigger('draginit',[dd])
                if (target!=dd.target) $(dd.target).click()
                target = dd.target

            })
            $('body').on('dragend',function(ev,dd){
                // $('body').addClass('master-dragging')
            })
        }
    });
    $(document).keyup(function (e) {
        if (e.keyCode == 16) {
            $('body').removeClass('master-dragging')
            $('body').off('draginit')
            $('body').off('drag')
            $('body').off('dragend')
        }
    });


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

    function editor(){
    $('.widget ').click(function(e){
        e.preventDefault()
        e.stopPropagation()

        var container = $(this),
            parent = container.parent(),
            parentContainer = parent.parent().hasClass('content')?parent:parent.parent(),
            index = container.index(),
            data = getdata(container),
            form = $('<form></form>')

        for (i in data) {
            if (i!='widgets' && i!='tabs') {
                var d = JSON.stringify(data[i])
                var input = $(`
                    <input value='${d}' title="${i}"/>
                `)
                input.appendTo(form)
                input.on('change',function(){
                    data[$(this).attr('title')]=$(this).val().match(/[false|true]/)==null?eval($(this).val()):JSON.parse($(this).val())

                    var newContainer = parsewidgets([data],parent)

                    container.remove()

                    if (index == parent.children().length-1) {
                        newContainer.detach().appendTo(parent)
                    } else {
                        newContainer.detach().insertBefore(parent.children().eq(index))
                    }
                    editor()
                    newContainer.children().first().click()
                })

            }
        }
        if (data.widgets) {

            var list = $('<ul class="input"></ul>')

            for (i in data.widgets) {
                var label = data.widgets[i].label!='auto'&&data.widgets[i].label!=false?data.widgets[i].label:data.widgets[i].id
                var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}">${label}</li>`).appendTo(list)
            }

            list.sortable({forcePlaceholderSize: true, items: '.sortables'}).on('sortupdate',function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                var newContainer = parsewidgets([data],parent)

                container.remove()

                if (index == parent.children().length-1) {
                    newContainer.detach().appendTo(parent)
                } else {
                    newContainer.detach().insertBefore(parent.children().eq(index))
                }
                editor()
                // newContainer.children().first().click()
            })

            var add = $(`<li>+</li>`).appendTo(list).click(function(){
                data.widgets.push({})

                var newContainer = parsewidgets([data],parent)

                container.remove()

                if (index == parent.children().length-1) {
                    newContainer.detach().appendTo(parent)
                } else {
                    newContainer.detach().insertBefore(parent.children().eq(index))
                }
                editor()
                newContainer.children().first().click()
            })
            list.appendTo(form)

        }

        $('.editor').html(form)
        scrollBindings()
    })


    $('a[data-tab]').click(function(e){
        e.preventDefault()
        e.stopPropagation()

        var link = $(this),
            container = $($(this).attr('data-tab')),
            parent = container.parent(),
            parentContainer = container.parent().parent(),
            index = container.index(),
            data = getdata(container),
            form = $('<form></form>')

        for (i in data) {
            if (i!='widgets' && i!='tabs') {
                var d = JSON.stringify(data[i])
                var input = $(`
                    <input value='${d}' title="${i}"/>
                `)
                input.appendTo(form)
                input.on('change',function(){
                    data[$(this).attr('title')]=$(this).val().match(/[false|true]/)==null?eval($(this).val()):JSON.parse($(this).val())

                    var newContainer = parsewidgets([data],parent)

                    container.remove()

                    if (index == parent.children().length-1) {
                        newContainer.detach().appendTo(parent)
                    } else {
                        newContainer.detach().insertBefore(parent.children().eq(index))
                    }

                    editor()

                    link.click()
                })

            }
        }
        if (data.widgets) {

            var list = $('<ul class="input"></ul>')

            for (i in data.widgets) {
                var label = data.widgets[i].label!='auto'&&data.widgets[i].label!=false?data.widgets[i].label:data.widgets[i].id
                var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}">${label}</li>`).appendTo(list)
            }

            list.sortable({forcePlaceholderSize: true, items: '.sortables'}).on('sortupdate',function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                container.empty()
                parsewidgets(data.widgets,container)

                editor()

                link.click()
            })

            var add = $(`<li>+</li>`).appendTo(list).click(function(){
                data.widgets.push({})

                container.empty()
                parsewidgets(data.widgets,container)

                editor()

                link.click()
            })
            list.appendTo(form)

        }

        $('.editor').html(form)
        scrollBindings()
    })










}
editor()
$('#open-toggle').click()




    if (callback) callback()

}
