var updateDom = require('./data-workers').updateDom,
    widgetOptions = require('../widgets').widgetOptions

var ev = 'fake-click'

var editClean = function(){
    $('.editing').removeClass('editing')
    $('.widget.ui-resizable').resizable('destroy')
    $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()
    $('.editor-container').remove()
}


var editObject = function(container, data, refresh){

    if (!refresh && (container.hasClass('editing') || $(`a[data-tab="#${container.attr('id')}"]`).hasClass('editing'))) return

    var isWidget = container.hasClass('widget')

    editClean()

    if (isWidget) {
        $(container).addClass('editing')
    } else {
        $(`[data-tab="#${container.attr('id')}"]`).addClass('editing')
        $(container).parent().addClass('editing')
    }

    $('#editor').append('<div class="editor-container"></div>')
    var form = $('<div class="form"></div>').appendTo('.editor-container')


    var params = isWidget?widgetOptions[data.type]:{label:'', id:''}

    $(`<div class="separator"><span>${isWidget?'Widget':'Tab'}</span></div>`).appendTo(form)

    for (var i in params) {

        if (i.indexOf('_')==0) {
            $(`<div class="separator"><span>${params[i]}</span></div>`).appendTo(form)
            continue
        } else if (data[i]===undefined) {
            continue
        }

        // Common options edit
        if (i!='widgets' && i!='tabs') {

            let type = typeof data[i],
                value = type == 'object'?JSON.stringify(data[i]):data[i],
                wrapper = $('<div class="input-wrapper"></div>').appendTo(form),
                label = $(`<label>${i}</label>`).appendTo(wrapper),
                input

            if (i=='type') {

                input = $(`<select class="input" data-type="${type}" title="${i}"/>`)

                for (let t in widgetOptions) {
                    input.append(`<option ${t==value?'selected=':''} value="${t}">${t}</option>`)
                }
                let select = $('<div class="select-wrapper"></div>').append(input)
                select.appendTo(wrapper)

            } else if (typeof params[i]=='boolean') {

                input = $(`<input class="checkbox" data-type="${type}" value='${value}' title="${i}"/>`)
                input.click(function(){
                    $(this).val(!eval($(this).val())).trigger('change')
                })
                input.appendTo(wrapper)

            } else if (i == 'layout') {

                input = $(`<textarea data-type="${type}" title="${i}" rows="${value.split('\n').length}">${value}</textarea>`)
                input.on('input focus', function(){
                    this.setAttribute('rows',$(this).val().split('\n').length)
                })
                input.on('keydown', (e)=>{
                    if (e.keyCode == 13 && !e.shiftKey) {
                        input.trigger('change')
                    }
                })
                input.appendTo(wrapper)

            } else {

                input = $(`<input data-type="${type}" value='${value}' title="${i}"/>`)
                input.appendTo(wrapper)

            }


            input.on('change',function(){
                // var v = $(this).val()!= '' && $(this).data('type') == 'object'?JSON.parse($(this).val()):$(this).val()
                var v
                try {
                    eval(`v=${$(this).val()}`)
                } catch(err) {
                    v = $(this).val()
                }

                data[$(this).attr('title')] = v
                if (v==='' && isWidget) delete data[$(this).attr('title')]

                try {
                    updateDom(container,data)
                    input.removeClass('error')
                } catch (err) {
                    input.addClass('error')
                    throw err
                }
            })

        }

    }

    // widget list edit
    if (((isWidget&&widgetOptions[data.type].widgets) || (container.hasClass('tab'))) && (!data.tabs||!data.tabs.length)) {

        $(`<div class="separator"><span>Widgets</span></div>`).appendTo(form)

        var list = $('<ul class="input"></ul>'),
            wrapper = $('<div class="input-wrapper column"></div>').appendTo(form)

        var editItem = function(i) {
            return function(){
                container.find('.widget').first().siblings().addBack().eq(i).trigger(ev)
            }
        }

        for (var i in data.widgets) {


            var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}"><a class="btn small">${data.widgets[i].id||data.widgets[i].label}</a></li>`)
                       .appendTo(list)
                       .click(editItem(i))

            var remove = $('<span><i class="fa fa-remove"></i></span>')
                          .appendTo(item)
                          .click(function(e){
                              e.stopPropagation()
                              data.widgets.splice($(this).parent().attr('data-index'),1)
                              updateDom(container,data)
                          })
        }

        list.sortable({
            forcePlaceholderSize: true,
            items: '.sortables',
            start:function(){$(this).sortable( "refreshPositions" )},
            update: function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                updateDom(container,data)
            }
        })

        var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
            data.widgets = data.widgets || []
            data.widgets.push({})

            updateDom(container,data)
        })

        list.appendTo(wrapper)

    }

    // tab list edit
    if (((isWidget&&widgetOptions[data.type].tabs) || (container.hasClass('tab'))) && (!data.widgets||!data.widgets.length)) {

        $(`<div class="separator"><span>Tabs</span></div>`).appendTo(form)

        //tabs
        var list = $('<ul class="input"></ul>'),
            wrapper = $('<div class="input-wrapper column"></div>').appendTo(form)


        var editItem = function(i) {
            return function(){
                container.find('.tab').first().siblings().addBack().eq(i).trigger(ev)
            }
        }

        for (var i in data.tabs) {
            var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${data.tabs[i].label}</a></li>`)
                        .appendTo(list)
                        .click(editItem(i))

            var remove = $('<span><i class="fa fa-remove"></i></span>')
                          .appendTo(item)
                          .click(function(e){
                              e.stopPropagation()
                              data.tabs.splice($(this).parent().attr('data-index'),1)
                              updateDom(container,data)
                          })
        }

        list.sortable({
            start:function(){$(this).sortable( "refreshPositions" )},
            forcePlaceholderSize: true,
            items: '.sortables',
            update: function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.tabs.splice(newIndex, 0, data.tabs.splice(prevIndex, 1)[0])

                updateDom(container,data)
            }
        })

        var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
            data.tabs = data.tabs || []
            data.tabs.push({})

            updateDom(container,data)
        })

        list.appendTo(wrapper)
    }

    if (data.hasOwnProperty('width')) {
        var handleTarget
        container.resizable({
            handles:'s, e, se',
            helper: "ui-helper",
            start: function(event, ui){
                handleTarget = $(event.originalEvent.target)
            },
            resize: function(event, ui) {
                ui.size.height = Math.round(ui.size.height / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                ui.size.width = Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
            },
            stop: function( event, ui ) {
                if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-s')) data.height = Math.round((Math.max(ui.size.height,30)) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
                if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-e')) data.width =  Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
                updateDom(container,data)
            },
            grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE]
        })
    }

    if (data.hasOwnProperty('top')) {
        container.draggable({
                cursor:'-webkit-grabbing',
                drag: function(event, ui) {
                    ui.position.top = Math.round(ui.position.top / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                    ui.position.left = Math.round(ui.position.left / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                },
                stop: function( event, ui ) {
                    event.preventDefault()
                    data.top = (ui.helper.position().top + container.parent().scrollTop())/PXSCALE
                    data.left = (ui.helper.position().left + container.parent().scrollLeft())/PXSCALE
                    ui.helper.remove()
                    updateDom(container,data)
                },
                handle:'.ui-draggable-handle, > .label',
                grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE],
                helper:function(){return $('<div class="ui-helper"></div>').css({height:container.outerHeight(),width:container.outerWidth()})}
        }).append('<div class="ui-draggable-handle"></div>')
    }

}

var editSession = function(container,data,refresh){

    if (!refresh && $('.editor-root').hasClass('editing')) return

    editClean()

    $('.editor-root, #container').addClass('editing')

    $('#editor').append('<div class="editor-container"></div>')


    var form = $('<div class="form"></div>').appendTo('.editor-container')

    $(`<div class="separator"><span>Tabs</span></div>`).appendTo(form)

    var list = $('<ul class="input"></ul>'),
        wrapper = $('<div class="input-wrapper column"></div>').appendTo(form)


    var editItem = function(i) {
        return function(){
            container.find('.tab').first().siblings().addBack().eq(i).trigger(ev)
        }
    }

    for (var i in data) {
        var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${data[i].label}</a></li>`)
                    .appendTo(list)
                    .click(editItem(i))

        var remove = $('<span><i class="fa fa-remove"></i></span>')
                      .appendTo(item)
                      .click(function(e){
                          e.stopPropagation()
                          data.splice($(this).parent().attr('data-index'),1)
                          updateDom(container,data)
                      })
    }


    list.sortable({
        start:function(){$(this).sortable( "refreshPositions" )},
        forcePlaceholderSize: true,
        items: '.sortables',
        update: function(e,ui){
            var prevIndex = $(ui.item).attr('data-index')
            var newIndex  = $(ui.item).index()

            data.splice(newIndex, 0, data.splice(prevIndex, 1)[0])

            updateDom(container,data)
        }
    })

    var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
        data = data || []
        data.push({})

        updateDom(container,data)
    })

    list.appendTo(wrapper)


    $('.editor-container').append(form)

}

module.exports = {
    editObject:editObject,
    editSession:editSession,
    editClean:editClean
}
