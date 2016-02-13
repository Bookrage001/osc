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

enableEditor = function(){
    disableEditor()
    $('.widget').on('click.editor',function(e){
        e.preventDefault()
        e.stopPropagation()


        var container = $(this),
            parent = container.parent(),
            index = container.index(),
            data = getdata(container),
            form = $('<div class="form"></div>')


        $('.editing').removeClass('editing')
        container.addClass('editing')

        var updateWidget = function(){
            var scroll = $('#sidepanel').scrollTop()

            var state = stateGet()

            var newContainer = parsewidgets([data],parent)

            stateSet(state,false)

            container.replaceWith(newContainer)

            enableEditor()
            sync()
            newContainer.children().first().click()
            $('#sidepanel').scrollTop(scroll)

        }

        $('.widget.ui-resizable').resizable('destroy')
        $(this).resizable({
            handles:'se',
            helper: "resizable-helper",
            stop: function( event, ui ) {
                data.height = ui.size.height
                data.width = ui.size.width
                updateWidget()
            }
        })

        for (i in data) {
            if (i!='widgets' && i!='tabs') {
                var type = typeof data[i],
                    d = type == 'object'?JSON.stringify(data[i]):data[i],
                    label = $(`<label>${i}</label>`).appendTo(form),
                    input

                if (i=='type') {
                    input = $(`
                                <select class="input" data-type="${type}" title="${i}"/>
                            `)
                    for (t in widgetOptions) {
                        var selected = t==d?'selected=':''
                        input.append(`
                                        <option ${selected} value="${t}">${t}</option>
                                    `)
                    }
                    select = $('<div class="select-wrapper"></div>').append(input)
                    select.appendTo(form)
                } else if (typeof widgetOptions[data.type][i]=='boolean') {
                    input = $(`
                                <input class="checkbox" data-type="${type}" value='${d}' title="${i}"/>
                            `)
                    input.click(function(){
                        $(this).val(!eval($(this).val())).trigger('change')
                    })
                    input.appendTo(form)

                } else {
                    input = $(`
                                <input data-type="${type}" value='${d}' title="${i}"/>
                            `)
                    input.appendTo(form)
                }


                input.on('change',function(){
                    var v = $(this).val()!= '' && $(this).data('type') == 'object'?JSON.parse($(this).val()):$(this).val()
                    data[$(this).attr('title')]= v=='true'||v=='false'?eval(v):v
                    if (v=='') delete data[$(this).attr('title')]
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
            var scroll = $('#sidepanel').scrollTop()

            var state = stateGet()

            container.empty()
            parsewidgets(data.widgets,container)

            stateSet(state,false)

            enableEditor()
            sync()

            link.click()

            $('#sidepanel').scrollTop(scroll)
        }

        var updateSession = function(){
            var scroll = $('#sidepanel').scrollTop()

            var state = stateGet()

            init(session,function(){
                stateSet(state,false)
                enableEditor()
                for (i in ontab) {
                    $(`a[data-tab="#${ontab[i]}"]`).click()
                }
                $('#sidepanel').scrollTop(scroll)
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
                    var v = $(this).val()!= '' && $(this).data('type') == 'object'?JSON.parse($(this).val()):$(this).val()
                    data[$(this).attr('title')]= v=='true'||v=='false'?eval(v):v
                    if (v=='') delete data[$(this).attr('title')]
                    updateSession()
                })

            }
        }
        if (!data.tabs || data.tabs.length==0) {

            var list = $('<ul class="input"></ul>')

            for (i in data.widgets) {
                var label = data.widgets[i].label!='auto'&&data.widgets[i].label!=false?data.widgets[i].label:data.widgets[i].id
                var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${label}</a></li>`)
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
            var scroll = $('#sidepanel').scrollTop()

            var state = stateGet()

            init(session,function(){
                stateSet(state,false)
                enableEditor()
                for (i in ontab) {
                    $(`a[data-tab="#${ontab[i]}"]`).click()
                }
                $('.editor-root').click()
                $('#sidepanel').scrollTop(scroll)
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

disableEditor = function(){
    $('.widget').off('click.editor')
    $('a[data-tab]').off('click.editor')
    $('.editor-root').off('click.editor').addClass('disabled')
    $('.enable-editor').removeClass('on')
    $('.disable-editor').addClass('on')
    $('.editing').removeClass('editing')
    $('.editor-container').empty()
}
